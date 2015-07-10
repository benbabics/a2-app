"use strict";

var AuthenticateUserRequestFailedAuthorizationFailedMock = (function () {

    function AuthenticateUserRequestFailedAuthorizationFailedMock() {
        angular.module("AuthenticateUserMock", ["app", "ngMockE2E"])
            .run(function($httpBackend) {

                var mockAuthenticateUserResponse = {
                    "error": "unauthorized",
                    "error_description": "AUTHORIZATION_FAILED"
                };

                $httpBackend.whenPOST(/\/uaa\/oauth\/token/).respond(function (method, url, data, headers) {
                    return [401, mockAuthenticateUserResponse, {}];
                });
            });
    }

    return AuthenticateUserRequestFailedAuthorizationFailedMock;

})();

module.exports = AuthenticateUserRequestFailedAuthorizationFailedMock;