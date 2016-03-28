(function () {
    "use strict";

    var UnsecureConfigurationApiRestangular,
        DataExtractorResponseInterceptor,
        globals,
        _;

    describe("An Unsecure Configuration Restangular Service", function () {

        beforeEach(function () {

            module("app.shared");

            // mock dependencies
            DataExtractorResponseInterceptor = jasmine.createSpyObj("DataExtractorResponseInterceptor", ["response"]);

            module(function ($provide) {
                $provide.value("DataExtractorResponseInterceptor", DataExtractorResponseInterceptor);
            });

            inject(function (___, _UnsecureConfigurationApiRestangular_, _globals_) {
                _ = ___;
                UnsecureConfigurationApiRestangular = _UnsecureConfigurationApiRestangular_;
                globals = _globals_;
            });

        });

        describe("has a configuration that", function () {

            it("should have a BaseUrl", function () {
                expect(UnsecureConfigurationApiRestangular.configuration.baseUrl).toEqual(globals.CONFIGURATION_API.BASE_URL);
            });

            it("should have a getIdFromElem function", function () {
                expect(UnsecureConfigurationApiRestangular.configuration.getIdFromElem).toEqual(jasmine.any(Function));
            });

            it("should have a setIdToElem function", function () {
                expect(UnsecureConfigurationApiRestangular.configuration.setIdToElem).toEqual(jasmine.any(Function));
            });

            it("should set Full Response to true", function () {
                expect(UnsecureConfigurationApiRestangular.configuration.fullResponse).toBeTruthy();
            });

            describe("has a FullRequestInterceptor that", function () {

                var element = null,
                    operation = null,
                    what = null,
                    url = null,
                    headers = {
                        header1: "Header 1",
                        header2: "Header 2",
                        header3: "Header 3"
                    },
                    params = null;

                beforeEach(function () {
                    UnsecureConfigurationApiRestangular.configuration.fullRequestInterceptor(element, operation, what, url, headers, params);
                });

            });

            describe("has ResponseInterceptors that", function () {

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
                    _.forEach(UnsecureConfigurationApiRestangular.configuration.responseInterceptors, function (interceptor) {
                        interceptor(data, operation, what, url, response, deferred);
                    });
                });

                it("should be at least 1 of", function () {
                    expect(UnsecureConfigurationApiRestangular.configuration.responseInterceptors.length).toBeGreaterThan(0);
                });

                it("should call DataExtractorResponseInterceptor.response", function () {
                    expect(DataExtractorResponseInterceptor.response).toHaveBeenCalledWith(data, operation);
                });

            });

            describe("have ErrorInterceptors that", function () {

                it("should be at least 1 of", function () {
                    expect(UnsecureConfigurationApiRestangular.configuration.errorInterceptors.length).toBeGreaterThan(0);
                });
            });
        });

        describe("has a getIdFromElem function that", function () {

            it("should return undefined when elem.accountId does not exist on element with route of 'secure/accounts'", function () {
                var elem = {
                    route: "secure/accounts"
                };

                expect(UnsecureConfigurationApiRestangular.configuration.getIdFromElem(elem)).toBeUndefined();
            });

            it("should return elem.accountId when passed an element with route of 'secure/accounts'", function () {
                var elem = {
                    route: "secure/accounts",
                    accountId: "25b6256",
                    cardId: "2652b56",
                    driverId: "bv 673n7"
                };

                expect(UnsecureConfigurationApiRestangular.configuration.getIdFromElem(elem)).toEqual(elem.accountId);
            });

            it("should return elem.cardId when passed an element with route of 'secure/cards'", function () {
                var elem = {
                    route: "secure/cards",
                    accountId: "25b6256",
                    cardId: "2652b56",
                    driverId: "bv 673n7"
                };

                expect(UnsecureConfigurationApiRestangular.configuration.getIdFromElem(elem)).toEqual(elem.cardId);
            });

            it("should return elem.driverId when passed an element with route of 'secure/drivers'", function () {
                var elem = {
                    route: "secure/drivers",
                    accountId: "25b6256",
                    cardId: "2652b56",
                    driverId: "bv 673n7"
                };

                expect(UnsecureConfigurationApiRestangular.configuration.getIdFromElem(elem)).toEqual(elem.driverId);
            });

        });

        describe("has a setIdFromElem function that", function () {

            it("should set elem.accountId when passed an element with route of 'secure/accounts'", function () {
                var elem = {
                        accountId: "25b6256",
                        cardId: "2652b56",
                        driverId: "bv 673n7"
                    },
                    elementId = "n6726723672m7",
                    route = "secure/accounts";

                UnsecureConfigurationApiRestangular.configuration.setIdToElem(elem, elementId, route);

                expect(elem.accountId).toEqual(elementId);
            });

            it("should set elem.cardId when passed an element with route of 'secure/cards'", function () {
                var elem = {
                        accountId: "25b6256",
                        cardId: "2652b56",
                        driverId: "bv 673n7"
                    },
                    elementId = "n6726723672m7",
                    route = "secure/cards";

                UnsecureConfigurationApiRestangular.configuration.setIdToElem(elem, elementId, route);

                expect(elem.cardId).toEqual(elementId);
            });

            it("should set elem.driverId when passed an element with route of 'secure/drivers'", function () {
                var elem = {
                        accountId: "25b6256",
                        cardId: "2652b56",
                        driverId: "bv 673n7"
                    },
                    elementId = "n6726723672m7",
                    route = "secure/drivers";

                UnsecureConfigurationApiRestangular.configuration.setIdToElem(elem, elementId, route);

                expect(elem.driverId).toEqual(elementId);
            });

        });

    });

})();
