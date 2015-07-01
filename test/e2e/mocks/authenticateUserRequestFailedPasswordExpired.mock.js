"use strict";

var AuthenticateUserRequestFailedPasswordExpiredMock = (function () {

    function AuthenticateUserRequestFailedPasswordExpiredMock() {
        angular.module("AuthenticateUserMock", ["app", "ngMockE2E"])
            .run(function($httpBackend) {

                var mockAuthenticateUserResponse = {
                    "error": "unauthorized",
                    "error_description": "PASSWORD_EXPIRED"
                };

                $httpBackend.whenPOST(/\/uaa\/oauth\/token/).respond(function (method, url, data, headers) {
                    return [401, mockAuthenticateUserResponse, {}];
                });
            });
    }

    return AuthenticateUserRequestFailedPasswordExpiredMock;

})();

module.exports = AuthenticateUserRequestFailedPasswordExpiredMock;