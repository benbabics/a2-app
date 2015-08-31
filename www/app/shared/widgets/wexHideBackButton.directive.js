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
    function wexHideBackButton(CommonService, Logger) {
        var directive = {
                restrict: "A",
                link    : link
            },
            _ = CommonService._;

        return directive;
        //////////////////////

        function applyHideState() {
            var backButton = CommonService.findActiveBackButton(),
                backButtonScope;

            if(!this.hideStateApplied) {
                if (backButton) {
                    backButtonScope = backButton.isolateScope();
                    if (backButtonScope) {
                        this.prevHideState = backButtonScope.isHidden();
                        this.hideStateApplied = true;
                        this.appliedBackButtonHideScope = backButtonScope;
                        backButtonScope.setHidden(this.wexHideBackButton);
                        return true;
                    }
                }

                var error = "Failed to set button hide state " + this.wexHideBackButton;
                Logger.error(error);
                throw new Error(error);
            }
            return false;
        }

        function removeHideState() {
            if (this.hideStateApplied) {
                if (this.appliedBackButtonHideScope) {

                    this.hideStateApplied = false;
                    this.appliedBackButtonHideScope.setHidden(this.prevHideState);
                    this.appliedBackButtonHideScope = null;
                    return true;
                }

                var error = "Failed to restore back button hide state from " + this.wexHideBackButton;
                Logger.error(error);
                throw new Error(error);
            }
            return false;
        }

        function link(scope, elem, attrs) {
            //scope objects:
            scope.wexHideBackButton = Boolean(scope.$eval(attrs.wexHideBackButton));
            scope.prevHideState = null;
            scope.hideStateApplied = false;
            scope.appliedBackButtonHideScope = null;

            scope.applyHideState = _.bind(applyHideState, scope);
            scope.removeHideState = _.bind(removeHideState, scope);

            //event listeners
            scope.$on("$ionicView.afterEnter", scope.applyHideState);
            scope.$on("$ionicView.beforeLeave", scope.removeHideState);
            scope.$on("$destroy", scope.removeHideState);
            scope.$on("userLoggedOut", scope.removeHideState);
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexHideBackButton", wexHideBackButton);
})();