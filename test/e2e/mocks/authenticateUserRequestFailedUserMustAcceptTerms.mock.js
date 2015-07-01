"use strict";

var AuthenticateUserRequestFailedUserMustAcceptTermsMock = (function () {

    function AuthenticateUserRequestFailedUserMustAcceptTermsMock() {
        angular.module("AuthenticateUserMock", ["app", "ngMockE2E"])
            .run(function($httpBackend) {

                var mockAuthenticateUserResponse = {
                    "error": "unauthorized",
                    "error_description": "USER_MUST_ACCEPT_TERMS"
                };

                $httpBackend.whenPOST(/\/uaa\/oauth\/token/).respond(function (method, url, data, headers) {
                    return [401, mockAuthenticateUserResponse, {}];
                });
            });
    }

    return AuthenticateUserRequestFailedUserMustAcceptTermsMock;

})();

module.exports = AuthenticateUserRequestFailedUserMustAcceptTermsMock;