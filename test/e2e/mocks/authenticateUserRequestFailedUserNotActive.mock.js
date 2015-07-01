"use strict";

var AuthenticateUserRequestFailedUserNotActiveMock = (function () {

    function AuthenticateUserRequestFailedUserNotActiveMock() {
        angular.module("AuthenticateUserMock", ["app", "ngMockE2E"])
            .run(function($httpBackend) {

                var mockAuthenticateUserResponse = {
                    "error": "unauthorized",
                    "error_description": "USER_NOT_ACTIVE"
                };

                $httpBackend.whenPOST(/\/uaa\/oauth\/token/).respond(function (method, url, data, headers) {
                    return [401, mockAuthenticateUserResponse, {}];
                });
            });
    }

    return AuthenticateUserRequestFailedUserNotActiveMock;

})();

module.exports = AuthenticateUserRequestFailedUserNotActiveMock;