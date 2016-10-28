(function () {
    "use strict";

    describe("A Landing Module Route Config", function () {

        var $injector,
            $q,
            $rootScope,
            $state,
            mockInvoiceSummary,
            mockUser,
            mockGlobals = {
                "LANDING": {
                    "CONFIG": {
                        "ANALYTICS"          : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "title"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "availableCredit"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "billedAmount"       : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "unbilledAmount"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "paymentDueDate"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "currentBalance"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "statementBalance"   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "makePayment"        : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "transactionActivity": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "cards"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "scheduledPayments"  : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "CHART" : {
                        "options": {
                            animation            : TestUtils.getRandomBoolean(),
                            percentageInnerCutout: TestUtils.getRandomInteger(1, 50),
                            showTooltips         : TestUtils.getRandomBoolean(),
                            segmentStrokeWidth   : TestUtils.getRandomInteger(1, 10),
                            scaleOverride        : TestUtils.getRandomBoolean(),
                            responsive           : TestUtils.getRandomBoolean()
                        },
                        "colors" : {
                            availableCreditPositive: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            availableCreditNegative: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            billedAmount           : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            unbilledAmount         : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                }
            },
            ASSET_SUBTYPES,
            InvoiceManager,
            PaymentManager,
            UserManager,
            BrandUtil,
            BrandManager,
            mockAccountId,
            BrandAssetModel;

        beforeAll(function () {
            this.includeAppDependencies = false;
            this.includeHtml = true;
        });

        beforeEach(function () {

            module("app.components.landing");
            module("app.components.brand");
            module("app.components.invoice");
            module("app.components.user");

            // mock dependencies
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["fetchCurrentInvoiceSummary"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["fetchScheduledPaymentsCount"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            BrandUtil = jasmine.createSpyObj("BrandUtil", ["getAssetResourceData"]);
            BrandManager = jasmine.createSpyObj("BrandManager ", ["getUserBrandAssetBySubtype", "getGenericAnalyticsTrackingId", "loadBundledBrand"]);

            module(function($provide, sharedGlobals) {
                $provide.value("globals", angular.extend({}, sharedGlobals, mockGlobals));
                $provide.value("accountId", mockAccountId);
                $provide.value("InvoiceManager", InvoiceManager);
                $provide.value("PaymentManager", PaymentManager);
                $provide.value("UserManager", UserManager);
                $provide.value("BrandUtil", BrandUtil);
                $provide.value("BrandManager", BrandManager);
            });

            inject(function (_$injector_, _$q_, _$rootScope_, _$state_, globals,
                             _BrandAssetModel_, InvoiceSummaryModel, UserAccountModel, UserModel) {
                $injector = _$injector_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
                BrandAssetModel = _BrandAssetModel_;
                ASSET_SUBTYPES = globals.BRAND.ASSET_SUBTYPES;

                mockInvoiceSummary = TestUtils.getRandomInvoiceSummary(InvoiceSummaryModel);
                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel, globals.ONLINE_APPLICATION);
                mockAccountId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                mockUser.billingCompany.accountId = mockAccountId;
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

                var fetchCurrentInvoiceSummaryDeferred,
                    fetchScheduledPaymentsCountDeferred,
                    mockScheduledPaymentCount;

                beforeEach(function () {
                    mockScheduledPaymentCount = TestUtils.getRandomInteger(0, 100);

                    fetchCurrentInvoiceSummaryDeferred = $q.defer();
                    InvoiceManager.fetchCurrentInvoiceSummary.and.returnValue(fetchCurrentInvoiceSummaryDeferred.promise);

                    fetchScheduledPaymentsCountDeferred = $q.defer();
                    PaymentManager.fetchScheduledPaymentsCount.and.returnValue(fetchScheduledPaymentsCountDeferred.promise);

                    $state.go(stateName);

                    fetchCurrentInvoiceSummaryDeferred.resolve(mockInvoiceSummary);
                    fetchScheduledPaymentsCountDeferred.resolve(mockScheduledPaymentCount);
                });

                it("should call InvoiceManager.fetchCurrentInvoiceSummary with the correct account id", function () {
                    $rootScope.$digest();

                    expect(InvoiceManager.fetchCurrentInvoiceSummary).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should call PaymentManager.fetchScheduledPaymentsCount with the correct account id", function () {
                    $rootScope.$digest();

                    expect(PaymentManager.fetchScheduledPaymentsCount).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should transition successfully", function () {
                    $rootScope.$digest();

                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve the currentInvoiceSummary", function () {
                    $rootScope.$digest();

                    $injector.invoke($state.current.views["@"].resolve.currentInvoiceSummary)
                        .then(function (currentInvoiceSummary) {
                            expect(currentInvoiceSummary).toEqual(mockInvoiceSummary);
                        });
                });

                it("should resolve the scheduledPaymentsCount", function () {
                    $rootScope.$digest();

                    $injector.invoke($state.current.views["@"].resolve.scheduledPaymentsCount)
                        .then(function (scheduledPaymentCount) {
                            expect(scheduledPaymentCount).toEqual(mockScheduledPaymentCount);
                        });
                });

                it("should call this.AnalyticsUtil.trackView", function () {
                    $rootScope.$digest();

                    expect(this.AnalyticsUtil.trackView).toHaveBeenCalledWith(mockGlobals.LANDING.CONFIG.ANALYTICS.pageName);
                });

                describe("when the user has a brand with a logo", function () {
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

                describe("when the user does NOT have a brand with a logo", function () {

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