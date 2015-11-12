(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexFieldLabel(CommonService) {
        var directive = {
                restrict: "E",
                transclude: true,
                replace: true,
                link: link,
                templateUrl: "app/shared/widgets/templates/fieldLabel.directive.html",
                scope: {
                    form: "=",
                    fieldName: "@"
                }

            },
            _ = CommonService._;


        return directive;

        function fieldHasError() {
            return this.form.$submitted && CommonService.fieldHasError(this.form[this.fieldName]);
        }

        function link(scope) {
            scope.fieldHasError = _.bind(fieldHasError, scope);
        }
    }

    angular.module("app.shared.widgets")
        .directive("wexFieldLabel", wexFieldLabel);
}());
