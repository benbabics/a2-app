(function () {
    "use strict";

    describe("A Payment Module Route Config", function () {

        var $injector,
            $q,
            $rootScope,
            $state,
            bankModel1,
            bankModel2,
            bankModel3,
            mockBankAccounts,
            mockPayment,
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
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            module(function ($provide) {
                $provide.value("Payment", Payment);
                $provide.value("BankManager", BankManager);
                $provide.value("UserManager", UserManager);
                $provide.value("InvoiceManager", InvoiceManager);
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
            mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);

            bankModel1 = TestUtils.getRandomBank(BankModel);
            bankModel2 = TestUtils.getRandomBank(BankModel);
            bankModel3 = TestUtils.getRandomBank(BankModel);

            mockBankAccounts = {};
            mockBankAccounts[bankModel1.id] = bankModel1;
            mockBankAccounts[bankModel2.id] = bankModel2;
            mockBankAccounts[bankModel3.id] = bankModel3;

            BankManager.getActiveBanks.and.returnValue(mockBankAccounts);
            Payment.getPayment.and.returnValue(mockPayment);
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
                expect(state.template).toEqual("<ion-nav-view name='payment-view'></ion-nav-view>");
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
                expect(state.views["payment-view"]).toBeDefined();
                expect(state.views["payment-view"].template).toEqual("<ion-nav-view></ion-nav-view>");
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

        });

        describe("has a payment.add state that", function () {
            var state,
                stateName = "payment.add";

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
                expect(state.url).toEqual("/add");
            });

            it("should define a payment-view", function () {
                expect(state.views).toBeDefined();
                expect(state.views["payment-view"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/payment/add");
            });

            describe("when navigated to", function () {

                var getOrFetchPaymentAddDeferred;

                beforeEach(function () {
                    getOrFetchPaymentAddDeferred = $q.defer();
                    UserManager.getUser.and.returnValue(mockUser);
                    Payment.getOrCreatePaymentAdd.and.returnValue(getOrFetchPaymentAddDeferred.promise);

                    $state.go(stateName);
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

        describe("has a payment.summary state that", function () {
            var state,
                stateName = "payment.summary";

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

            it("should define a payment-view", function () {
                expect(state.views).toBeDefined();
                expect(state.views["payment-view"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/payment/summary");
            });

        });

        describe("has a payment.confirmation state that", function () {
            var state,
                stateName = "payment.confirmation";

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

            it("should define a payment-view", function () {
                expect(state.views).toBeDefined();
                expect(state.views["payment-view"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/payment/confirmation");
            });

        });

        describe("has a payment.input state that", function () {
            var state,
                stateName = "payment.input";

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
                expect(state.url).toEqual("/input");
            });
        });

        describe("has a payment.input.amount state that", function () {
            var state,
                stateName = "payment.input.amount";

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
                expect(state.views["payment-view@payment"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/payment/input/amount");
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    $state.go(stateName);
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
            });
        });

        describe("has a payment.input.bankAccount state that", function () {
            var state,
                stateName = "payment.input.bankAccount";

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
                expect(state.views["payment-view@payment"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/payment/input/bankAccount");
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    $state.go(stateName);
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
                    expect($injector.invoke($state.current.views["payment-view@payment"].resolve.payment)).toEqual(mockPayment);
                });

                describe("when the payment does not have a bank account", function () {

                    beforeEach(function () {
                        mockPayment.bankAccount = null;

                        $state.go(stateName);
                        $rootScope.$digest();
                    });

                    it("should resolve the bankAccounts", function () {
                        var expectedBankAccounts = _.sortBy(mockBankAccounts, "name");

                        expect($injector.invoke($state.current.views["payment-view@payment"].resolve.bankAccounts)).toEqual(expectedBankAccounts);
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

                        expect($injector.invoke($state.current.views["payment-view@payment"].resolve.bankAccounts)).toEqual(expectedBankAccounts);
                    });

                });

                describe("when the payment has a bank account in the collection", function () {

                    beforeEach(function () {
                        mockPayment.bankAccount = bankModel2;

                        $state.go(stateName);
                        $rootScope.$digest();
                    });

                    it("should resolve the bankAccounts", function () {
                        var expectedBankAccounts = {};
                        expectedBankAccounts[bankModel1.id] = bankModel1;
                        expectedBankAccounts[bankModel3.id] = bankModel3;

                        expectedBankAccounts = _.sortBy(expectedBankAccounts, "name");

                        expect($injector.invoke($state.current.views["payment-view@payment"].resolve.bankAccounts)).toEqual(expectedBankAccounts);
                    });

                });

            });

        });

        describe("has a payment.input.date state that", function () {
            var state,
                stateName = "payment.input.date";

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
                expect(state.url).toEqual("/date");
            });

            it("should define a view on the payment view container", function () {
                expect(state.views).toBeDefined();
                expect(state.views["payment-view@payment"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/payment/input/date");
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    $state.go(stateName);
                    $rootScope.$digest();
                });

                it("should call Payment.getPayment", function () {
                    expect(Payment.getPayment).toHaveBeenCalledWith();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve the payment", function () {
                    expect($injector.invoke($state.current.views["payment-view@payment"].resolve.payment)).toEqual(mockPayment);
                });
            });
        });
    });

})();