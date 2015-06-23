(function () {
    "use strict";

    var AuthApiRestangular,
        globals,
        $base64;

    describe("An Auth API Restangular Service", function () {

        beforeEach(function () {

            module("app.shared");

            inject(function (_AuthApiRestangular_, _Restangular_, _globals_, _$base64_) {
                AuthApiRestangular = _AuthApiRestangular_;
                globals = _globals_;
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
                headers.Authorization = "Basic " + $base64.encode(
                        "@@@STRING_REPLACE_AUTH_CLIENT_ID@@@:@@@STRING_REPLACE_AUTH_CLIENT_SECRET@@@");

                expect(AuthApiRestangular.configuration.defaultHeaders).toEqual(headers);
            });
        });

    });

})();