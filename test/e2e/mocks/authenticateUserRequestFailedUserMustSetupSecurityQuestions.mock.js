"use strict";

var AuthenticateUserRequestFailedUserMustSetupSecurityQuestionsMock = (function () {

    function AuthenticateUserRequestFailedUserMustSetupSecurityQuestionsMock() {
        angular.module("AuthenticateUserMock", ["app", "ngMockE2E"])
            .run(function($httpBackend) {

                var mockAuthenticateUserResponse = {
                    "error": "unauthorized",
                    "error_description": "USER_MUST_SETUP_SECURITY_QUESTIONS"
                };

                $httpBackend.whenPOST(/\/uaa\/oauth\/token/).respond(function (method, url, data, headers) {
                    return [401, mockAuthenticateUserResponse, {}];
                });
            });
    }

    return AuthenticateUserRequestFailedUserMustSetupSecurityQuestionsMock;

})();

module.exports = AuthenticateUserRequestFailedUserMustSetupSecurityQuestionsMock;