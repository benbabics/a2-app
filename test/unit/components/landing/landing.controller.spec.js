(function () {
    "use strict";

    var DEFAULT_CACHE_TTL = 4320,
        $scope,
        $ionicHistory,
        $ionicPlatform,
        $interval,
        $stateParams,
        ctrl,
        doBackButtonAction,
        mockCurrentInvoiceSummary,
        mockUser,
        mockScheduledPaymentCount,
        mockBrandLogo,
        mockGreeting,
        fetchCurrentInvoiceSummary,
        fetchScheduledPaymentsCount,
        fetchPropertyScheduledPaymentsCountDeferred,
        fetchPropertyCurrentInvoiceSummaryDeferred,
        UserAccountModel,
        InvoiceSummaryModel,
        UserManager,
        UserModel,
        Navigation,
        Toast,
        FlowUtil,
        WexCache,
        globals;

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
            $stateParams = {param: TestUtils.getRandomStringThatIsAlphaNumeric(10)};
            WexCache = jasmine.createSpyObj("WexCache", ["fetchPropertyValue"]);
            fetchCurrentInvoiceSummary = jasmine.createSpy("fetchCurrentInvoiceSummary");
            fetchScheduledPaymentsCount = jasmine.createSpy("fetchScheduledPaymentsCount");

            inject(function ($controller, _$interval_, $rootScope, $q,
                             _UserAccountModel_, _InvoiceSummaryModel_, _UserModel_, PlatformUtil, _globals_) {

                UserAccountModel = _UserAccountModel_;
                InvoiceSummaryModel = _InvoiceSummaryModel_;
                UserModel = _UserModel_;
                $interval = _$interval_;
                globals = _globals_;

                //setup mocks
                mockCurrentInvoiceSummary = TestUtils.getRandomInvoiceSummary(InvoiceSummaryModel);
                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);
                UserManager.getUser.and.returnValue(mockUser);
                mockBrandLogo = TestUtils.getRandomStringThatIsAlphaNumeric(50);
                mockGreeting = "Hello, " + mockUser.firstName;
                fetchPropertyScheduledPaymentsCountDeferred = $q.defer();
                fetchPropertyCurrentInvoiceSummaryDeferred = $q.defer();

                //setup spies
                PlatformUtil.waitForCordovaPlatform = jasmine.createSpy("waitForCordovaPlatform").and.callFake(function(callback) {
                    //just execute the callback directly
                    return $q.when((callback || function() {})());
                });
                spyOn($interval, "cancel").and.callThrough();

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                $ionicPlatform.registerBackButtonAction.and.callFake(function (callback) {
                    doBackButtonAction = callback;
                });

                WexCache.fetchPropertyValue.and.returnValues(
                    fetchPropertyScheduledPaymentsCountDeferred.promise,
                    fetchPropertyCurrentInvoiceSummaryDeferred.promise
                );

                ctrl = $controller("LandingController", {
                    $scope                     : $scope,
                    $ionicHistory              : $ionicHistory,
                    $ionicPlatform             : $ionicPlatform,
                    $stateParams               : $stateParams,
                    Navigation                 : Navigation,
                    UserManager                : UserManager,
                    Toast                      : Toast,
                    FlowUtil                   : FlowUtil,
                    WexCache                   : WexCache,
                    fetchCurrentInvoiceSummary : fetchCurrentInvoiceSummary,
                    fetchScheduledPaymentsCount: fetchScheduledPaymentsCount,
                    brandLogo                  : mockBrandLogo
                });
            });
        });

        it("should set the invoice summary", function () {
            expect(ctrl.invoiceSummary).toEqual(new InvoiceSummaryModel());
        });

        it("should set the scheduled payments count", function () {
            expect(ctrl.scheduledPaymentsCount).toEqual(0);
        });

        it("should fetch the scheduledPaymentsCount in the background", function () {
            expect(WexCache.fetchPropertyValue).toHaveBeenCalledWith("scheduledPaymentsCount", fetchScheduledPaymentsCount, {ttl: DEFAULT_CACHE_TTL});
        });

        it("should fetch the invoiceSummary in the background", function () {
            expect(WexCache.fetchPropertyValue).toHaveBeenCalledWith("invoiceSummary", fetchCurrentInvoiceSummary, {ttl: DEFAULT_CACHE_TTL, ValueType: InvoiceSummaryModel});
        });

        describe("when scheduledPaymentsCount has been fetched", function () {

            beforeEach(function () {
                mockScheduledPaymentCount = TestUtils.getRandomInteger(0, 100);

                fetchPropertyScheduledPaymentsCountDeferred.resolve(mockScheduledPaymentCount);
                $scope.$digest();
            });

            it("should update scheduledPaymentsCount", function () {
                expect(ctrl.scheduledPaymentsCount).toEqual(mockScheduledPaymentCount);
            });
        });

        describe("when invoiceSummary has been fetched", function () {

            beforeEach(function () {
                mockCurrentInvoiceSummary = TestUtils.getRandomInvoiceSummary(InvoiceSummaryModel);

                fetchPropertyCurrentInvoiceSummaryDeferred.resolve(mockCurrentInvoiceSummary);
                $scope.$digest();
            });

            it("should update invoiceSummary", function () {
                expect(ctrl.invoiceSummary).toEqual(mockCurrentInvoiceSummary);
            });

            describe("should configure the chart such that", chartTests);
        });

        describe("has a back button action that", function () {

            beforeEach(function () {
                doBackButtonAction();
            });

            it("should call Toast.show with the expected values", function () {
                expect(Toast.show).toHaveBeenCalledWith(
                    globals.LANDING.BACK_TO_EXIT.message,
                    globals.LANDING.BACK_TO_EXIT.duration,
                    globals.LANDING.BACK_TO_EXIT.position
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
                    $interval.flush(globals.LANDING.BACK_TO_EXIT.duration);
                    $scope.$digest();
                });

                describe("sets a back button action that", function () {

                    beforeEach(function () {
                        doBackButtonAction();
                    });

                    it("should call Toast.show with the expected values", function () {
                        expect(Toast.show.calls.argsFor(1)).toEqual([
                            globals.LANDING.BACK_TO_EXIT.message,
                            globals.LANDING.BACK_TO_EXIT.duration,
                            globals.LANDING.BACK_TO_EXIT.position
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

            it("should clear the navigation history", function () {
                expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
            });

            it("should set the greeting", function () {
                expect(ctrl.greeting).toEqual(mockGreeting);
            });

            it("should set the params", function () {
                expect(ctrl.params).toEqual($stateParams);
            });

            describe("should configure the chart such that", chartTests);
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

        function chartTests() {

            it("should show the available credit with the availableCreditNegative color when no credit is available", function () {
                if (ctrl.invoiceSummary.availableCredit <= 0) {
                    expect(ctrl.chart).toEqual({
                        options: globals.LANDING.CHART.options,
                        labels: ["Available"],
                        colors: [globals.LANDING.CHART.colors.availableCreditNegative],
                        data: [1]
                    });
                }
            });

            it("should show the available credit with a color of #3eb049 when all credit is available", function () {
                if (ctrl.invoiceSummary.creditLimit > 0.0 && ctrl.invoiceSummary.availableCredit >= ctrl.invoiceSummary.creditLimit) {
                    expect(ctrl.chart).toEqual({
                        options: globals.LANDING.CHART.options,
                        labels: ["Available"],
                        colors: ["#3eb049"],
                        data: [mockCurrentInvoiceSummary.availableCredit]
                    });
                }
            });

            it("should show the available credit, billed amount and unbilled amount when some credit is available", function () {
                if (ctrl.invoiceSummary.creditLimit > 0.0 && ctrl.invoiceSummary.availableCredit < ctrl.invoiceSummary.creditLimit) {
                    expect(ctrl.chart).toEqual({
                        options: globals.LANDING.CHART.options,
                        labels: ["Unbilled", "Available", "Billed"],
                        colors: ["#34b39d", "#3eb049", "#324e5d"],
                        data: [mockCurrentInvoiceSummary.unbilledAmount, mockCurrentInvoiceSummary.availableCredit, mockCurrentInvoiceSummary.billedAmount]
                    });
                }
            });
        }
    });
}());
