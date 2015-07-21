"use strict";

var LandingPage = require("../../pages/landing.page.js");
var UserLoginPage = require("../../pages/userLogin.page.js");
var AuthenticateUserRequestSuccessMock = require("../../mocks/authenticateUserRequestSuccess.mock.js");
var FetchCurrentUserRequestSuccessMock = require("../../mocks/fetchCurrentUserRequestSuccess.mock.js");
var FetchCurrentInvoiceSummaryRequestSuccessMock = require("../../mocks/fetchCurrentInvoiceSummaryRequestSuccess.mock.js");

(function () {
    describe("A Side Menu Button", function () {

        beforeAll(function () {
            browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestSuccessMock);
            browser.addMockModule("FetchCurrentUserMock", FetchCurrentUserRequestSuccessMock);
            browser.addMockModule("FetchCurrentInvoiceSummaryMock", FetchCurrentInvoiceSummaryRequestSuccessMock);

            //log in so we can get to the landing page
            new UserLoginPage().doLogin();

            browser.waitForAngular();

            this.page = new LandingPage();
        });

        afterAll(function () {
            browser.removeMockModule("AuthenticateUserMock");
            browser.removeMockModule("FetchCurrentUserMock");
            browser.removeMockModule("FetchCurrentInvoiceSummaryMock");
        });

        describe("when it is clicked and the menu is NOT present", function () {

            beforeAll(function () {
                this.page.clickSideMenuButton();

                browser.waitForAngular();
            });

            it("should show the side menu", function () {
                expect(this.page.sideMenu.isPresent()).toBeTruthy();
                expect(this.page.sideMenu.isDisplayed()).toBeTruthy();
            });
        });

        //TODO - Ionic side menu element always reports itself as displayed, even when it's not.
        //Figure out another way to test this.
        xdescribe("when it is clicked and the menu is present", function () {

            beforeAll(function () {
                this.page.clickSideMenuButton();

                browser.waitForAngular();
            });

            it("should hide the side menu", function () {
                expect(this.page.sideMenu.isDisplayed()).toBeFalsy();
            });
        });
    });

})();