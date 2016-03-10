(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexRequired(_) {
        var directive = {
            restrict: "C",
            require : "ngModel",
            link    : link,
            scope   : {}
        };

        return directive;

        function onFieldTextChange(scope) {
            var domElem = scope.inputElement[0];

            //if the field's value is empty and required hasn't been set
            if (!scope.inputController.$error.required &&
                (!domElem.value || domElem.value === domElem.placeholder)) {

                //force required to be set
                scope.inputController.$setValidity("required", false);
                scope.$digest();

                //TODO - Fields with UI-Mask need this or else the required validation error is still ignored. Why?
                scope.inputElement.triggerHandler("change");
            }
        }

        function link(scope, elem, attrs, ctrl) {
            scope.inputController = ctrl;
            scope.inputElement = elem;

            elem.on("change keydown keyup", _.partial(onFieldTextChange, scope));
        }
    }

    angular.module("app.shared.widgets")
        .directive("wexRequired", wexRequired);
}());
