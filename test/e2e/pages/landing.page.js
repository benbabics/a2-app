"use strict";

var AppPage = require("./app.page.js");

var LandingPage = (function () {

    function LandingPage() {
        AppPage.call(this);

        this.companyDetails = element(by.id("companyDetails"));
        this.availableCredit = element(by.id("availableCredit"));
        this.paymentDueDateLabel = element(by.id("paymentDueDateLabel"));
        this.paymentDueDate = element(by.id("paymentDueDate"));
        this.currentBalanceLabel = element(by.id("currentBalanceLabel"));
        this.currentBalance = element(by.id("currentBalance"));
        this.minimumPaymentLabel = element(by.id("minimumPaymentLabel"));
        this.minimumPayment = element(by.id("minimumPayment"));
        this.makePaymentButton = element(by.id("makePaymentButton"));
        this.transactionActivityButton = element(by.id("transactionActivityButton"));
        this.cardsButton = element(by.id("cardsButton"));
        this.driversButton = element(by.id("driversButton"));
    }

    LandingPage.prototype = Object.create(AppPage.prototype);

    LandingPage.prototype.focus = function () {
        return browser.get("/#/landing");
    };

    return LandingPage;
})();

module.exports = LandingPage;