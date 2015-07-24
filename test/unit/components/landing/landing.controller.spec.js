(function () {
    "use strict";

    var $scope,
        ctrl,
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

            inject(function ($controller, $rootScope) {

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("LandingController", {
                    $scope: $scope,
                    UserManager: UserManager,
                    currentInvoiceSummary: mockCurrentInvoiceSummary
                });
            });
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function() {
                UserManager.getUser.and.returnValue(mockUser);

                //setup an existing values to test them being modified
                ctrl.hasAnyCards = null;
                ctrl.globalError = "This is a previous error";

                $scope.$broadcast("$ionicView.beforeEnter");
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