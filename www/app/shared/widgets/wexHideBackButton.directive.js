(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* Directive that overrides the visibility of the active back button on the current page.
     * Example usage:
     *
     * <ion-view wex-hide-back-button="true">
     *     ...
     * </ion-view>
     */

    /* @ngInject */
    function wexHideBackButton($rootScope, CommonService, Logger) {
        var directive = {
                restrict: "A",
                link    : link
            },
            _ = CommonService._;

        return directive;
        //////////////////////

        function applyHideState() {
            var backButton = CommonService.findActiveBackButton();

            if (backButton && backButton.isolateScope()) {
                this.backButtonScope = backButton.isolateScope();
                this.prevState = this.backButtonScope.isHidden();

                //set the hide state on the back button
                this.backButtonScope.setHidden(this.wexHideBackButton);
            }
            else {
                var error = "Failed to set button hide state " + this.wexHideBackButton;
                Logger.error(error);
                throw new Error(error);
            }
        }

        function onEnter(stateName) {
            if(!this.stateApplied) {
                this.stateApplied = true;
                this.activeViewState = stateName;

                this.applyHideState();
            }
        }

        function onLeave(stateName) {
            if(this.stateApplied && stateName === this.activeViewState) {
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
        .directive("wexHideBackButton", wexHideBackButton);
})();