(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexInputField(_, $compile, ElementUtil) {
        var directive = {
            require    : "^form",
            restrict   : "E",
            transclude : true,
            replace    : true,
            link       : link,
            templateUrl: "app/shared/widgets/templates/inputField.directive.html",
            scope      : {
                label         : "@",
                errors        : "@",
                toolTip       : "@",
                toolTipOptions: "@"
            }

        };

        return directive;

        function fieldHasAnyErrors() {
            return this.form.$submitted && ElementUtil.fieldHasError(this.form[this.fieldName]);
        }

        function fieldHasError(errorType) {
            return this.form.$submitted && _.has(this.form[this.fieldName].$error, errorType);
        }

        function link(scope, element, attrs, formCtrl) {
            scope.form = formCtrl;
            scope.fieldName = element.find("input").attr("name");
            scope.fieldHasError = _.bind(fieldHasError, scope);
            scope.fieldHasAnyErrors = _.bind(fieldHasAnyErrors, scope);

            if (!_.isEmpty(scope.errors)) {
                var fieldErrors = JSON.parse(scope.errors);
                var fieldErrorsElement = angular.element("<div class=\"wex-field-errors\"></div>");

                // Add the validation error messaging for the field
                _.forEach(fieldErrors, function (message, type) {
                    var errorElement = angular.element("<div wex-field-error></div>");
                    errorElement.attr("ng-if", "fieldHasError('" + type + "')");
                    errorElement.text(message);
                    fieldErrorsElement.append(errorElement);
                });

                $compile(fieldErrorsElement.contents())(scope);
                element.append(fieldErrorsElement);
            }
        }
    }

    angular.module("app.shared.widgets")
        .directive("wexInputField", wexInputField);
}());