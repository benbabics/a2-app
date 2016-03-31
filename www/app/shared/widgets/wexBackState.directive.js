(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll
    // jshint maxparams:6

    /* Directive that overrides which state the active back button on the current page will redirect to.
     * Example usage:
     *
     * <ion-view wex-back-state="user.auth.login">
     *     ...
     * </ion-view>
     */

    /* @ngInject */
    function wexBackState(_, $interval, $parse, ElementUtil, FlowUtil, Logger) {
        //Private members
        var activeBackState;

        //Public members
        var directive = {
                restrict: "A",
                link    : link
            };

        return directive;
        //////////////////////

        function applyBackState() {
            var backButton = ElementUtil.findActiveBackButton();

            if (backButton) {
                if (backButton.isolateScope()) {
                    this.backButtonScope = backButton.isolateScope();
                    this.prevState = this.backButtonScope.getOverrideBackState();

                    //set the override state on the button
                    this.backButtonScope.overrideBackState(this.wexBackState, this.wexBackParams, this.wexBackOptions);
                }
                else {
                    //back button directive hasn't been loaded yet, so wait and try it again later
                    $interval(this.applyBackState, 500, 1);
                }
            }
            else {
                var error = "Failed to override back button state to " + this.wexBackState;
                Logger.error(error);
                throw new Error(error);
            }
        }

        function onEnter() {
            if (activeBackState !== this) {

                if (activeBackState) {
                    activeBackState.onLeave();
                }

                if (this.wexBackState) {
                    this.applyBackState();
                }

                activeBackState = this;
            }
        }

        function onLeave() {
            if (activeBackState === this) {

                if (this.wexBackState) {
                    this.removeBackState();
                }

                activeBackState = null;
            }
        }

        function removeBackState() {
            if (this.backButtonScope) {
                //restore the previous override state on the back button
                this.backButtonScope.overrideBackState(this.prevState);

                this.backButtonScope = null;
            }
            else {
                var error = "Failed to restore back button state from " + this.wexBackState;
                Logger.error(error);
                throw new Error(error);
            }
        }

        function link(scope, elem, attrs) {
            var initialState,
                removeListeners = [],
                vm = scope.wexBackState = {},
                enterHandler = function (stateName) {
                    initialState = stateName;

                    vm.onEnter();
                },
                leaveHandler = function (stateName) {
                    //ignore leave events that happen on a different view
                    if (stateName === initialState) {
                        vm.onLeave();
                    }
                };

            //vm objects:
            vm.wexBackState = attrs.wexBackState;
            vm.wexBackParams = attrs.wexBackParams ? $parse(attrs.wexBackParams)(scope) : null;
            vm.wexBackOptions = attrs.wexBackOptions ? $parse(attrs.wexBackOptions)(scope) : null;
            vm.prevState = null;
            vm.backButtonScope = null;

            vm.applyBackState = _.bind(applyBackState, vm);
            vm.onEnter = _.bind(onEnter, vm);
            vm.onLeave = _.bind(onLeave, vm);
            vm.removeBackState = _.bind(removeBackState, vm);

            //event listeners:
            removeListeners.concat(FlowUtil.onPageEnter(enterHandler, scope, {global: false, once: false}));
            removeListeners.concat(FlowUtil.onPageLeave(leaveHandler, scope, {once: false}));

            scope.$on("$destroy", function () {
                _.invokeMap(removeListeners, _.call);
            });
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexBackState", wexBackState);
})();
