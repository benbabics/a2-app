(function () {
    "use strict";

    var $scope,
        $ionicHistory,
        ctrl,
        mockCurrentInvoiceSummary,
        mockUser,
        mockScheduledPaymentCount,
        mockBrandLogo,
        UserAccountModel,
        InvoiceSummaryModel,
        UserManager,
        UserModel,
        Navigation,
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
        };

    describe("A Landing Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components");

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            // mock dependencies
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["clearHistory"]);
            mockScheduledPaymentCount = TestUtils.getRandomInteger(0, 100);
            Navigation = jasmine.createSpyObj("Navigation", ["goToCards", "goToMakePayment", "goToTransactionActivity"]);

            inject(function ($controller, $rootScope, $q, _UserAccountModel_, _InvoiceSummaryModel_, _UserModel_, PlatformUtil) {

                UserAccountModel = _UserAccountModel_;
                InvoiceSummaryModel = _InvoiceSummaryModel_;
                UserModel = _UserModel_;

                //setup mocks
                mockCurrentInvoiceSummary = TestUtils.getRandomInvoiceSummary(InvoiceSummaryModel);
                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);
                UserManager.getUser.and.returnValue(mockUser);
                mockBrandLogo = TestUtils.getRandomStringThatIsAlphaNumeric(50);

                //setup spies
                spyOn(PlatformUtil, "waitForCordovaPlatform").and.callFake(function(callback) {
                    //just execute the callback directly
                    return $q.when((callback || function() {})());
                });

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("LandingController", {
                    $scope                : $scope,
                    $ionicHistory         : $ionicHistory,
                    Navigation            : Navigation,
                    UserManager           : UserManager,
                    currentInvoiceSummary : mockCurrentInvoiceSummary,
                    scheduledPaymentsCount: mockScheduledPaymentCount,
                    globals               : mockGlobals,
                    brandLogo             : mockBrandLogo
                });
            });
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function() {
                //setup an existing values to test them being modified
                ctrl.hasAnyCards = null;
                ctrl.globalError = "This is a previous error";
                ctrl.scheduledPaymentsCount = null;

                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the user", function () {
                expect(ctrl.user).toEqual(mockUser);
            });

            it("should set the invoice summary", function () {
                expect(ctrl.invoiceSummary).toEqual(mockCurrentInvoiceSummary);
            });

            it("should set the scheduled payments count", function () {
                expect(ctrl.scheduledPaymentsCount).toEqual(mockScheduledPaymentCount);
            });

            it("should clear the navigation history", function () {
                expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
            });

            it("should set the branding", function () {
                expect(ctrl.branding).toEqual({
                    logo: mockBrandLogo
                });
            });

            it("should set the chart options", function () {

                describe("when no credit is available", function () {

                    beforeEach(function () {
                        ctrl.invoiceSummary.availableCredit = -TestUtils.getRandomNumber(0.1, 9999.99);
                    });

                    it("should show the available credit with a color of #b30308", function () {

                        expect(ctrl.chart).toEqual({
                            options: {
                                animation            : false,
                                percentageInnerCutout: 40,
                                showTooltips         : false,
                                segmentStrokeWidth   : 1,
                                scaleOverride        : true,
                                responsive           : false
                            },
                            labels : ["Available"],
                            colors : ["#b30308"],
                            data   : [1]
                        });

                    });

                });

                describe("when all credit is available", function () {

                    beforeEach(function () {
                        ctrl.invoiceSummary.creditLimit = TestUtils.getRandomNumber(10.0, 9999.0);
                        ctrl.invoiceSummary.availableCredit = TestUtils.getRandomNumber(ctrl.invoiceSummary.creditLimit, 9999.99);
                    });

                    it("should show the available credit with a color of #39802b", function () {

                        expect(ctrl.chart).toEqual({
                            options: {
                                animation            : false,
                                percentageInnerCutout: 40,
                                showTooltips         : false,
                                segmentStrokeWidth   : 1,
                                scaleOverride        : true,
                                responsive           : false
                            },
                            labels : ["Available"],
                            colors : ["#39802b"],
                            data   : [mockCurrentInvoiceSummary.availableCredit]
                        });

                    });

                });

                describe("when some credit is available", function () {

                    beforeEach(function () {
                        ctrl.invoiceSummary.creditLimit = TestUtils.getRandomNumber(10.0, 9999.0);
                        ctrl.invoiceSummary.availableCredit = TestUtils.getRandomNumber(10.0, ctrl.invoiceSummary.creditLimit);
                    });

                    it("should show the available credit, billed amount and unbilled amount", function () {

                        expect(ctrl.chart).toEqual({
                            options: {
                                animation            : false,
                                percentageInnerCutout: 40,
                                showTooltips         : false,
                                segmentStrokeWidth   : 1,
                                scaleOverride        : true,
                                responsive           : false
                            },
                            labels : ["Available", "Billed", "Unbilled"],
                            colors : ["#39802b", "#334c5b", "#3799b3"],
                            data   : [mockCurrentInvoiceSummary.availableCredit, mockCurrentInvoiceSummary.billedAmount, mockCurrentInvoiceSummary.unbilledAmount]
                        });

                    });

                });

            });

        });

        describe("has a goToCards function that", function () {

            beforeEach(function () {
                ctrl.goToCards();
            });

            it("should navigate to cards", function () {
                expect(Navigation.goToCards).toHaveBeenCalledWith();
            });

        });

        describe("has a goToMakePayment function that", function () {

            beforeEach(function () {
                ctrl.goToMakePayment();
            });

            it("should navigate to make payment", function () {
                expect(Navigation.goToMakePayment).toHaveBeenCalledWith();
            });

        });

        describe("has a goToTransactionActivity function that", function () {

            beforeEach(function () {
                ctrl.goToTransactionActivity();
            });

            it("should navigate to transaction activity", function () {
                expect(Navigation.goToTransactionActivity).toHaveBeenCalledWith();
            });

        });

    });

}());
