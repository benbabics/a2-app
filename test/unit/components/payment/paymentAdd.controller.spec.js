(function () {
    "use strict";

    var $scope,
        ctrl,
        InvoiceManager,
        mockActiveBanks = [
            {
                id         : "Bank Id 1",
                defaultBank: false,
                name       : "Bank Name 1"
            },
            {
                id         : "Bank Id 2",
                defaultBank: true,
                name       : "Bank Name 2"
            },
            {
                id         : "Bank Id 3",
                defaultBank: false,
                name       : "Bank Name 3"
            }
        ],
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
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);

            inject(function ($controller, $rootScope) {

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentAddController", {
                    $scope        : $scope,
                    activeBanks   : mockActiveBanks,
                    InvoiceManager: InvoiceManager,
                    UserManager   : UserManager
                });
            });
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function() {
                InvoiceManager.getInvoiceSummary.and.returnValue(mockCurrentInvoiceSummary);
                UserManager.getUser.and.returnValue(mockUser);

                //setup an existing values to test them being modified
                ctrl.hasAnyCards = null;
                ctrl.globalError = "This is a previous error";

                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the active banks", function () {
                expect(ctrl.activeBanks).toEqual(mockActiveBanks);
            });

            it("should set the billing company", function () {
                expect(ctrl.billingCompany).toEqual(mockUser.billingCompany);
            });

            it("should set the invoice summary", function () {
                expect(ctrl.invoiceSummary).toEqual(mockCurrentInvoiceSummary);
            });

        });

    });

}());