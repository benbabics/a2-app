(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    function wexVehicleId() {
        var directive = {
                restrict: "A",
                require: "ngModel",
                link: link
            };

        return directive;

        function link (scope, elem, attrs, ctrl) {

            ctrl.$validators.wexVehicleId = function (modelValue, viewValue) {
                if (viewValue) {
                    return viewValue.length === 4 || viewValue.length === 6 || viewValue.length === 0;
                } else {
                    //the field is empty, so return true and let required deal with it.
                    return true;
                }
            };
        }
    }

    angular.module("app.shared.widgets")
        .directive("wexVehicleId", wexVehicleId);
})();
