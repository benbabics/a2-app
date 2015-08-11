(function () {
    "use strict";

    var _,
        $q,
        $scope,
        $state,
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
        mockPayment,
        mockPaymentAdd,
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
        moment,
        BankModel,
        InvoiceManager,
        Payment,
        PaymentManager,
        PaymentModel,
        UserManager;

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
            $state = jasmine.createSpyObj("state", ["go"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            Payment = jasmine.createSpyObj("Payment", ["getPayment"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["addPayment"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);

            inject(function ($controller, _$q_, $rootScope, _moment_, _BankModel_, CommonService, _PaymentModel_) {

                _ = CommonService._;
                $q = _$q_;
                moment = _moment_;
                BankModel = _BankModel_;
                PaymentModel = _PaymentModel_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentSummaryController", {
                    $scope        : $scope,
                    $state        : $state,
                    InvoiceManager: InvoiceManager,
                    Payment       : Payment,
                    PaymentManager: PaymentManager,
                    UserManager   : UserManager
                });

            });

            mockPaymentAdd = TestUtils.getRandomPaymentAdd(PaymentModel, BankModel);
            mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
            InvoiceManager.getInvoiceSummary.and.returnValue(mockCurrentInvoiceSummary);
            Payment.getPayment.and.returnValue(mockPaymentAdd);
            UserManager.getUser.and.returnValue(mockUser);
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            it("should set the payment", function () {
                $scope.$broadcast("$ionicView.beforeEnter");

                expect(ctrl.payment).toEqual(mockPaymentAdd);
            });

            describe("when payment details meet expectations", function () {

                beforeEach(function() {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPaymentAdd.amount;
                    mockCurrentInvoiceSummary.paymentDueDate = mockPaymentAdd.scheduledDate;

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should NOT have any warnings", function () {
                    expect(ctrl.warnings.length).toEqual(0);
                });

            });

            describe("when payment details exceed expectations", function () {

                beforeEach(function() {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPaymentAdd.amount - 0.01;
                    mockCurrentInvoiceSummary.paymentDueDate = moment(mockPaymentAdd.scheduledDate).add(1, "day");

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should NOT have any warnings", function () {
                    expect(ctrl.warnings.length).toEqual(0);
                });

            });

            describe("when the payment amount is less than the minimum amount due", function () {

                beforeEach(function() {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPaymentAdd.amount + 0.01;
                    mockCurrentInvoiceSummary.paymentDueDate = moment(mockPaymentAdd.scheduledDate);

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should only have a payment amount warning", function () {
                    expect(ctrl.warnings.length).toEqual(1);
                    expect(ctrl.warnings[0]).toEqual("This amount is less than the minimum payment.");
                });

            });

            describe("when the payment date is after than the payment due date", function () {

                beforeEach(function() {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPaymentAdd.amount;
                    mockCurrentInvoiceSummary.paymentDueDate = moment(mockPaymentAdd.scheduledDate).subtract(1, "day");

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should only have a payment date warning", function () {
                    expect(ctrl.warnings.length).toEqual(1);
                    expect(ctrl.warnings[0]).toEqual("The date selected for payment is past the due date.");
                });

            });

            describe("when both warnings should be found", function () {

                beforeEach(function() {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPaymentAdd.amount + 0.01;
                    mockCurrentInvoiceSummary.paymentDueDate = moment(mockPaymentAdd.scheduledDate).subtract(1, "day");

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should have a payment amount warning and a payment date warning", function () {
                    expect(ctrl.warnings.length).toEqual(2);
                    expect(ctrl.warnings[0]).toEqual("This amount is less than the minimum payment.");
                    expect(ctrl.warnings[1]).toEqual("The date selected for payment is past the due date.");
                });

            });
        });

        describe("has a addPayment function that", function () {

            var addPaymentDeferred;

            beforeEach(function () {
                addPaymentDeferred = $q.defer();
                PaymentManager.addPayment.and.returnValue(addPaymentDeferred.promise);

                spyOn(mockPaymentAdd, "set").and.callThrough();

                ctrl.payment = mockPaymentAdd;

                ctrl.addPayment();
            });

            it("should add the Payment", function () {
                expect(PaymentManager.addPayment).toHaveBeenCalledWith(mockUser.billingCompany.accountId, mockPaymentAdd);
            });

            describe("when the Payment is added successfully", function () {

                beforeEach(function () {
                    //resolve the add payment promise
                    addPaymentDeferred.resolve(mockPayment);

                    $scope.$digest();
                });

                it("should set the payment", function () {
                    expect(mockPaymentAdd.set).toHaveBeenCalledWith(mockPayment);
                });

                it("should navigate to the payment confirmation page", function () {
                    expect($state.go).toHaveBeenCalledWith("payment.confirmation");
                });

            });

            describe("when the Payment is NOT added successfully", function () {

                var errorObjectArg = new Error("Adding payment failed");

                beforeEach(function () {
                    //reject with an error message
                    addPaymentDeferred.reject(errorObjectArg);

                    $scope.$digest();
                });

                it("should NOT set the payment", function () {
                    expect(mockPaymentAdd.set).not.toHaveBeenCalled();
                });

                it("should NOT navigate away from the current page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

            });

        });

    });

}());