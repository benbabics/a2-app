(function () {
    "use strict";

    describe("A Payment Module Route Config", function () {

        var $injector,
            $q,
            $rootScope,
            $state,
            mockBank1,
            mockBank2,
            mockBank3,
            mockBankAccounts,
            mockGlobals = {
                PAYMENT_MAINTENANCE: {
                    STATES: {
                        "ADD": "add"
                    }
                },

                PAYMENT_LIST: {
                    "SEARCH_OPTIONS": {
                        "PAGE_NUMBER": TestUtils.getRandomInteger(0, 20),
                        "PAGE_SIZE"  : TestUtils.getRandomInteger(10, 100)
                    }
                },

                BUTTONS: {
                    "CONFIG": {
                        "cancel": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "done"  : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                }
            },
            mockPayment1,
            mockPayment2,
            mockPayment3,
            mockPayment4,
            mockPayments,
            mockUser = {
                newField1     : "some value",
                newField2     : "some other value",
                newField3     : "yet another value",
                email         : "email address value",
                firstName     : "first name value",
                username      : "username value",
                company       : {
                    accountId    : "company account id value",
                    accountNumber: "company account number value",
                    name         : "company name value"
                },
                billingCompany: {
                    accountId    : "billing company account id value",
                    accountNumber: "billing company account number value",
                    name         : "billing company name value"
                }
            },
            BankManager,
            BankModel,
            Payment,
            PaymentManager,
            PaymentModel,
            InvoiceManager,
            UserManager;

        beforeEach(function () {

            module("app.shared");
            module("app.components.bank");
            module("app.components.payment");
            module("app.html");

            // mock dependencies
            Payment = jasmine.createSpyObj("Payment", ["getOrCreatePaymentAdd", "getPayment"]);
            BankManager = jasmine.createSpyObj("BankManager", ["getActiveBanks"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["fetchPayment", "fetchPayments", "fetchScheduledPaymentsCount"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            module(function ($provide, sharedGlobals) {
                $provide.value("globals", angular.extend({}, mockGlobals, sharedGlobals));
                $provide.value("BankManager", BankManager);
                $provide.value("InvoiceManager", InvoiceManager);
                $provide.value("Payment", Payment);
                $provide.value("PaymentManager", PaymentManager);
                $provide.value("UserManager", UserManager);
            });

            inject(function (_$injector_, _$q_, _$rootScope_, _$state_, _BankModel_, _PaymentModel_) {
                $injector = _$injector_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
                BankModel = _BankModel_;
                PaymentModel = _PaymentModel_;
            });

            // setup mock objects
            mockPayment1 = TestUtils.getRandomPayment(PaymentModel, BankModel);
            mockPayment2 = TestUtils.getRandomPayment(PaymentModel, BankModel);
            mockPayment3 = TestUtils.getRandomPayment(PaymentModel, BankModel);
            mockPayment4 = TestUtils.getRandomPayment(PaymentModel, BankModel);

            mockPayments = {};
            mockPayments[mockPayment1.id] = mockPayment1;
            mockPayments[mockPayment2.id] = mockPayment2;
            mockPayments[mockPayment3.id] = mockPayment3;
            mockPayments[mockPayment4.id] = mockPayment4;

            mockBank1 = TestUtils.getRandomBank(BankModel);
            mockBank2 = TestUtils.getRandomBank(BankModel);
            mockBank3 = TestUtils.getRandomBank(BankModel);

            mockBankAccounts = {};
            mockBankAccounts[mockBank1.id] = mockBank1;
            mockBankAccounts[mockBank2.id] = mockBank2;
            mockBankAccounts[mockBank3.id] = mockBank3;

            BankManager.getActiveBanks.and.returnValue(mockBankAccounts);
            Payment.getPayment.and.returnValue(mockPayment1);

        });

        describe("has a payment state that", function () {
            var state,
                stateName = "payment";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/payment");
            });

            it("should have the expected template", function () {
                expect(state.template).toEqual("<ion-nav-view name='view'></ion-nav-view>");
            });
        });

        describe("has a payment.list state that", function () {
            var state,
                stateName = "payment.list";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/list");
            });

            it("should define a payment view", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment"]).toBeDefined();
                expect(state.views["view@payment"].template).toEqual("<ion-nav-view></ion-nav-view>");
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/payment/list");
            });
        });

        describe("has a payment.list.view state that", function () {
            var state,
                stateName = "payment.list.view";

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

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("");
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/payment/list");
            });

            describe("when navigated to", function () {

                var fetchPaymentsDeferred;

                beforeEach(function () {

                    fetchPaymentsDeferred = $q.defer();
                    UserManager.getUser.and.returnValue(mockUser);
                    PaymentManager.fetchPayments.and.returnValue(fetchPaymentsDeferred.promise);

                    $state.go(stateName);
                    fetchPaymentsDeferred.resolve(mockPayments);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPayments", function () {
                    expect(PaymentManager.fetchPayments).toHaveBeenCalledWith(mockUser.billingCompany.accountId,
                        mockGlobals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_NUMBER,
                        mockGlobals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_SIZE);
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

            });

        });

        describe("has a payment.view state that", function () {
            var state,
                stateName = "payment.view";

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

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/view/:paymentId");
            });

            it("should define a view@payment", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName, {paymentId: "1234"})).toEqual("#/payment/view/1234");
            });

            describe("when navigated to", function () {

                var fetchPaymentDeferred,
                    fetchScheduledPaymentsCountDeferred,
                    mockPaymentId = TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    mockScheduledPaymentCount = TestUtils.getRandomInteger(0, 100);

                beforeEach(function () {
                    fetchPaymentDeferred = $q.defer();
                    PaymentManager.fetchPayment.and.returnValue(fetchPaymentDeferred.promise);

                    fetchScheduledPaymentsCountDeferred = $q.defer();
                    PaymentManager.fetchScheduledPaymentsCount.and.returnValue(fetchScheduledPaymentsCountDeferred.promise);

                    UserManager.getUser.and.returnValue(mockUser);

                    $state.go(stateName, {paymentId: mockPaymentId});

                    fetchPaymentDeferred.resolve(mockPayment4);
                    fetchScheduledPaymentsCountDeferred.resolve(mockScheduledPaymentCount);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPayment", function () {
                    expect(PaymentManager.fetchPayment).toHaveBeenCalledWith(mockPaymentId);
                });

                it("should call PaymentManager.fetchScheduledPaymentsCount", function () {
                    expect(PaymentManager.fetchScheduledPaymentsCount).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve the payment", function () {
                    $injector.invoke($state.current.views["view@payment"].resolve.payment)
                        .then(function (payment) {
                            expect(payment).toEqual(mockPayment4);
                        });
                });

                it("should resolve the scheduledPaymentsCount", function () {
                    $injector.invoke($state.current.views["view@payment"].resolve.scheduledPaymentsCount)
                        .then(function (scheduledPaymentCount) {
                            expect(scheduledPaymentCount).toEqual(mockScheduledPaymentCount);
                        });
                });

            });

        });

        describe("has a payment.add state that", function () {
            var state,
                stateName = "payment.add";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should NOT be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/add");
            });

            describe("when navigated to", function () {
                var getOrFetchPaymentAddDeferred;

                beforeEach(function () {
                    getOrFetchPaymentAddDeferred = $q.defer();
                    Payment.getOrCreatePaymentAdd.and.returnValue(getOrFetchPaymentAddDeferred.promise);
                    getOrFetchPaymentAddDeferred.resolve();

                    $state.go(stateName);
                    $rootScope.$digest();
                });

                it("should transition to the payment.maintenance.form page in the add state", function () {
                    expect($state.current.name).toBe("payment.maintenance.form");

                    $injector.invoke(function ($stateParams) {
                        expect($stateParams).toEqual({maintenanceState: mockGlobals.PAYMENT_MAINTENANCE.STATES.ADD});
                    });
                });
            });
        });

        describe("has a payment.maintenance state that", function () {
            var state,
                stateName = "payment.maintenance";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/maintenance/:maintenanceState");
            });

            describe("when a child state is navigated to", function () {

                var maintenanceState,
                    childStateName = "payment.maintenance.confirmation";

                beforeEach(function () {
                    maintenanceState = getRandomMaintenanceState();

                    $state.go(childStateName, {maintenanceState: maintenanceState});
                    $rootScope.$digest();
                });

                it("should resolve a maintenance object with the expected values", function () {
                    expect($injector.invoke($state.$current.parent.resolve.maintenance)).toEqual(jasmine.objectContaining({
                        state : maintenanceState,
                        states: mockGlobals.PAYMENT_MAINTENANCE.STATES,
                        go    : jasmine.any(Function)
                    }));
                });

                describe("should resolve a maintenance object with a go function that", function () {
                    var mockMaintenanceState = "payment.maintenance.input.amount";

                    beforeEach(function () {
                        $injector.invoke($state.$current.parent.resolve.maintenance).go(mockMaintenanceState);
                        $rootScope.$digest();
                    });

                    it("should transition to the expected maintenance state", function () {
                        expect($state.$current.name).toEqual(mockMaintenanceState);

                        $injector.invoke(function ($stateParams) {
                            expect($stateParams).toEqual({maintenanceState: maintenanceState});
                        });
                    });
                });
            });
        });

        describe("has a payment.maintenance.form state that", function () {
            var state,
                stateName = "payment.maintenance.form";

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

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/form");
            });

            it("should define a view@payment", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toMatch(/#\/payment\/maintenance\/.*\/form/);
            });

            describe("when navigated to", function () {

                var getOrFetchPaymentAddDeferred;

                beforeEach(function () {
                    getOrFetchPaymentAddDeferred = $q.defer();
                    UserManager.getUser.and.returnValue(mockUser);
                    Payment.getOrCreatePaymentAdd.and.returnValue(getOrFetchPaymentAddDeferred.promise);

                    $state.go(stateName, {maintenanceState: getRandomMaintenanceState()});
                    getOrFetchPaymentAddDeferred.resolve(mockBankAccounts);
                    $rootScope.$digest();
                });

                it("should call Payment.getOrCreatePaymentAdd", function () {
                    expect(Payment.getOrCreatePaymentAdd).toHaveBeenCalledWith();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

            });

        });

        describe("has a payment.maintenance.summary state that", function () {
            var state,
                stateName = "payment.maintenance.summary";

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

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/summary");
            });

            it("should define a view@payment", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toMatch(/#\/payment\/maintenance\/.*\/summary/);
            });

        });

        describe("has a payment.maintenance.confirmation state that", function () {
            var state,
                stateName = "payment.maintenance.confirmation";

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

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/confirmation");
            });

            it("should define a view@payment", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toMatch(/#\/payment\/maintenance\/.*\/confirmation/);
            });

        });

        describe("has a payment.maintenance.input state that", function () {
            var state,
                stateName = "payment.maintenance.input";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should NOT be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect($state.href(stateName)).toMatch(/#\/payment\/maintenance\/.*\/input/);
            });
        });

        describe("has a payment.maintenance.input.amount state that", function () {
            var state,
                stateName = "payment.maintenance.input.amount";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should NOT be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should NOT be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/amount");
            });

            it("should define a view on the payment view container", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toMatch(/#\/payment\/maintenance\/.*\/input\/amount/);
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    $state.go(stateName, {maintenanceState: getRandomMaintenanceState});
                    $rootScope.$digest();
                });

                it("should call Payment.getPayment", function () {
                    expect(Payment.getPayment).toHaveBeenCalledWith();
                });

                it("should call InvoiceManager.getInvoiceSummary", function () {
                    expect(InvoiceManager.getInvoiceSummary).toHaveBeenCalledWith();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve the payment", function () {
                    expect($injector.invoke($state.current.views["view@payment"].resolve.payment)).toEqual(mockPayment1);
                });
            });
        });

        describe("has a payment.maintenance.input.bankAccount state that", function () {
            var state,
                stateName = "payment.maintenance.input.bankAccount";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should NOT be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should NOT be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/bankAccount");
            });

            it("should define a view on the payment view container", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toMatch(/#\/payment\/maintenance\/.*\/input\/bankAccount/);
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    $state.go(stateName, {maintenanceState: getRandomMaintenanceState});
                    $rootScope.$digest();
                });

                it("should call Payment.getPayment", function () {
                    expect(Payment.getPayment).toHaveBeenCalledWith();
                });

                it("should call BankManager.getActiveBanks", function () {
                    expect(BankManager.getActiveBanks).toHaveBeenCalledWith();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve the payment", function () {
                    expect($injector.invoke($state.current.views["view@payment"].resolve.payment)).toEqual(mockPayment1);
                });

                describe("when the payment does not have a bank account", function () {

                    beforeEach(function () {
                        mockPayment1.bankAccount = null;

                        $state.go(stateName);
                        $rootScope.$digest();
                    });

                    it("should resolve the bankAccounts", function () {
                        var expectedBankAccounts = _.sortBy(mockBankAccounts, "name");

                        expect($injector.invoke($state.current.views["view@payment"].resolve.bankAccounts)).toEqual(expectedBankAccounts);
                    });

                });

                describe("when the payment has a bank account NOT in the collection", function () {

                    beforeEach(function () {
                        mockPayment1.bankAccount = TestUtils.getRandomBank(BankModel);

                        $state.go(stateName);
                        $rootScope.$digest();
                    });

                    it("should resolve the bankAccounts", function () {
                        var expectedBankAccounts = _.sortBy(mockBankAccounts, "name");

                        expect($injector.invoke($state.current.views["view@payment"].resolve.bankAccounts)).toEqual(expectedBankAccounts);
                    });

                });

                describe("when the payment has a bank account in the collection", function () {

                    beforeEach(function () {
                        mockPayment1.bankAccount = mockBank2;

                        $state.go(stateName);
                        $rootScope.$digest();
                    });

                    it("should resolve the bankAccounts", function () {
                        var expectedBankAccounts = {};
                        expectedBankAccounts[mockBank1.id] = mockBank1;
                        expectedBankAccounts[mockBank3.id] = mockBank3;

                        expectedBankAccounts = _.sortBy(expectedBankAccounts, "name");

                        expect($injector.invoke($state.current.views["view@payment"].resolve.bankAccounts)).toEqual(expectedBankAccounts);
                    });

                });

            });

        });

        function getRandomMaintenanceState() {
            return TestUtils.getRandomValueFromMap(mockGlobals.PAYMENT_MAINTENANCE.STATES);
        }

    });

})();