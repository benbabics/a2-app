(function () {
    "use strict";

    var $rootScope,
        AuthenticationErrorInterceptor,
        HttpResponseReporterInterceptor,
        Restangular;

    describe("An API Module", function () {

        beforeEach(function () {
            // mock dependencies
            HttpResponseReporterInterceptor = jasmine.createSpyObj("HttpResponseReporterInterceptor", ["response", "responseError"]);
            AuthenticationErrorInterceptor = jasmine.createSpyObj("AuthenticationErrorInterceptor", ["responseError"]);

            module(function ($provide) {
                $provide.value("HttpResponseReporterInterceptor", HttpResponseReporterInterceptor);
                $provide.value("AuthenticationErrorInterceptor", AuthenticationErrorInterceptor);
            });

            inject(function (_$rootScope_, _Restangular_) {
                $rootScope = _$rootScope_;
                Restangular = _Restangular_;
            });

        });

        describe("has a run function that", function () {

            describe("sets the Global Restangular Configuration to", function () {

                describe("have ResponseInterceptors that", function () {

                    var data = {
                            field1: "data1",
                            field2: "data2",
                            field3: "data3"
                        },
                        operation = "get",
                        what = null,
                        url = "/some/url",
                        response = {
                            url: "/some/url"
                        },
                        deferred = null;

                    beforeEach(function () {
                        _.forEach(Restangular.configuration.responseInterceptors, function (interceptor) {
                            interceptor(data, operation, what, url, response, deferred);
                        });
                    });

                    it("should be at least 1 of", function () {
                        expect(Restangular.configuration.responseInterceptors.length).toBeGreaterThan(0);
                    });

                    it("should call HttpResponseReporterInterceptor.response", function () {
                        expect(HttpResponseReporterInterceptor.response).toHaveBeenCalledWith(data, response);
                    });

                });

                describe("have ErrorInterceptors that", function () {

                    it("should be at least 1 of", function () {
                        expect(Restangular.configuration.errorInterceptors.length).toBeGreaterThan(0);
                    });

                    describe("when the ErrorInterceptors are called", function () {
                        var response = {
                                name: "Company One",
                                accountId: "98765",
                                accountNumber: "1234567890123",
                                wexAccountNumber: "979sdc09-98"
                            },
                            deferred = {
                                blah: "blah, blah, blah, ...",
                                deferredStuff: "More stuff in here"
                            },
                            responseHandler = function () {
                                return true;
                            };

                        beforeEach(function () {
                            _.forEach(Restangular.configuration.errorInterceptors, function (interceptor) {
                                interceptor(response, deferred, responseHandler);
                            });
                        });

                        it("should call HttpResponseReporterInterceptor.responseError", function () {
                            expect(HttpResponseReporterInterceptor.responseError).toHaveBeenCalledWith(response);
                        });

                        it("should call AuthenticationErrorInterceptor.responseError", function () {
                            expect(AuthenticationErrorInterceptor.responseError)
                                .toHaveBeenCalledWith(response, deferred, responseHandler);
                        });
                    });

                });

            });

        });

    });

})();