(function () {
    "use strict";

    var _,
        ctrl,
        $rootScope,
        $scope,
        InvoiceManager,
        mockBank,
        mockPayment,
        mockInvoiceSummary,
        PaymentMaintenanceUtil;

    describe("A Payment Maintenance Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.core");
            module("app.components.payment");
            module("app.components.bank");
            module("app.components.invoice");
            module("app.components.brand");
            module("app.components.util");
            module("app.components.user");
            module("app.components.navigation");
            module("app.components.widgets");

            //mock dependencies:
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            PaymentMaintenanceUtil = jasmine.createSpyObj("PaymentMaintenanceUtil", ["isAddState"]);

            inject(function (___, $controller, _$rootScope_, BankModel, InvoiceSummaryModel, PaymentModel) {
                $rootScope = _$rootScope_;
                _ = ___;

                $scope = $rootScope.$new();

                mockBank = TestUtils.getRandomBank(BankModel);
                mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
                mockInvoiceSummary = TestUtils.getRandomInvoiceSummary(InvoiceSummaryModel);
            });

            //setup spies:
            InvoiceManager.getInvoiceSummary.and.returnValue(mockInvoiceSummary);
        });

        describe("when the maintenance state is ADD", function () {

            beforeEach(function () {
                inject(function($controller) {
                    PaymentMaintenanceUtil.isAddState.and.returnValue(true);

                    jasmine.clock().mockDate();

                    ctrl = $controller("PaymentMaintenanceController", {
                        $scope                : $scope,
                        defaultBank           : mockBank,
                        payment               : mockPayment,
                        InvoiceManager        : InvoiceManager,
                        PaymentMaintenanceUtil: PaymentMaintenanceUtil
                    });
                });
            });

            it("should set payment.amount to the expected value", function () {
                expect(mockPayment.amount).toEqual(mockInvoiceSummary.statementBalance);
            });

            it("should set payment.scheduledDate to the expected value", function () {
                expect(mockPayment.scheduledDate).toEqual(new Date());
            });

            it("should set payment.bankAccount to the expected value", function () {
                expect(mockPayment.bankAccount).toEqual(mockBank);
            });
        });

        describe("when the maintenance state is NOT ADD", function () {
            var originalPayment;

            beforeEach(function () {
                inject(function ($controller, globals, PaymentModel) {
                    originalPayment = new PaymentModel();
                    originalPayment.set(mockPayment);

                    PaymentMaintenanceUtil.isAddState.and.returnValue(false);

                    ctrl = $controller("PaymentMaintenanceController", {
                        $scope                : $scope,
                        defaultBank           : mockBank,
                        payment               : mockPayment,
                        InvoiceManager        : InvoiceManager,
                        PaymentMaintenanceUtil: PaymentMaintenanceUtil
                    });
                });
            });

            it("should NOT modify payment", function () {
                expect(mockPayment).toEqual(originalPayment);
            });
        });
    });
})();
