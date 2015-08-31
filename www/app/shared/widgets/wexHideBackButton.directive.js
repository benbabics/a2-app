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
            var backButton = getBackButton(this.pageActive),
                backButtonScope;

            if(!this.hideStateApplied) {
                if (backButton) {
                    backButtonScope = backButton.isolateScope();
                    if (backButtonScope) {
                        this.prevHideState = backButtonScope.isHidden();
                        this.hideStateApplied = true;
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

        function getBackButton(pageActive) {
            return (pageActive ?
                CommonService.findActiveBackButton() :
                CommonService.findCachedBackButton()
            );
        }

        function onEnter() {
            this.pageActive = true;
            this.applyHideState();
        }

        function onLeave() {
            this.pageActive = false;
            this.removeHideState();
        }

        function onLogOut() {
            this.removeHideState();
            this.pageActive = false;
        }

        function removeHideState() {
            var backButton = getBackButton(this.pageActive),
                backButtonScope;

            if(this.hideStateApplied) {
                if (backButton) {
                    backButtonScope = backButton.isolateScope();
                    if (backButtonScope) {
                        this.hideStateApplied = false;
                        backButtonScope.setHidden(this.prevHideState);
                        return true;
                    }
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
            scope.pageActive = false;

            scope.applyHideState = _.bind(applyHideState, scope);
            scope.onEnter = _.bind(onEnter, scope);
            scope.onLeave = _.bind(onLeave, scope);
            scope.onLogOut = _.bind(onLogOut, scope);
            scope.removeHideState = _.bind(removeHideState, scope);

            //event listeners
            scope.$on("$ionicView.afterEnter", scope.onEnter);
            scope.$on("$destroy", scope.onLeave);
            scope.$on("userLoggedOut", scope.onLogOut);
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexHideBackButton", wexHideBackButton);
})();