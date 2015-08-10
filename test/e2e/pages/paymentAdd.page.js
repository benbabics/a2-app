"use strict";

var AppPage = require("./app.page.js");

var PaymentAddPage = (function () {

    function PaymentAddPage() {
        AppPage.call(this);

        this.focus();

        this.invoiceNumberLabel  = element(by.id("invoiceNumberLabel"));
        this.invoiceNumber       = element(by.id("invoiceNumber"));
        this.currentBalanceLabel = element(by.id("currentBalanceLabel"));
        this.currentBalance      = element(by.id("currentBalance"));
        this.minimumPaymentLabel = element(by.id("minimumPaymentLabel"));
        this.minimumPayment      = element(by.id("minimumPayment"));
        this.paymentDueDateLabel = element(by.id("paymentDueDateLabel"));
        this.paymentDueDate      = element(by.id("paymentDueDate"));
        this.paymentAmountLabel  = element(by.id("paymentAmountLabel"));
        this.paymentAmount       = element(by.id("paymentAmount"));
        this.bankAccountLabel    = element(by.id("bankAccountLabel"));
        this.bankAccount         = element(by.id("bankAccount"));
        this.scheduledDateLabel  = element(by.id("scheduledDateLabel"));
        this.scheduledDate       = element(by.id("scheduledDate"));
        this.submitButton        = element(by.id("makePaymentButton"));
    }

    PaymentAddPage.prototype = Object.create(AppPage.prototype);

    PaymentAddPage.prototype.focus = function () {
        //TODO - Figure out why this isn't working
        browser.get("/#/payment/add");
    };

    return PaymentAddPage;
})();

module.exports = PaymentAddPage;