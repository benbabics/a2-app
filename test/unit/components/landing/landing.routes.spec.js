(function () {
    "use strict";

    describe("A Landing Module Route Config", function () {

        var $injector,
            $q,
            $rootScope,
            $state,
            mockInvoiceSummary,
            mockUser,
            globals,
            ASSET_SUBTYPES,
            InvoiceManager,
            PaymentManager,
            UserManager,
            BrandUtil,
            BrandManager,
            mockAccountId,
            BrandAssetModel,
            WexCache;

        beforeAll(function () {
            this.includeHtml = true;
        });

        beforeEach(function () {

            // mock dependencies
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["fetchCurrentInvoiceSummary"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["fetchScheduledPaymentsCount"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            BrandUtil = jasmine.createSpyObj("BrandUtil", ["getAssetResourceData"]);
            BrandManager = jasmine.createSpyObj("BrandManager ", ["getUserBrandAssetBySubtype", "getGenericAnalyticsTrackingId", "loadBundledBrand"]);
            WexCache = jasmine.createSpyObj("WexCache", ["clearPropertyValue", "fetchPropertyValue"]);
            mockAccountId = TestUtils.getRandomStringThatIsAlphaNumeric(10);

            module(function($provide) {
                $provide.value("accountId", mockAccountId);
                $provide.value("InvoiceManager", InvoiceManager);
                $provide.value("PaymentManager", PaymentManager);
                $provide.value("UserManager", UserManager);
                $provide.value("BrandUtil", BrandUtil);
                $provide.value("BrandManager", BrandManager);
                $provide.value("WexCache", WexCache);
            });

            inject(function (_$injector_, _$q_, _$rootScope_, _$state_, _globals_, _BrandAssetModel_,
                             AuthenticationManager, InvoiceSummaryModel, UserAccountModel, UserModel) {
                $injector = _$injector_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
                BrandAssetModel = _BrandAssetModel_;
                globals = _globals_;
                ASSET_SUBTYPES = globals.BRAND.ASSET_SUBTYPES;

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

                it("should transition successfully", function () {
                    $rootScope.$digest();

                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve a fetchBrandLogo function", function () {
                    $rootScope.$digest();

                    expect($injector.invoke($state.current.views["@"].resolve.fetchBrandLogo)).toBeDefined();
                });

                it("should resolve a fetchCurrentInvoiceSummary function", function () {
                    $rootScope.$digest();

                    expect($injector.invoke($state.current.views["@"].resolve.fetchCurrentInvoiceSummary)).toBeDefined();
                });

                it("should resolve a fetchScheduledPaymentsCount function", function () {
                    $rootScope.$digest();

                    expect($injector.invoke($state.current.views["@"].resolve.fetchScheduledPaymentsCount)).toBeDefined();
                });

                it("should call this.AnalyticsUtil.trackView", function () {
                    $rootScope.$digest();

                    expect(this.AnalyticsUtil.trackView).toHaveBeenCalledWith(globals.LANDING.CONFIG.ANALYTICS.pageName);
                });

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

                //TODO - Figure out why these tests don't work (resolved values that depend on other resolved values don't work?)
                xdescribe("when the user has a brand with a logo", function () {
                    var brandLogoAsset,
                        getAssetResourceDataDeferred;

                    beforeEach(function () {
                        brandLogoAsset = TestUtils.getRandomBrandAsset(BrandAssetModel);
                        getAssetResourceDataDeferred = $q.defer();

                        BrandManager.getUserBrandAssetBySubtype.and.returnValue(brandLogoAsset);
                        BrandUtil.getAssetResourceData.and.returnValue(getAssetResourceDataDeferred.promise);

                        $rootScope.$digest();
                    });

                    it("should call BrandManager.getUserBrandAssetBySubtype with the expected value", function () {
                        expect(BrandManager.getUserBrandAssetBySubtype).toHaveBeenCalledWith(ASSET_SUBTYPES.BRAND_LOGO);
                    });

                    it("should call BrandUtil.getAssetResourceData with the expected value", function () {
                        expect(BrandUtil.getAssetResourceData).toHaveBeenCalledWith(brandLogoAsset);
                    });

                    describe("when BrandUtil.getAssetResourceData resolves with the data", function () {
                        var data,
                            resolveHandler;

                        beforeEach(function () {
                            data = TestUtils.getRandomStringThatIsAlphaNumeric(50);
                            resolveHandler = jasmine.createSpy("resolveHandler");

                            getAssetResourceDataDeferred.resolve(data);
                            $rootScope.$digest();

                            $injector.invoke($state.current.views["@"].resolve.brandLogo)
                                .then(resolveHandler);

                            $rootScope.$digest();
                        });

                        it("should resolve the brandLogo to the data", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(data);
                        });
                    });

                    describe("when BrandUtil.getAssetResourceData rejects", function () {
                        var resolveHandler;

                        beforeEach(function () {
                            resolveHandler = jasmine.createSpy("resolveHandler");

                            getAssetResourceDataDeferred.reject();
                            $rootScope.$digest();

                            $injector.invoke($state.current.views["@"].resolve.brandLogo)
                                .then(resolveHandler);

                            $rootScope.$digest();
                        });

                        it("should resolve with an empty string", function () {
                            expect(resolveHandler).toHaveBeenCalledWith("");
                        });
                    });
                });

                xdescribe("when the user does NOT have a brand with a logo", function () {

                    beforeEach(function () {
                        BrandManager.getUserBrandAssetBySubtype.and.returnValue(null);

                        $rootScope.$digest();
                    });

                    it("should call BrandManager.getUserBrandAssetBySubtype with the expected value", function () {
                        expect(BrandManager.getUserBrandAssetBySubtype).toHaveBeenCalledWith(ASSET_SUBTYPES.BRAND_LOGO);
                    });

                    it("should resolve the brandLogo to be falsy", function () {
                        expect($injector.invoke($state.current.views["@"].resolve.brandLogo)).toBeFalsy();
                    });
                });
            });
        });
    });
})();