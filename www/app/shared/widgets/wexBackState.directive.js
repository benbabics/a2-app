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
    function wexBackState(CommonService, Logger) {
        var directive = {
                restrict: "A",
                link    : link
            },
            _ = CommonService._;

        return directive;
        //////////////////////

        function applyBackState() {
            var backButton = CommonService.findActiveBackButton(),
                backButtonScope;

            if(!this.backStateApplied) {
                if (this.wexBackState && backButton) {
                    backButtonScope = backButton.isolateScope();
                    if (backButtonScope) {
                        this.prevBackState = backButtonScope.getOverrideBackState();
                        this.backStateApplied = true;
                        this.appliedBackButtonBackScope = backButtonScope;
                        backButtonScope.overrideBackState(this.wexBackState);
                        return true;
                    }
                }

                var error = "Failed to override back button state to " + this.wexBackState;
                Logger.error(error);
                throw new Error(error);
            }
            return false;
        }

        function removeBackState() {
            if(this.backStateApplied) {
                if (this.appliedBackButtonBackScope) {

                    this.backStateApplied = false;
                    this.appliedBackButtonBackScope.overrideBackState(this.prevBackState);
                    this.appliedBackButtonBackScope = null;
                    return true;
                }

                var error = "Failed to restore back button state from " + this.wexBackState;
                Logger.error(error);
                throw new Error(error);
            }
            return false;
        }

        function link(scope, elem, attrs) {
            //scope objects:
            scope.wexBackState = attrs.wexBackState;
            scope.prevBackState = null;
            scope.backStateApplied = false;
            scope.appliedBackButtonBackScope = null;

            scope.applyBackState = _.bind(applyBackState, scope);
            scope.removeBackState = _.bind(removeBackState, scope);

            //event listeners
            scope.$on("$ionicView.afterEnter", scope.applyBackState);
            scope.$on("$ionicView.beforeLeave", scope.removeBackState);
            scope.$on("$destroy", scope.removeBackState);
            scope.$on("userLoggedOut", scope.removeBackState);
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexBackState", wexBackState);
})();