(function () {
    "use strict";

    var _,
        $ionicHistory,
        $scope,
        ctrl,
        mockCurrentInvoiceSummary = {
            accountNumber     : "account number value",
            availableCredit   : "available credit value",
            closingDate       : "closing date value",
            currentBalance    : "current balance value",
            currentBalanceAsOf: "current balance as of value",
            invoiceId         : "invoice id value",
            invoiceNumber     : "invoice number value",
            minimumPaymentDue : 150.00,
            paymentDueDate    : "2015-05-26"
        },
        mockPayment = {
            amount     : 150.00,
            bankAccount: "bank account value",
            paymentDate: "2015-05-26"
        },
        InvoiceManager;

    describe("A Payment Summary Controller", function () {

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
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["goBack"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);

            inject(function ($controller, $rootScope, CommonService) {

                _ = CommonService._;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentSummaryController", {
                    $ionicHistory : $ionicHistory,
                    $scope        : $scope,
                    payment       : mockPayment,
                    InvoiceManager: InvoiceManager
                });

            });

            InvoiceManager.getInvoiceSummary.and.returnValue(mockCurrentInvoiceSummary);
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            it("should set the payment", function () {
                $scope.$broadcast("$ionicView.beforeEnter");

                expect(ctrl.payment).toEqual(mockPayment);
            });

            describe("when payment details meet expectations", function () {

                beforeEach(function() {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPayment.amount;
                    mockCurrentInvoiceSummary.paymentDueDate = mockPayment.paymentDate;

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should NOT have any warnings", function () {
                    expect(ctrl.warnings.length).toEqual(0);
                });

            });

            describe("when payment details exceed expectations", function () {

                beforeEach(function() {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPayment.amount - 0.01;
                    mockCurrentInvoiceSummary.paymentDueDate = "2015-05-27";

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should NOT have any warnings", function () {
                    expect(ctrl.warnings.length).toEqual(0);
                });

            });

            describe("when the payment amount is less than the minimum amount due", function () {

                beforeEach(function() {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPayment.amount + 0.01;
                    mockCurrentInvoiceSummary.paymentDueDate = mockPayment.paymentDate;

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should only have a payment amount warning", function () {
                    expect(ctrl.warnings.length).toEqual(1);
                    expect(ctrl.warnings[0]).toEqual("This amount is less than the minimum payment.");
                });

            });

            describe("when the payment date is after than the payment due date", function () {

                beforeEach(function() {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPayment.amount;
                    mockCurrentInvoiceSummary.paymentDueDate = "2015-05-25";

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should only have a payment date warning", function () {
                    expect(ctrl.warnings.length).toEqual(1);
                    expect(ctrl.warnings[0]).toEqual("The date selected for payment is past the due date.");
                });

            });

            describe("when both warnings should be found", function () {

                beforeEach(function() {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPayment.amount + 0.01;
                    mockCurrentInvoiceSummary.paymentDueDate = "2015-05-25";

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should have a payment amount warning and a payment date warning", function () {
                    expect(ctrl.warnings.length).toEqual(2);
                    expect(ctrl.warnings[0]).toEqual("This amount is less than the minimum payment.");
                    expect(ctrl.warnings[1]).toEqual("The date selected for payment is past the due date.");
                });

            });
        });

        describe("has a goBack function that", function () {

            beforeEach(function () {
                ctrl.goBack();
            });

            it("should call $ionicHistory.goBack", function () {
                expect($ionicHistory.goBack).toHaveBeenCalledWith();
            });

        });
    });

}());