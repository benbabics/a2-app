"use strict";

var AuthenticateUserRequestFailedPasswordRequiredMock = (function () {

    function AuthenticateUserRequestFailedPasswordRequiredMock() {
        angular.module("AuthenticateUserMock", ["app", "ngMockE2E"])
            .run(function($httpBackend) {

                var mockAuthenticateUserResponse = {
                    "data": {
                        "error": "unauthorized",
                        "error_description": "PASSWORD_REQUIRED"
                    }
                };

                $httpBackend.whenGET(/\/uaa\/oauth\/token/).respond(function (method, url, data, headers) {
                    return [401, mockAuthenticateUserResponse, {}];
                });
            });
    }

    return AuthenticateUserRequestFailedPasswordRequiredMock;

})();

module.exports = AuthenticateUserRequestFailedPasswordRequiredMock;