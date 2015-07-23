"use strict";

var TestUtils = require("../testUtils.protractor.js");

var AppPage = (function () {

    function AppPage() {
        this.sideMenuButton         = TestUtils.findElementByXPathWithClass("//*[@nav-bar='active']//button", "button-menu");
        this.sideMenu               = element(by.tagName("ion-side-menu"));
        this.sideMenuHome           = this.sideMenu.element(by.id("option-home"));
        this.sideMenuMakePayment    = this.sideMenu.element(by.id("option-make-payment"));
        this.sideMenuViewActivity   = this.sideMenu.element(by.id("option-view-activity"));
        this.sideMenuCards          = this.sideMenu.element(by.id("option-cards"));
        this.sideMenuDrivers        = this.sideMenu.element(by.id("option-drivers"));
        this.sideMenuPaymentHistory = this.sideMenu.element(by.id("option-payment-history"));
        this.sideMenuContactUs      = this.sideMenu.element(by.id("option-contact-us"));
        this.sideMenuLogOut         = this.sideMenu.element(by.id("option-log-out"));
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

    AppPage.prototype.clickSideMenuViewActivity = function () {
        return this.sideMenuViewActivity.click();
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

    AppPage.prototype.clickSideMenuContactUs = function () {
        return this.sideMenuContactUs.click();
    };

    AppPage.prototype.clickSideMenuLogOut = function () {
        return this.sideMenuLogOut.click();
    };

    return AppPage;
})();

module.exports = AppPage;