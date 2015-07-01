"use strict";

var AuthenticateUserRequestFailedBadCredentialsMock = (function () {

    function AuthenticateUserRequestFailedBadCredentialsMock() {
        angular.module("AuthenticateUserMock", ["app", "ngMockE2E"])
            .run(function($httpBackend) {

                var mockAuthenticateUserResponse = {
                    "data": {
                        "error": "unauthorized",
                        "error_description": "BAD_CREDENTIALS"
                    }
                };

                $httpBackend.whenGET(/\/uaa\/oauth\/token/).respond(function (method, url, data, headers) {
                    return [401, mockAuthenticateUserResponse, {}];
                });
            });
    }

    return AuthenticateUserRequestFailedBadCredentialsMock;

})();

module.exports = AuthenticateUserRequestFailedBadCredentialsMock;