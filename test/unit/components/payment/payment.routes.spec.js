(function () {
    "use strict";

    describe("A Payment Module Route Config", function () {

        var $injector,
            $location,
            $q,
            $rootScope,
            $state,
            mockBankAccounts,
            mockGlobals = {
                PAYMENT_MAINTENANCE: {
                    STATES: {
                        "ADD": "add",
                        "UPDATE": "update"
                    }
                },

                PAYMENT_LIST: {
                    "SEARCH_OPTIONS": {
                        "PAGE_NUMBER": TestUtils.getRandomInteger(0, 20),
                        "PAGE_SIZE"  : TestUtils.getRandomInteger(10, 100)
                    }
                },

                PAYMENT_ADD            : {
                    CONFIG  : {},
                    WARNINGS: {
                        BANK_ACCOUNTS_NOT_SETUP  : "Banks Not Setup",
                        DIRECT_DEBIT_SETUP       : "Direct Debit Enabled",
                        NO_BALANCE_DUE           : "No Current Balance",
                        PAYMENT_ALREADY_SCHEDULED: "Payment Already Scheduled"
                    }
                },

                BUTTONS: {
                    "CONFIG": {
                        "cancel": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "done"  : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                }
            },
            mockPayment,
            mockPayments,
            mockUser,
            BankManager,
            BankModel,
            CommonService,
            PaymentMaintenance,
            PaymentManager,
            PaymentModel,
            InvoiceManager,
            UserManager;

        beforeEach(function () {

            module("app.shared");
            module("app.components.bank");
            module("app.components.payment");
            module("app.components.user");
            module("app.html");

            // mock dependencies
            PaymentMaintenance = jasmine.createSpyObj("PaymentMaintenance", ["getOrCreatePaymentAdd", "getPayment"]);
            BankManager = jasmine.createSpyObj("BankManager", ["getActiveBanks", "hasMultipleBanks"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["fetchPayment", "fetchPaymentAddAvailability", "fetchPayments", "fetchScheduledPaymentsCount"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            module(function ($provide, sharedGlobals) {
                $provide.value("globals", angular.extend({}, mockGlobals, sharedGlobals));
                $provide.value("BankManager", BankManager);
                $provide.value("InvoiceManager", InvoiceManager);
                $provide.value("PaymentMaintenance", PaymentMaintenance);
                $provide.value("PaymentManager", PaymentManager);
                $provide.value("UserManager", UserManager);
            });

            inject(function (_$injector_, _$location_, _$q_, _$rootScope_, _$state_, _BankModel_, _CommonService_, _PaymentModel_, UserAccountModel, UserModel) {
                $injector = _$injector_;
                $location = _$location_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
                BankModel = _BankModel_;
                CommonService = _CommonService_;
                PaymentModel = _PaymentModel_;

                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);
            });

            // setup mock objects
            mockBankAccounts = getRandomBanks(BankModel);
            mockPayments = getRandomPayments(PaymentModel, BankModel);
            mockPayment = TestUtils.getRandomValueFromArray(mockPayments);

            BankManager.getActiveBanks.and.returnValue(mockBankAccounts);
            PaymentMaintenance.getPayment.and.returnValue(mockPayment);

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

        describe("has a payment.detail state that", function () {
            var state,
                stateName = "payment.detail";

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
                expect(state.url).toEqual("/detail/:paymentId");
            });

            it("should define a view@payment", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName, {paymentId: "1234"})).toEqual("#/payment/detail/1234");
            });

            describe("when navigated to", function () {

                var fetchPaymentDeferred,
                    fetchScheduledPaymentsCountDeferred,
                    mockPaymentId = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                beforeEach(function () {
                    fetchPaymentDeferred = $q.defer();
                    PaymentManager.fetchPayment.and.returnValue(fetchPaymentDeferred.promise);

                    fetchScheduledPaymentsCountDeferred = $q.defer();
                    PaymentManager.fetchScheduledPaymentsCount.and.returnValue(fetchScheduledPaymentsCountDeferred.promise);

                    UserManager.getUser.and.returnValue(mockUser);

                    $state.go(stateName, {paymentId: mockPaymentId});

                    fetchPaymentDeferred.resolve(mockPayment);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPayment", function () {
                    expect(PaymentManager.fetchPayment).toHaveBeenCalledWith(mockPaymentId);
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve the payment", function () {
                    $injector.invoke($state.current.views["view@payment"].resolve.payment)
                        .then(function (payment) {
                            expect(payment).toEqual(mockPayment);
                        });
                });

                describe("when the payment NOT is scheduled", function () {

                    it("should NOT call PaymentManager.fetchScheduledPaymentsCount", function () {
                        expect(PaymentManager.fetchScheduledPaymentsCount).not.toHaveBeenCalled();
                    });

                    it("should resolve isPaymentEditable as false", function () {
                        $injector.invoke($state.current.views["view@payment"].resolve.isPaymentEditable, null, {payment: mockPayment})
                            .then(function (isPaymentEditable) {
                                expect(isPaymentEditable).toBeFalsy();
                            });
                    });

                });

                describe("when the payment is scheduled", function () {

                    var mockScheduledPaymentCount;

                    beforeEach(function () {
                        mockPayment.status = "SCHEDULED";
                    });

                    describe("when there is only 1 scheduled payment", function () {

                        beforeEach(function () {
                            mockScheduledPaymentCount = 1;
                            fetchScheduledPaymentsCountDeferred.resolve(mockScheduledPaymentCount);
                            $rootScope.$digest();
                        });

                        it("should resolve isPaymentEditable as true", function () {
                            $injector.invoke($state.current.views["view@payment"].resolve.isPaymentEditable, null, {payment: mockPayment})
                                .then(function (isPaymentEditable) {
                                    expect(isPaymentEditable).toBeTruthy();
                                });
                        });

                    });

                    describe("when there are only multiple scheduled payments", function () {

                        beforeEach(function () {
                            mockScheduledPaymentCount = TestUtils.getRandomInteger(2, 100);
                            fetchScheduledPaymentsCountDeferred.resolve(mockScheduledPaymentCount);
                            $rootScope.$digest();
                        });

                        it("should resolve isPaymentEditable as false", function () {
                            $injector.invoke($state.current.views["view@payment"].resolve.isPaymentEditable, null, {payment: mockPayment})
                                .then(function (isPaymentEditable) {
                                    expect(isPaymentEditable).toBeFalsy();
                                });
                        });

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
                var getOrFetchPaymentAddDeferred,
                    hasMultipleBanksDeferred,
                    mockHasMultipleBanks = TestUtils.getRandomBoolean();

                beforeEach(function () {
                    getOrFetchPaymentAddDeferred = $q.defer();
                    PaymentMaintenance.getOrCreatePaymentAdd.and.returnValue(getOrFetchPaymentAddDeferred.promise);

                    hasMultipleBanksDeferred = $q.defer();
                    UserManager.getUser.and.returnValue(mockUser);
                    BankManager.hasMultipleBanks.and.returnValue(hasMultipleBanksDeferred.promise);

                    $state.go(stateName, {maintenanceState: getRandomMaintenanceState()});
                    getOrFetchPaymentAddDeferred.resolve(mockPayment);
                    hasMultipleBanksDeferred.resolve(mockHasMultipleBanks);
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

        describe("has a payment.update state that", function () {
            var state,
                stateName = "payment.update";

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
                expect(state.url).toEqual("/update");
            });

            describe("when navigated to", function () {
                var getOrFetchPaymentAddDeferred,
                    hasMultipleBanksDeferred,
                    mockHasMultipleBanks = TestUtils.getRandomBoolean();

                beforeEach(function () {
                    getOrFetchPaymentAddDeferred = $q.defer();
                    PaymentMaintenance.getOrCreatePaymentAdd.and.returnValue(getOrFetchPaymentAddDeferred.promise);

                    hasMultipleBanksDeferred = $q.defer();
                    UserManager.getUser.and.returnValue(mockUser);
                    BankManager.hasMultipleBanks.and.returnValue(hasMultipleBanksDeferred.promise);

                    $state.go(stateName, {maintenanceState: getRandomMaintenanceState()});
                    getOrFetchPaymentAddDeferred.resolve(mockPayment);
                    hasMultipleBanksDeferred.resolve(mockHasMultipleBanks);
                    $rootScope.$digest();
                });

                it("should transition to the payment.maintenance.form page in the update state", function () {
                    expect($state.current.name).toBe("payment.maintenance.form");

                    $injector.invoke(function ($stateParams) {
                        expect($stateParams).toEqual({maintenanceState: mockGlobals.PAYMENT_MAINTENANCE.STATES.UPDATE});
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

                var getOrFetchPaymentAddDeferred,
                    hasMultipleBanksDeferred,
                    mockHasMultipleBanks = TestUtils.getRandomBoolean();

                beforeEach(function () {
                    getOrFetchPaymentAddDeferred = $q.defer();
                    PaymentMaintenance.getOrCreatePaymentAdd.and.returnValue(getOrFetchPaymentAddDeferred.promise);

                    hasMultipleBanksDeferred = $q.defer();
                    UserManager.getUser.and.returnValue(mockUser);
                    BankManager.hasMultipleBanks.and.returnValue(hasMultipleBanksDeferred.promise);

                    $state.go(stateName, {maintenanceState: getRandomMaintenanceState()});
                    getOrFetchPaymentAddDeferred.resolve(mockPayment);
                    hasMultipleBanksDeferred.resolve(mockHasMultipleBanks);
                    $rootScope.$digest();
                });

                it("should call PaymentMaintenance.getOrCreatePaymentAdd", function () {
                    expect(PaymentMaintenance.getOrCreatePaymentAdd).toHaveBeenCalledWith();
                });

                it("should call BankManager.hasMultipleBanks", function () {
                    expect(BankManager.hasMultipleBanks).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
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

                it("should call PaymentMaintenance.getPayment", function () {
                    expect(PaymentMaintenance.getPayment).toHaveBeenCalledWith();
                });

                it("should call InvoiceManager.getInvoiceSummary", function () {
                    expect(InvoiceManager.getInvoiceSummary).toHaveBeenCalledWith();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve the payment", function () {
                    expect($injector.invoke($state.current.views["view@payment"].resolve.payment)).toEqual(mockPayment);
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

                it("should call PaymentMaintenance.getPayment", function () {
                    expect(PaymentMaintenance.getPayment).toHaveBeenCalledWith();
                });

                it("should call BankManager.getActiveBanks", function () {
                    expect(BankManager.getActiveBanks).toHaveBeenCalledWith();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve the payment", function () {
                    expect($injector.invoke($state.current.views["view@payment"].resolve.payment)).toEqual(mockPayment);
                });

                describe("when the payment does not have a bank account", function () {

                    beforeEach(function () {
                        mockPayment.bankAccount = null;

                        $state.go(stateName);
                        $rootScope.$digest();
                    });

                    it("should resolve the bankAccounts", function () {
                        var expectedBankAccounts = _.sortBy(mockBankAccounts, "name");

                        expect($injector.invoke($state.current.views["view@payment"].resolve.bankAccounts, null, {payment: mockPayment}))
                            .toEqual(expectedBankAccounts);
                    });

                });

                describe("when the payment has a bank account NOT in the collection", function () {

                    beforeEach(function () {
                        mockPayment.bankAccount = TestUtils.getRandomBank(BankModel);

                        $state.go(stateName);
                        $rootScope.$digest();
                    });

                    it("should resolve the bankAccounts", function () {
                        var expectedBankAccounts = _.sortBy(mockBankAccounts, "name");

                        expect($injector.invoke($state.current.views["view@payment"].resolve.bankAccounts, null, {payment: mockPayment}))
                            .toEqual(expectedBankAccounts);
                    });

                });

                describe("when the payment has a bank account in the collection", function () {

                    beforeEach(function () {
                        mockPayment.bankAccount = TestUtils.getRandomValueFromArray(mockBankAccounts);

                        $state.go(stateName);
                        $rootScope.$digest();
                    });

                    it("should resolve the bankAccounts", function () {
                        var expectedBankAccounts;

                        _.remove(mockBankAccounts, function (bank) {
                            return bank.id === mockPayment.bankAccount.id;
                        });

                        expectedBankAccounts = _.sortBy(mockBankAccounts, "name");

                        expect($injector.invoke($state.current.views["view@payment"].resolve.bankAccounts, null, {payment: mockPayment}))
                            .toEqual(expectedBankAccounts);
                    });

                });

            });

        });

        describe("has a URL handler for '/payment/add/verify' that", function () {

            var paymentAddVerifyPath = "/payment/add/verify",
                paymentAddAvailability = {},
                paymentAddState = "payment.add",
                paymentListState = "payment.list.view",
                fetchPaymentAddAvailabilityDeferred;

            beforeEach(function () {
                fetchPaymentAddAvailabilityDeferred = $q.defer();
                PaymentManager.fetchPaymentAddAvailability.and.returnValue(fetchPaymentAddAvailabilityDeferred.promise);

                UserManager.getUser.and.returnValue(mockUser);

                spyOn($state, "go");
                spyOn(CommonService, "displayAlert");
            });

            describe("when bank accounts have NOT been setup", function () {

                beforeEach(function () {
                    paymentAddAvailability = {
                        makePaymentAllowed                    : false,
                        shouldDisplayCurrentBalanceDueMessage : false,
                        shouldDisplayBankAccountSetupMessage  : true,
                        shouldDisplayDirectDebitEnabledMessage: false,
                        shouldDisplayOutstandingPaymentMessage: false
                    };

                    fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);

                    $location.path(paymentAddVerifyPath);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                    expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should call CommonService.displayAlert", function () {
                    expect(CommonService.displayAlert).toHaveBeenCalledWith({
                        content       : mockGlobals.PAYMENT_ADD.WARNINGS.BANK_ACCOUNTS_NOT_SETUP,
                        buttonCssClass: "button-submit"
                    });
                });

                it("should redirect to the payment list", function () {
                    expect($state.go).toHaveBeenCalledWith(paymentListState);
                });

            });

            describe("when direct debit has been setup", function () {

                beforeEach(function () {
                    paymentAddAvailability = {
                        makePaymentAllowed                    : false,
                        shouldDisplayCurrentBalanceDueMessage : false,
                        shouldDisplayBankAccountSetupMessage  : false,
                        shouldDisplayDirectDebitEnabledMessage: true,
                        shouldDisplayOutstandingPaymentMessage: false
                    };

                    fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);

                    $location.path(paymentAddVerifyPath);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                    expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should call CommonService.displayAlert", function () {
                    expect(CommonService.displayAlert).toHaveBeenCalledWith({
                        content       : mockGlobals.PAYMENT_ADD.WARNINGS.DIRECT_DEBIT_SETUP,
                        buttonCssClass: "button-submit"
                    });
                });

                it("should redirect to the payment list", function () {
                    expect($state.go).toHaveBeenCalledWith(paymentListState);
                });

            });

            describe("when a payment has already been scheduled", function () {

                beforeEach(function () {
                    paymentAddAvailability = {
                        makePaymentAllowed                    : false,
                        shouldDisplayCurrentBalanceDueMessage : false,
                        shouldDisplayBankAccountSetupMessage  : false,
                        shouldDisplayDirectDebitEnabledMessage: false,
                        shouldDisplayOutstandingPaymentMessage: true
                    };

                    fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);

                    $location.path(paymentAddVerifyPath);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                    expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should call CommonService.displayAlert", function () {
                    expect(CommonService.displayAlert).toHaveBeenCalledWith({
                        content       : mockGlobals.PAYMENT_ADD.WARNINGS.PAYMENT_ALREADY_SCHEDULED,
                        buttonCssClass: "button-submit"
                    });
                });

                it("should redirect to the payment list", function () {
                    expect($state.go).toHaveBeenCalledWith(paymentListState);
                });

            });

            describe("when the current balance due message should be displayed", function () {

                beforeEach(function () {
                    paymentAddAvailability = {
                        makePaymentAllowed                    : false,
                        shouldDisplayCurrentBalanceDueMessage : true,
                        shouldDisplayBankAccountSetupMessage  : false,
                        shouldDisplayDirectDebitEnabledMessage: false,
                        shouldDisplayOutstandingPaymentMessage: false
                    };

                    fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);

                    $location.path(paymentAddVerifyPath);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                    expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should call CommonService.displayAlert", function () {
                    expect(CommonService.displayAlert).toHaveBeenCalledWith({
                        content       : mockGlobals.PAYMENT_ADD.WARNINGS.NO_BALANCE_DUE,
                        buttonCssClass: "button-submit"
                    });
                });

                it("should redirect to the payment list", function () {
                    expect($state.go).toHaveBeenCalledWith(paymentListState);
                });

            });

            describe("when no messages should be displayed", function () {

                beforeEach(function () {
                    paymentAddAvailability = {
                        makePaymentAllowed                    : true,
                        shouldDisplayCurrentBalanceDueMessage : false,
                        shouldDisplayBankAccountSetupMessage  : false,
                        shouldDisplayDirectDebitEnabledMessage: false,
                        shouldDisplayOutstandingPaymentMessage: false
                    };

                    fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);

                    $location.path(paymentAddVerifyPath);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                    expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should NOT call CommonService.displayAlert", function () {
                    expect(CommonService.displayAlert).not.toHaveBeenCalled();
                });

                it("should redirect to the payment add state", function () {
                    expect($state.go).toHaveBeenCalledWith(paymentAddState);
                });

            });

        });

        function getRandomBanks(BankModel) {
            var i,
                mockBankCollection,
                numModels;

            mockBankCollection = [];
            numModels = TestUtils.getRandomInteger(1, 100);
            for (i = 0; i < numModels; ++i) {
                mockBankCollection.push(TestUtils.getRandomBank(BankModel));
            }

            return mockBankCollection;
        }

        function getRandomMaintenanceState() {
            return TestUtils.getRandomValueFromMap(mockGlobals.PAYMENT_MAINTENANCE.STATES);
        }

        function getRandomPayments(PaymentModel, BankModel) {
            var i,
                mockPaymentCollection,
                numModels;

            mockPaymentCollection = [];
            numModels = TestUtils.getRandomInteger(1, 100);
            for (i = 0; i < numModels; ++i) {
                mockPaymentCollection.push(TestUtils.getRandomPayment(PaymentModel, BankModel));
            }

            return mockPaymentCollection;
        }
    });

})();