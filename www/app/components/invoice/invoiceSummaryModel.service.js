(function () {
    "use strict";

    var InvoiceSummaryModel = function () {

        function InvoiceSummaryModel() {
            this.accountNumber = "";
            this.availableCredit = "";
            this.closingDate = "";
            this.currentBalance = "";
            this.currentBalanceAsOf = "";
            this.invoiceId = "";
            this.invoiceNumber = "";
            this.minimumPaymentDue = "";
            this.paymentDueDate = "";
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