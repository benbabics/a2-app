"use strict";

var DriverLoginPage = require("../../pages/driverLogin.page.js");

(function () {
    describe("A Driver Login page", function () {

        beforeAll(function () {
            this.page = new DriverLoginPage();
        });

        it("should have the correct URL", function () {
            expect(browser.getCurrentUrl()).toMatch("/#/user/auth/login");
        });

        it("should have a title", function () {
            expect(browser.getTitle()).toEqual("WEX Fleet Manager");
        });
    });
})();