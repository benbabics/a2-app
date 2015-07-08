(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function LoginController($state, globals, AuthenticationManager, CommonService) {

        var vm = this;
        vm.config = globals.USER_LOGIN.CONFIG;
        vm.user = {};
        vm.authenticateUser = authenticateUser;

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            clearErrorMessage();
        }

        function authenticateUser() {
            clearErrorMessage();

            CommonService.loadingBegin();

            return AuthenticationManager.authenticate(vm.user.username, vm.user.password)
                .then(function() {
                    // transition to the landing page
                    $state.go("landing");
                })
                .catch(function (failedAuthenticationError) {
                    var errorCode = getErrorCode(failedAuthenticationError);
                    vm.globalError = vm.config.serverErrors[errorCode] || vm.config.serverErrors.DEFAULT;
                })
                .finally(function () {
                    CommonService.loadingComplete();
                });
        }

        function clearErrorMessage() {
            //clear any previous error
            vm.globalError = false;
        }

        /**
         * Decomposes the failedAuthenticationError and pulls out the appropriate error code from
         * the formatted error message.
         *
         * An example error message is:
         * "Getting Auth Token failed: There is a type for this error: BAD_CREDENTIALS"
         *
         * The error code for the above message is: BAD_CREDENTIALS
         *
         * @param failedAuthenticationError
         * @return string the error code
         */
        function getErrorCode(failedAuthenticationError) {
            var errorCode = "";

            if (_.isString(failedAuthenticationError.message)) {
                var errorMessage = failedAuthenticationError.message;

                var index = errorMessage.lastIndexOf(" ");

                if (index > 0) {
                    errorCode = errorMessage.substr(index + 1); // Add 1 to move past the space
                }
            }

            return errorCode;
        }
    }

    angular.module("app.components.user.auth")
        .controller("LoginController", LoginController);
}());