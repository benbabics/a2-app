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
        mockMaintenanceState,
        mockMaintenance;

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

            //mock dependencies:
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);

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
                inject(function($controller, globals, PaymentMaintenanceDetailsModel) {
                    mockMaintenance = TestUtils.getRandomPaymentMaintenanceDetails(PaymentMaintenanceDetailsModel, globals.PAYMENT_MAINTENANCE.STATES);
                    mockMaintenance.state = mockMaintenanceState = globals.PAYMENT_MAINTENANCE.STATES.ADD;

                    jasmine.clock().mockDate();

                    ctrl = $controller("PaymentMaintenanceController", {
                        $scope            : $scope,
                        InvoiceManager    : InvoiceManager,
                        defaultBank       : mockBank,
                        payment           : mockPayment,
                        maintenanceDetails: mockMaintenance
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

        describe("when the maintenance state is UPDATE", function () {
            var originalPayment;

            beforeEach(function () {
                inject(function ($controller, globals, PaymentMaintenanceDetailsModel, PaymentModel) {
                    originalPayment = new PaymentModel();
                    originalPayment.set(mockPayment);

                    mockMaintenance = TestUtils.getRandomPaymentMaintenanceDetails(PaymentMaintenanceDetailsModel, globals.PAYMENT_MAINTENANCE.STATES);
                    mockMaintenance.state = mockMaintenanceState = globals.PAYMENT_MAINTENANCE.STATES.UPDATE;

                    ctrl = $controller("PaymentMaintenanceController", {
                        $scope            : $scope,
                        InvoiceManager    : InvoiceManager,
                        defaultBank       : mockBank,
                        payment           : mockPayment,
                        maintenanceDetails: mockMaintenance
                    });
                });
            });

            it("should NOT modify payment", function () {
                expect(mockPayment).toEqual(originalPayment);
            });
        });
    });
})();