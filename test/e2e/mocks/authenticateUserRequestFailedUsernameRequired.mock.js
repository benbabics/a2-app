"use strict";

var AuthenticateUserRequestFailedUsernameRequiredMock = (function () {

    function AuthenticateUserRequestFailedUsernameRequiredMock() {
        angular.module("AuthenticateUserMock", ["app", "ngMockE2E"])
            .run(function($httpBackend) {

                var mockAuthenticateUserResponse = {
                    "error": "unauthorized",
                    "error_description": "USERNAME_REQUIRED"
                };

                $httpBackend.whenPOST(/\/uaa\/oauth\/token/).respond(function (method, url, data, headers) {
                    return [401, mockAuthenticateUserResponse, {}];
                });
            });
    }

    return AuthenticateUserRequestFailedUsernameRequiredMock;

})();

module.exports = AuthenticateUserRequestFailedUsernameRequiredMock;