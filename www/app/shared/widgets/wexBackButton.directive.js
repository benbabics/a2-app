(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexBackButton(_, $state, $ionicHistory, $interval) {
        var directive = {
                restrict  : "E",
                replace   : true,
                transclude: true,
                link      : link,
                templateUrl: "app/shared/widgets/templates/backButton.directive.html",
                scope     : {
                    backState: "@?",
                    hide     : "&?"
                }
            };

        return directive;
        //////////////////////

        function getOverrideBackState() {
            return this.backState;
        }

        function goBack() {
            if (this.backState) {
                $state.go(this.backState);
            }
            else {
                $ionicHistory.goBack();
            }

        }

        function isHidden() {
            return this.hide();
        }

        function overrideBackState(backState) {
            if (_.isString(backState)) {
                this.backState = backState;
            }
            else {
                this.backState = null;
            }
        }

        function pageHasBack() {
            return (!this.isHidden() && (this.backState || $ionicHistory.backView()));
        }

        function setHidden(hidden) {
            var headerController = this.backButtonElem.controller("ionHeaderBar");

            this.hide = _.constant(hidden);

            //realign the header elements
            if (headerController) {
                $interval(function () {
                    headerController.align();
                }, 35, 1);
            }
        }

        function link(scope, elem) { // args: scope, elem, attrs
            //scope objects:
            scope.backButtonElem = elem;

            scope.getOverrideBackState = _.bind(getOverrideBackState, scope);
            scope.goBack = _.bind(goBack, scope);
            scope.isHidden = _.bind(isHidden, scope);
            scope.overrideBackState = _.bind(overrideBackState, scope);
            scope.pageHasBack = _.bind(pageHasBack, scope);
            scope.setHidden = _.bind(setHidden, scope);

            //set hide to false by default
            scope.setHidden(scope.hide ? scope.hide() : false);
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexBackButton", wexBackButton);
})();
