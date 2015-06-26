(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexRequiredSubmit(CommonService, $compile) {
        var directive = {
                restrict: "E",
                require: "^form",
                replace: true,
                templateUrl: "app/shared/widgets/requiredSubmit.directive.html",
                link: link,
                scope: {
                    text: "@"
                }
            },
            _ = CommonService._;


        return directive;

        function setSubmittable(submittable) {
            this.submitButton.attr("ng-disabled", !submittable);

            //recompile the button
            $compile(this.submitButton)(this);
        }

        function onRequiredErrorChange() {
            this.setSubmittable(_.isEmpty(this.formController.$error.required));
        }

        function link(scope, elem, attrs, formCtrl) {
            scope.formController = formCtrl;
            scope.submitButton = elem;
            scope.onRequiredErrorChange = _.bind(onRequiredErrorChange, scope);
            scope.setSubmittable = _.bind(setSubmittable, scope, _);

            scope.$watch("formController.$error.required", scope.onRequiredErrorChange, true);

            //disable form submission by default
            scope.setSubmittable(false);
        }
    }

    angular.module("app.shared.widgets")
        .directive("wexRequiredSubmit", wexRequiredSubmit);
}());