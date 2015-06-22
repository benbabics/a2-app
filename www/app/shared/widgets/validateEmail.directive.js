(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function validateEmail() {
        var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i,
            directive = {
                restrict: "A",
                require: "ngModel",
                link: link
            };

        return directive;
        //////////////////////

        function link(scope, elem, attrs, ctrl) {
            // only apply the validator if ngModel is present and Angular has added the email validator
            if (ctrl && ctrl.$validators.email) {

                // this will overwrite the default Angular email validator
                ctrl.$validators.email = function (modelValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        return true;
                    }

                    return EMAIL_REGEXP.test(modelValue);
                };
            }
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("validateEmail", validateEmail);
})();