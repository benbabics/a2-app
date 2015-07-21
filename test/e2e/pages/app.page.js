"use strict";

var TestUtils = require("../testUtils.protractor.js");

var AppPage = (function () {

    function AppPage() {
        this.sideMenuButton      = TestUtils.findElementByXPathWithClass("//*[@nav-bar='active']//button", "button-menu");
        this.sideMenu            = element(by.tagName("ion-side-menu"));
        this.sideMenuHome        = this.sideMenu.element(by.className("option-home"));
    }

    AppPage.prototype.clickSideMenuButton = function () {
        return this.sideMenuButton.click();
    };

    AppPage.prototype.clickSideMenuHome = function () {
        return this.sideMenuHome.click();
    };

    return AppPage;
})();

module.exports = AppPage;