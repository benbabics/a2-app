"use strict";

var UserLoginPage = require("../../pages/userLogin.page.js");

(function () {
    describe("A User Login page", function () {

        beforeAll(function () {
            this.page = new UserLoginPage();
        });

        it("should have the correct URL", function () {
            expect(browser.getCurrentUrl()).toMatch("/#/user/auth/login");
        });

        it("should have a title", function () {
            expect(browser.getTitle()).toEqual("Fleet SmartHub");
        });
    });
})();