(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll
    // jshint maxparams:5

    /* Directive that overrides the visibility of the active back button on the current page.
     * Example usage:
     *
     * <ion-view wex-hide-back-button="true">
     *     ...
     * </ion-view>
     */

    /* @ngInject */
    function wexHideBackButton(_, $rootScope, $interval, ElementUtil, Logger) {
        var directive = {
            restrict: "A",
            link    : link
        };

        return directive;
        //////////////////////

        function applyHideState() {
            var backButton = ElementUtil.findActiveBackButton();

            if (backButton) {
                if (backButton.isolateScope()) {
                    this.backButtonScope = backButton.isolateScope();
                    this.prevState = this.backButtonScope.isHidden();

                    //set the hide state on the back button
                    this.backButtonScope.setHidden(this.wexHideBackButton);
                }
                else {
                    //back button directive hasn't been loaded yet, so wait and try it again later
                    $interval(this.applyHideState, 500, 1);
                }
            }
            else {
                var error = "Failed to set button hide state to " + this.wexHideBackButton;
                Logger.error(error);
                throw new Error(error);
            }
        }

        function onEnter(stateName) {
            if (!this.stateApplied) {
                this.stateApplied = true;
                this.activeViewState = stateName;

                this.applyHideState();
            }
        }

        function onLeave(stateName) {
            if (this.stateApplied && stateName === this.activeViewState) {
                this.removeHideState();

                this.stateApplied = false;
                this.activeViewState = null;
            }
        }

        function removeHideState() {
            if (this.backButtonScope) {
                //restore the previous hide state on the back button
                this.backButtonScope.setHidden(this.prevState);

                this.backButtonScope = null;
            }
            else {
                var error = "Failed to restore back button hide state from " + this.wexHideBackButton;
                Logger.error(error);
                throw new Error(error);
            }
        }

        function link(scope, elem, attrs) {
            var removeLeaveListener,
                vm = scope.wexHideBackButton = {};

            //scope objects:
            vm.wexHideBackButton = Boolean(scope.$eval(attrs.wexHideBackButton));
            vm.prevState = null;
            vm.stateApplied = false;
            vm.backButtonScope = null;
            vm.activeViewState = null;

            vm.applyHideState = _.bind(applyHideState, vm);
            vm.onEnter = _.bind(onEnter, vm);
            vm.onLeave = _.bind(onLeave, vm);
            vm.removeHideState = _.bind(removeHideState, vm);

            //event listeners:
            scope.$on("$ionicView.afterEnter", (event, stateInfo) => vm.onEnter(stateInfo.stateName));

            removeLeaveListener = $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState) { // args: event, toState, toParams, fromState, fromParams
                //only fire this listener once
                removeLeaveListener();

                vm.onLeave(fromState.name);
            });
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexHideBackButton", wexHideBackButton);
})();
