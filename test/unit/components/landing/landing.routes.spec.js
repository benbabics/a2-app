(function () {
    "use strict";

    fdescribe("A Landing Module Route Config", function () {

        var $injector,
            $q,
            $rootScope,
            $state,
            mockInvoiceSummary,
            mockUser,
            globals,
            InvoiceManager,
            PaymentManager,
            UserManager,
            BrandManager,
            mockAccountId,
            WexCache;

        beforeAll(function () {
            this.includeHtml = true;
        });

        beforeEach(function () {

            // mock dependencies
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["fetchCurrentInvoiceSummary"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["fetchScheduledPaymentsCount"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            BrandManager = jasmine.createSpyObj("BrandManager ", ["getUserBrandAssetBySubtype", "getGenericAnalyticsTrackingId", "loadBundledBrand"]);
            WexCache = jasmine.createSpyObj("WexCache", ["clearPropertyValue", "fetchPropertyValue"]);
            mockAccountId = TestUtils.getRandomStringThatIsAlphaNumeric(10);

            module(function($provide) {
                $provide.value("accountId", mockAccountId);
                $provide.value("InvoiceManager", InvoiceManager);
                $provide.value("PaymentManager", PaymentManager);
                $provide.value("UserManager", UserManager);
                $provide.value("BrandManager", BrandManager);
                $provide.value("WexCache", WexCache);
            });

            inject(function (_$injector_, _$q_, _$rootScope_, _$state_, _globals_,
                             AuthenticationManager, InvoiceSummaryModel, UserAccountModel, UserModel) {
                $injector = _$injector_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;

                globals = _globals_;

                mockInvoiceSummary = TestUtils.getRandomInvoiceSummary(InvoiceSummaryModel);
                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel, globals.ONLINE_APPLICATION);
                mockUser.billingCompany.accountId = mockAccountId;

                spyOn(AuthenticationManager, "userLoggedIn").and.returnValue(true);
            });

            UserManager.getUser.and.returnValue(mockUser);
        });

        describe("has a landing state that", function () {
            var state,
                stateName = "landing";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/landing?{showFingerprintBanner:bool}");
            });

            it("should define a view on the root view container", function () {
                expect(state.views).toBeDefined();
                expect(state.views["@"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/landing");
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    WexCache.fetchPropertyValue.and.callFake(function (key, callback) {
                        return callback();
                    });

                    $state.go(stateName);
                });

                //TODO: [REVIEW] might need to fix
                // it("should transition successfully", function () {
                //     $rootScope.$digest();
                //
                //     expect($state.current.name).toBe(stateName);
                // });

                // it("should resolve a fetchBrandLogo function", function () {
                //     $rootScope.$digest();
                //
                //     expect($injector.invoke($state.current.views["@"].resolve.fetchBrandLogo)).toBeDefined();
                // });

                it("should resolve a fetchCurrentInvoiceSummary function", function () {
                    $rootScope.$digest();

                    expect($injector.invoke($state.current.views["@"].resolve.fetchCurrentInvoiceSummary)).toBeDefined();
                });

                it("should resolve a fetchScheduledPaymentsCount function", function () {
                    $rootScope.$digest();

                    expect($injector.invoke($state.current.views["@"].resolve.fetchScheduledPaymentsCount)).toBeDefined();
                });

                // it("should call this.AnalyticsUtil.trackView", function () {
                //     $rootScope.$digest();
                //
                //     expect(this.AnalyticsUtil.trackView).toHaveBeenCalledWith(globals.LANDING.CONFIG.ANALYTICS.pageName);
                // });

                describe("when fetchCurrentInvoiceSummary is called", function () {

                    beforeEach(function () {
                        $rootScope.$digest();

                        $injector.invoke($state.current.views["@"].resolve.fetchCurrentInvoiceSummary)();
                    });

                    it("should call InvoiceManager.fetchCurrentInvoiceSummary with the correct account id", function () {
                        expect(InvoiceManager.fetchCurrentInvoiceSummary).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                    });
                });

                describe("when fetchScheduledPaymentsCount is called", function () {

                    beforeEach(function () {
                        $rootScope.$digest();

                        $injector.invoke($state.current.views["@"].resolve.fetchScheduledPaymentsCount)();
                    });

                    it("should call PaymentManager.fetchScheduledPaymentsCount with the correct account id", function () {
                        expect(PaymentManager.fetchScheduledPaymentsCount).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                    });
                });


            });
        });
    });
})();