(function () {
    "use strict";

    var AccountMaintenanceRestangular,
        AuthorizationHeaderRequestInterceptor,
        DataExtractorResponseInterceptor,
        globals,
        _;

    describe("An Account Maintenance Restangular Service", function () {

        beforeEach(function () {
            // mock dependencies
            AuthorizationHeaderRequestInterceptor = jasmine.createSpyObj("AuthorizationHeaderRequestInterceptor", ["request"]);
            DataExtractorResponseInterceptor = jasmine.createSpyObj("DataExtractorResponseInterceptor", ["response"]);

            module(function ($provide) {
                $provide.value("AuthorizationHeaderRequestInterceptor", AuthorizationHeaderRequestInterceptor);
                $provide.value("DataExtractorResponseInterceptor", DataExtractorResponseInterceptor);
            });

            inject(function (___, _AccountMaintenanceRestangular_, _globals_) {
                _ = ___;
                AccountMaintenanceRestangular = _AccountMaintenanceRestangular_;
                globals = _globals_;
            });

        });

        describe("has a configuration that", function () {

            it("should have a BaseUrl", function () {
                expect(AccountMaintenanceRestangular.configuration.baseUrl).toEqual(globals.ACCOUNT_MAINTENANCE_API.BASE_URL);
            });

            it("should have a getIdFromElem function", function () {
                expect(AccountMaintenanceRestangular.configuration.getIdFromElem).toEqual(jasmine.any(Function));
            });

            it("should have a setIdToElem function", function () {
                expect(AccountMaintenanceRestangular.configuration.setIdToElem).toEqual(jasmine.any(Function));
            });

            it("should set Full Response to true", function () {
                expect(AccountMaintenanceRestangular.configuration.fullResponse).toBeTruthy();
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
                    AccountMaintenanceRestangular.configuration.fullRequestInterceptor(element, operation, what, url, headers, params);
                });

                it("should call AuthorizationHeaderRequestInterceptor.request", function () {
                    expect(AuthorizationHeaderRequestInterceptor.request).toHaveBeenCalledWith(headers);
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
                    _.forEach(AccountMaintenanceRestangular.configuration.responseInterceptors, function (interceptor) {
                        interceptor(data, operation, what, url, response, deferred);
                    });
                });

                it("should be at least 1 of", function () {
                    expect(AccountMaintenanceRestangular.configuration.responseInterceptors.length).toBeGreaterThan(0);
                });

                it("should call DataExtractorResponseInterceptor.response", function () {
                    expect(DataExtractorResponseInterceptor.response).toHaveBeenCalledWith(data, operation);
                });

            });

            describe("have ErrorInterceptors that", function () {

                it("should be at least 1 of", function () {
                    expect(AccountMaintenanceRestangular.configuration.errorInterceptors.length).toBeGreaterThan(0);
                });
            });
        });

        describe("has a getIdFromElem function that", function () {

            it("should return undefined when elem.accountId does not exist on element with route of 'secure/accounts'", function () {
                var elem = {
                    route: "secure/accounts"
                };

                expect(AccountMaintenanceRestangular.configuration.getIdFromElem(elem)).toBeUndefined();
            });

            it("should return elem.accountId when passed an element with route of 'secure/accounts'", function () {
                var elem = {
                    route: "secure/accounts",
                    accountId: "25b6256",
                    cardId: "2652b56",
                    driverId: "bv 673n7"
                };

                expect(AccountMaintenanceRestangular.configuration.getIdFromElem(elem)).toEqual(elem.accountId);
            });

            it("should return elem.cardId when passed an element with route of 'secure/cards'", function () {
                var elem = {
                    route: "secure/cards",
                    accountId: "25b6256",
                    cardId: "2652b56",
                    driverId: "bv 673n7"
                };

                expect(AccountMaintenanceRestangular.configuration.getIdFromElem(elem)).toEqual(elem.cardId);
            });

            it("should return elem.driverId when passed an element with route of 'secure/drivers'", function () {
                var elem = {
                    route: "secure/drivers",
                    accountId: "25b6256",
                    cardId: "2652b56",
                    driverId: "bv 673n7"
                };

                expect(AccountMaintenanceRestangular.configuration.getIdFromElem(elem)).toEqual(elem.driverId);
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

                AccountMaintenanceRestangular.configuration.setIdToElem(elem, elementId, route);

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

                AccountMaintenanceRestangular.configuration.setIdToElem(elem, elementId, route);

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

                AccountMaintenanceRestangular.configuration.setIdToElem(elem, elementId, route);

                expect(elem.driverId).toEqual(elementId);
            });

        });

    });

})();