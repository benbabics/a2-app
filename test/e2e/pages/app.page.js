"use strict";

var TestUtils = require("../testUtils.protractor.js");

var AppPage = (function () {

    function AppPage() {
        this.sideMenuButton              = TestUtils.findElementByXPathWithClass("//*[@nav-bar='active']//button", "ion-navicon-round");
        this.sideMenu                    = element(by.tagName("ion-side-menu"));
        this.sideMenuHome                = this.sideMenu.element(by.id("option-home"));
        this.sideMenuMakePayment         = this.sideMenu.element(by.id("option-add-payment"));
        this.sideMenuPaymentHistory      = this.sideMenu.element(by.id("option-payments"));
        this.sideMenuTransactionActivity = this.sideMenu.element(by.id("option-transaction-activity"));
        this.sideMenuCards               = this.sideMenu.element(by.id("option-cards"));
        this.sideMenuTerms               = this.sideMenu.element(by.id("option-terms"));
        this.sideMenuPrivacyPolicy       = this.sideMenu.element(by.id("option-privacy-policy"));
        this.sideMenuLogOut              = this.sideMenu.element(by.id("option-log-out"));
    }

    AppPage.prototype.clickSideMenuButton = function () {
        return this.sideMenuButton.click();
    };

    AppPage.prototype.clickSideMenuHome = function () {
        return this.sideMenuHome.click();
    };

    AppPage.prototype.clickSideMenuMakePayment = function () {
        return this.sideMenuMakePayment.click();
    };

    AppPage.prototype.clickSideMenuTransactionActivity = function () {
        return this.sideMenuTransactionActivity.click();
    };

    AppPage.prototype.clickSideMenuCards = function () {
        return this.sideMenuCards.click();
    };

    AppPage.prototype.clickSideMenuDrivers = function () {
        return this.sideMenuDrivers.click();
    };

    AppPage.prototype.clickSideMenuPaymentHistory = function () {
        return this.sideMenuPaymentHistory.click();
    };

    AppPage.prototype.clickSideMenuTerms = function () {
        return this.sideMenuTerms.click();
    };

    AppPage.prototype.clickSideMenuPrivacyPolicy = function () {
        return this.sideMenuPrivacyPolicy.click();
    };

    AppPage.prototype.clickSideMenuLogOut = function () {
        return this.sideMenuLogOut.click();
    };

    return AppPage;
})();

module.exports = AppPage;