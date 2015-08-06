(function () {
    "use strict";

    var AuthApiRestangular,
        $base64,
        mockGlobals = {
            AUTH_API: {
                BASE_URL: "mock base url",
                AUTH: {
                    TOKENS: "mock token url"
                },
                CLIENT_CREDENTIALS: {
                    CLIENT_ID: "mock client id",
                    CLIENT_SECRET: "mock client secret"
                },
                LOGGING: {
                    ENABLED: false
                }
            }
        };

    describe("An Auth API Restangular Service", function () {

        beforeEach(function () {

            module("app.shared.dependencies");
            module("app.shared.core");

            module(function ($provide) {
                $provide.value("globals", mockGlobals);
            });

            module("app.shared.network");
            module("app.shared.auth");
            module("app.shared.api");
            module("app.shared.integration");
            module("app.shared.logger");

            inject(function (_AuthApiRestangular_, _Restangular_, _$base64_) {
                AuthApiRestangular = _AuthApiRestangular_;
                $base64 = _$base64_;
            });

        });

        describe("has a configuration that", function () {

            it("should have a BaseUrl", function () {
                expect(AuthApiRestangular.configuration.baseUrl).toEqual(mockGlobals.AUTH_API.BASE_URL);
            });

            it("should set Full Response to true", function () {
                expect(AuthApiRestangular.configuration.fullResponse).toBeTruthy();
            });

            it("should set the Default Headers", function () {
                var headers = {};

                headers["Content-Type"] = "application/x-www-form-urlencoded";
                headers.Authorization = "Basic " + $base64.encode([
                    mockGlobals.AUTH_API.CLIENT_CREDENTIALS.CLIENT_ID,
                    ":",
                    mockGlobals.AUTH_API.CLIENT_CREDENTIALS.CLIENT_SECRET
                ].join(""));

                expect(AuthApiRestangular.configuration.defaultHeaders).toEqual(headers);
            });
        });

    });

})();