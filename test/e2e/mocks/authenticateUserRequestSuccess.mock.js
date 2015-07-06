"use strict";

var AuthenticateUserRequestSuccessMock = (function () {

    function AuthenticateUserRequestSuccessMock() {
        angular.module("AuthenticateUserMock", ["app", "ngMockE2E"])
            .run(function ($httpBackend) {

                var mockAuthenticateUserResponse = {
                    "access_token": "eyJhbGciOiJSUzI1NiJ9.jmYAFrRhA1GrBGya2_gbDE_1yHDGKj6u85IM1c3CKH8h6I72",
                    "token_type": "bearer",
                    "refresh_token": "eyJhbGciOiJSUzI1NiJ9.eyJvbmxpbmVfYXBwbGljYXRpb24iOiJXT0xfTlAiLCJ1c2Vy",
                    "expires_in": 43199,
                    "scope": "read",
                    "jti": "8dca37e7-dea1-42be-a266-d073dbc15233"
                };

                $httpBackend.whenPOST(/\/uaa\/oauth\/token/).respond(function (method, url, data, headers) {
                    return [200, mockAuthenticateUserResponse, {}];
                });
            });
    }

    return AuthenticateUserRequestSuccessMock;

})();

module.exports = AuthenticateUserRequestSuccessMock;