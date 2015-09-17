(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* Directive that overrides which state the active back button on the current page will redirect to.
     * Example usage:
     *
     * <ion-view wex-back-state="user.auth.login">
     *     ...
     * </ion-view>
     */

    /* @ngInject */
    function wexBackState($rootScope, $interval, CommonService, Logger) {
        var directive = {
                restrict: "A",
                link    : link
            },
            _ = CommonService._;

        return directive;
        //////////////////////

        function applyBackState() {
            var backButton = CommonService.findActiveBackButton();

            if (backButton) {
                if(backButton.isolateScope()) {
                    this.backButtonScope = backButton.isolateScope();
                    this.prevState = this.backButtonScope.getOverrideBackState();

                    //set the override state on the button
                    this.backButtonScope.overrideBackState(this.wexBackState);
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

        function onEnter(stateName) {
            if(this.wexBackState && !this.stateApplied) {
                this.stateApplied = true;
                this.activeViewState = stateName;

                this.applyBackState();
            }
        }

        function onLeave(stateName) {
            if(this.stateApplied && stateName === this.activeViewState) {
                this.removeBackState();

                this.stateApplied = false;
                this.activeViewState = null;
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
            var removeLeaveListener,
                vm = scope.wexBackState = {};

            //vm objects:
            vm.wexBackState = attrs.wexBackState;
            vm.prevState = null;
            vm.stateApplied = false;
            vm.backButtonScope = null;
            vm.activeViewState = null;

            vm.applyBackState = _.bind(applyBackState, vm);
            vm.onEnter = _.bind(onEnter, vm);
            vm.onLeave = _.bind(onLeave, vm);
            vm.removeBackState = _.bind(removeBackState, vm);

            //event listeners:
            scope.$on("$ionicView.afterEnter", function(event, stateInfo) {
                vm.onEnter(stateInfo.stateName);
            });

            removeLeaveListener = $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
                //only fire this listener once
                removeLeaveListener();

                vm.onLeave(fromState.name);
            });
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexBackState", wexBackState);
})();