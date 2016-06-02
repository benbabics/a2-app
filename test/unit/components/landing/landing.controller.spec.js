(function () {
    "use strict";

    var $scope,
        $ionicHistory,
        $ionicPlatform,
        $interval,
        ctrl,
        doBackButtonAction,
        mockCurrentInvoiceSummary,
        mockUser,
        mockScheduledPaymentCount,
        mockBrandLogo,
        mockGreeting,
        UserAccountModel,
        InvoiceSummaryModel,
        UserManager,
        UserModel,
        Navigation,
        Toast,
        FlowUtil,
        AnalyticsUtil,
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
                },
                "BACK_TO_EXIT": {
                    "duration": TestUtils.getRandomInteger(1, 1000),
                    "position": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "message" : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                }
            }
        };

    describe("A Landing Controller", function () {

        beforeEach(function () {
            // mock dependencies
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["clearHistory"]);
            mockScheduledPaymentCount = TestUtils.getRandomInteger(0, 100);
            Navigation = jasmine.createSpyObj("Navigation", ["goToCards", "goToMakePayment", "goToTransactionActivity"]);
            $ionicPlatform = jasmine.createSpyObj("$ionicPlatform", ["registerBackButtonAction"]);
            FlowUtil = jasmine.createSpyObj("FlowUtil", ["exitApp"]);
            Toast = jasmine.createSpyObj("Toast", ["show"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", [
                "getActiveTrackerId",
                "hasActiveTracker",
                "setUserId",
                "startTracker",
                "trackEvent",
                "trackView"
            ]);

            module("app.shared");
            module("app.components", function ($provide) {
                $provide.value("AnalyticsUtil", AnalyticsUtil);
            });

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            inject(function ($controller, _$interval_, $rootScope, $q,
                             _UserAccountModel_, _InvoiceSummaryModel_, _UserModel_, PlatformUtil) {

                UserAccountModel = _UserAccountModel_;
                InvoiceSummaryModel = _InvoiceSummaryModel_;
                UserModel = _UserModel_;
                $interval = _$interval_;

                //setup mocks
                mockCurrentInvoiceSummary = TestUtils.getRandomInvoiceSummary(InvoiceSummaryModel);
                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);
                UserManager.getUser.and.returnValue(mockUser);
                mockBrandLogo = TestUtils.getRandomStringThatIsAlphaNumeric(50);
                mockGreeting = "Hello, " + mockUser.firstName;

                //setup spies
                spyOn(PlatformUtil, "waitForCordovaPlatform").and.callFake(function(callback) {
                    //just execute the callback directly
                    return $q.when((callback || function() {})());
                });
                spyOn($interval, "cancel").and.callThrough();

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                $ionicPlatform.registerBackButtonAction.and.callFake(function (callback) {
                    doBackButtonAction = callback;
                });

                ctrl = $controller("LandingController", {
                    $scope                : $scope,
                    $ionicHistory         : $ionicHistory,
                    $ionicPlatform        : $ionicPlatform,
                    Navigation            : Navigation,
                    UserManager           : UserManager,
                    Toast                 : Toast,
                    FlowUtil              : FlowUtil,
                    currentInvoiceSummary : mockCurrentInvoiceSummary,
                    scheduledPaymentsCount: mockScheduledPaymentCount,
                    globals               : mockGlobals,
                    brandLogo             : mockBrandLogo
                });
            });
        });

        describe("has a back button action that", function () {

            beforeEach(function () {
                doBackButtonAction();
            });

            it("should call Toast.show with the expected values", function () {
                expect(Toast.show).toHaveBeenCalledWith(
                    mockGlobals.LANDING.BACK_TO_EXIT.message,
                    mockGlobals.LANDING.BACK_TO_EXIT.duration,
                    mockGlobals.LANDING.BACK_TO_EXIT.position
                );
            });

            it("should start a timer to allow the user to exit the app", function () {
                //TODO - Figure out how to test this
            });

            describe("while the timer is active", function () {

                describe("sets a back button action that", function () {

                    beforeEach(function () {
                        doBackButtonAction();
                    });

                    it("should call FlowUtil.exitApp", function () {
                        expect(FlowUtil.exitApp).toHaveBeenCalledWith();
                    });
                });
            });

            describe("while the timer is NOT active", function () {

                beforeEach(function () {
                    $interval.flush(mockGlobals.LANDING.BACK_TO_EXIT.duration);
                    $scope.$digest();
                });

                describe("sets a back button action that", function () {

                    beforeEach(function () {
                        doBackButtonAction();
                    });

                    it("should call Toast.show with the expected values", function () {
                        expect(Toast.show.calls.argsFor(1)).toEqual([
                            mockGlobals.LANDING.BACK_TO_EXIT.message,
                            mockGlobals.LANDING.BACK_TO_EXIT.duration,
                            mockGlobals.LANDING.BACK_TO_EXIT.position
                        ]);
                    });

                    it("should start a timer to allow the user to exit the app", function () {
                        //TODO - Figure out how to test this
                    });
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

            it("should set the greeting", function () {
                expect(ctrl.greeting).toEqual(mockGreeting);
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
