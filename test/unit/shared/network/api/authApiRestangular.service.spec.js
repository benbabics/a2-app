(function () {
    "use strict";

    var AuthApiRestangular,
        $base64,
        globals = {
            AUTH_API: {
                BASE_URL: "mock base url",
                AUTH: {
                    TOKENS: "mock token url"
                },
                CLIENT_CREDENTIALS: {
                    CLIENT_ID: "mock client id",
                    CLIENT_SECRET: "mock client secret"
                }
            }
        };

    describe("An Auth API Restangular Service", function () {

        beforeEach(function () {

            module("app.shared.dependencies");

            module(function ($provide) {
                $provide.value("globals", globals);
            });

            module("app.shared.network");
            module("app.shared.auth");
            module("app.shared.api");

            inject(function (_AuthApiRestangular_, _Restangular_, _$base64_) {
                AuthApiRestangular = _AuthApiRestangular_;
                $base64 = _$base64_;
            });

        });

        describe("has a configuration that", function () {

            it("should have a BaseUrl", function () {
                expect(AuthApiRestangular.configuration.baseUrl).toEqual(globals.AUTH_API.BASE_URL);
            });

            it("should set Full Response to true", function () {
                expect(AuthApiRestangular.configuration.fullResponse).toBeTruthy();
            });

            it("should set the Default Headers", function () {
                var headers = {};

                headers["Content-Type"] = "application/x-www-form-urlencoded";
                headers.Authorization = "Basic " + $base64.encode([
                    globals.AUTH_API.CLIENT_CREDENTIALS.CLIENT_ID,
                    ":",
                    globals.AUTH_API.CLIENT_CREDENTIALS.CLIENT_SECRET
                ].join(""));

                expect(AuthApiRestangular.configuration.defaultHeaders).toEqual(headers);
            });
        });

    });

})();