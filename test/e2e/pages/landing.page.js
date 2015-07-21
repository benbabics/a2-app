"use strict";

var TestUtils = require("../testUtils.protractor.js");

var LandingPage = (function () {

    function LandingPage() {
        this.companyDetails      = element(by.id("companyDetails"));
        this.availableCredit     = element(by.id("availableCredit"));
        this.paymentDueDateLabel = element(by.id("paymentDueDateLabel"));
        this.paymentDueDate      = element(by.id("paymentDueDate"));
        this.currentBalanceLabel = element(by.id("currentBalanceLabel"));
        this.currentBalance      = element(by.id("currentBalance"));
        this.minimumPaymentLabel = element(by.id("minimumPaymentLabel"));
        this.minimumPayment      = element(by.id("minimumPayment"));
        this.makePaymentButton   = element(by.id("makePaymentButton"));
        this.viewActivityButton  = element(by.id("viewActivityButton"));
        this.cardsButton         = element(by.id("cardsButton"));
        this.driversButton       = element(by.id("driversButton"));
        this.sideMenuButton = TestUtils.findElementByXPathWithClass("//*[@nav-bar='active']//button", "button-menu");
        this.sideMenu = element(by.tagName("ion-side-menu"));
    }

    LandingPage.prototype.focus = function () {
        return browser.get("/#/landing");
    };

    LandingPage.prototype.clickSideMenuButton = function () {
        return this.sideMenuButton.click();
    };

    return LandingPage;
})();

module.exports = LandingPage;