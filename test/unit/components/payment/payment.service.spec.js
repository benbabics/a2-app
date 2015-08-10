(function () {
    "use strict";

    var $q,
        $rootScope,
        resolveHandler,
        rejectHandler,
        BankManager,
        BankModel,
        InvoiceManager,
        Payment,
        PaymentModel,
        UserManager,
        mockCurrentInvoiceSummary = {
            accountNumber     : "account number value",
            availableCredit   : "available credit value",
            closingDate       : "closing date value",
            currentBalance    : "current balance value",
            currentBalanceAsOf: "current balance as of value",
            invoiceId         : "invoice id value",
            invoiceNumber     : "invoice number value",
            minimumPaymentDue : "minimum payment due value",
            paymentDueDate    : "payment due date value"
        },
        mockUser = {
            newField1: "some value",
            newField2: "some other value",
            newField3: "yet another value",
            email    : "email address value",
            firstName: "first name value",
            username : "username value",
            company  : {
                accountId    : "company account id value",
                accountNumber: "company account number value",
                name         : "company name value"
            },
            billingCompany: {
                accountId    : "billing company account id value",
                accountNumber: "billing company account number value",
                name         : "billing company name value"
            }
        };

    describe("A Payment Add Service", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components");

            // stub the routing and template loading
            module(function($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            // mock dependencies
            BankManager = jasmine.createSpyObj("BankManager", ["getDefaultBank"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);

            InvoiceManager.getInvoiceSummary.and.returnValue(mockCurrentInvoiceSummary);
            UserManager.getUser.and.returnValue(mockUser);

            module(function ($provide) {
                $provide.value("BankManager", BankManager);
                $provide.value("InvoiceManager", InvoiceManager);
                $provide.value("UserManager", UserManager);
            });

            inject(function (_$q_, _$rootScope_, globals, _BankModel_, _Payment_, _PaymentModel_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                BankModel = _BankModel_;
                Payment = _Payment_;
                PaymentModel = _PaymentModel_;
            });

            // set up spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a userLoggedOut event handler function that", function () {

            beforeEach(function() {
                var mockPaymentAddModel = TestUtils.getRandomPaymentAdd(PaymentModel, BankModel);

                Payment.setPayment(mockPaymentAddModel);
                $rootScope.$broadcast("userLoggedOut");
            });

            it("should reset the payment model", function () {
                expect(Payment.getPayment()).toEqual({});
            });

        });

        describe("has a getPayment function that", function () {

            it("should return the payment  passed to setPayment", function () {
                var mockPaymentAddModel = TestUtils.getRandomPaymentAdd(PaymentModel, BankModel),
                    result;

                Payment.setPayment(mockPaymentAddModel);
                result = Payment.getPayment();

                expect(result).toEqual(mockPaymentAddModel);
            }) ;

            // TODO: figure out how to test this without using setPaymentAdd
        });

        describe("has a getOrCreatePaymentAdd function that", function () {

            var result;

            describe("when payment has already been created", function () {

                var mockPaymentAddModel;

                beforeEach(function () {
                    mockPaymentAddModel = TestUtils.getRandomPaymentAdd(PaymentModel, BankModel);

                    Payment.setPayment(mockPaymentAddModel);

                    Payment.getOrCreatePaymentAdd()
                        .then(function (response) {
                            result = response;
                        })
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should NOT call getDefaultBank", function () {
                    expect(BankManager.getDefaultBank).not.toHaveBeenCalledWith();
                });

                it("should return the correct result", function () {
                    expect(result).toEqual(mockPaymentAddModel);
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

            });

            describe("when payment has NOT been created", function () {

                var mockBank,
                    mockCurrentDate;

                beforeEach(function () {
                    var getDefaultBankDeferred = $q.defer();

                    //return a promise object and resolve it
                    BankManager.getDefaultBank.and.returnValue(getDefaultBankDeferred.promise);

                    Payment.setPayment(null);

                    mockCurrentDate = new Date();
                    jasmine.clock().mockDate(mockCurrentDate);

                    Payment.getOrCreatePaymentAdd()
                        .then(function (response) { result = response; })
                        .catch(rejectHandler);

                    mockBank = TestUtils.getRandomBank(BankModel);

                    getDefaultBankDeferred.resolve(mockBank);
                    $rootScope.$digest();
                });

                it("should call getDefaultBank", function () {
                    expect(BankManager.getDefaultBank).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should return the correct result", function () {
                    expect(result.amount).toEqual(mockCurrentInvoiceSummary.minimumPaymentDue);
                    expect(result.bankAccount).toEqual(mockBank.name);
                    expect(result.scheduledDate).toEqual(mockCurrentDate);
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

            });

        });

        describe("has a setPayment function that", function () {

            it("should return the payment passed to setPayment", function () {
                var mockPaymentAddModel = TestUtils.getRandomPaymentAdd(PaymentModel, BankModel),
                    result;

                Payment.setPayment(mockPaymentAddModel);
                result = Payment.getPayment();

                expect(result).toEqual(mockPaymentAddModel);
            }) ;

            // TODO: figure out how to test this without using getPaymentAdd
        });

    });

})();