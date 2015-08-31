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
            var backButton = getBackButton(this.pageActive),
                backButtonScope;

            if(!this.backStateApplied) {
                if (this.wexBackState && backButton) {
                    backButtonScope = backButton.isolateScope();
                    if (backButtonScope) {
                        this.prevBackState = backButtonScope.getOverrideBackState();
                        this.backStateApplied = true;
                        backButtonScope.overrideBackState(this.wexBackState);
                        return true;
                    }
                }

                var error = "Failed to override back button state to " + this.wexBackState;
                Logger.error(error);
                throw new Error(error);
            }
        }

        function getBackButton(pageActive) {
            return (pageActive ?
                CommonService.findActiveBackButton() :
                CommonService.findCachedBackButton()
            );
        }

        function onEnter() {
            this.pageActive = true;
            this.applyBackState();
        }

        function onLeave() {
            this.pageActive = false;
            this.removeBackState();
        }

        function onLogOut() {
            this.removeBackState();
            this.pageActive = false;
        }

        function removeBackState() {
            var backButton = getBackButton(this.pageActive),
                backButtonScope;

            if(this.backStateApplied) {
                if (backButton) {
                    backButtonScope = backButton.isolateScope();
                    if (backButtonScope) {
                        this.backStateApplied = false;
                        backButtonScope.overrideBackState(this.prevBackState);
                        return true;
                    }
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
            scope.pageActive = false;

            scope.applyBackState = _.bind(applyBackState, scope);
            scope.onEnter = _.bind(onEnter, scope);
            scope.onLeave = _.bind(onLeave, scope);
            scope.onLogOut = _.bind(onLogOut, scope);
            scope.removeBackState = _.bind(removeBackState, scope);

            //event listeners
            scope.$on("$ionicView.afterEnter", scope.onEnter);
            scope.$on("$destroy", scope.onLeave);
            scope.$on("userLoggedOut", scope.onLogOut);
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexBackState", wexBackState);
})();