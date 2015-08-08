(function () {
    "use strict";

    var _,
        $scope,
        ctrl,
        BankManager,
        BankModel,
        InvoiceManager,
        mockPayment = {
            amount     : "amount value",
            bankAccount: "bank account value",
            paymentDate: "payment date value"
        },
        mockCurrentInvoiceSummary = {
            newField1         : "some value",
            newField2         : "some other value",
            newField3         : "yet another value",
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
        },
        UserManager;

    describe("A Payment Add Controller", function () {

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
            BankManager = jasmine.createSpyObj("BankManager", ["getActiveBanks"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            module(function($provide) {
                $provide.value("BankManager", BankManager);
                $provide.value("InvoiceManager", InvoiceManager);
                $provide.value("UserManager", UserManager);
            });

            inject(function ($controller, $rootScope, _BankModel_, CommonService) {

                _ = CommonService._;
                BankModel = _BankModel_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentAddController", {
                    $scope        : $scope,
                    payment       : mockPayment,
                    InvoiceManager: InvoiceManager,
                    UserManager   : UserManager
                });
            });

            InvoiceManager.getInvoiceSummary.and.returnValue(mockCurrentInvoiceSummary);
            UserManager.getUser.and.returnValue(mockUser);
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function() {
                //setup an existing values to test them being modified
                ctrl.hasAnyCards = null;

                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the payment", function () {
                expect(ctrl.payment).toEqual(mockPayment);
            });

            it("should set the billing company", function () {
                expect(ctrl.billingCompany).toEqual(mockUser.billingCompany);
            });

            it("should set the invoice summary", function () {
                expect(ctrl.invoiceSummary).toEqual(mockCurrentInvoiceSummary);
            });

            describe("when there are NOT any active banks", function () {

                beforeEach(function() {
                    BankManager.getActiveBanks.and.returnValue(null);

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should set the hasMultipleBanks flag", function () {
                    expect(ctrl.hasMultipleBanks).toBeFalsy();
                });

            });

            describe("when there is a single active bank", function () {

                beforeEach(function() {
                    var bankModel1,
                        mockBankCollection = {};

                    bankModel1 = TestUtils.getRandomBank(BankModel);
                    mockBankCollection[bankModel1.id] = bankModel1;

                    BankManager.getActiveBanks.and.returnValue(mockBankCollection);

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should set the hasMultipleBanks flag", function () {
                    expect(ctrl.hasMultipleBanks).toBeFalsy();
                });

            });

            describe("when there are multiple active banks", function () {

                beforeEach(function() {
                    var bankModel1,
                        bankModel2,
                        mockBankCollection = {};

                    bankModel1 = TestUtils.getRandomBank(BankModel);
                    bankModel2 = TestUtils.getRandomBank(BankModel);
                    mockBankCollection[bankModel1.id] = bankModel1;
                    mockBankCollection[bankModel2.id] = bankModel2;

                    BankManager.getActiveBanks.and.returnValue(mockBankCollection);

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should set the hasMultipleBanks flag", function () {
                    expect(ctrl.hasMultipleBanks).toBeTruthy();
                });

            });

        });

    });

}());