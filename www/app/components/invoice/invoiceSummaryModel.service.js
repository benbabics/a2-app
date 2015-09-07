(function () {
    "use strict";

    var InvoiceSummaryModel = function () {

        function InvoiceSummaryModel() {
            this.accountNumber = "";
            this.availableCredit = "";
            this.billingDate = "";
            this.billedAmount = "";
            this.closingDate = "";
            this.currentBalance = "";
            this.currentBalanceAsOf = "";
            this.invoiceId = "";
            this.invoiceNumber = "";
            this.minimumPaymentDue = "";
            this.paymentDueDate = "";
            this.statementBalance = "";
            this.unbilledAmount = "";
        }

        InvoiceSummaryModel.prototype.set = function (invoiceSummaryResource) {
            angular.extend(this, invoiceSummaryResource);
        };

        return InvoiceSummaryModel;
    };

    angular
        .module("app.components.invoice")
        .factory("InvoiceSummaryModel", InvoiceSummaryModel);
})();