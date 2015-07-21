"use strict";

var LandingPage = require("../../pages/landing.page.js");
var UserLoginPage = require("../../pages/userLogin.page.js");
var AuthenticateUserRequestSuccessMock = require("../../mocks/authenticateUserRequestSuccess.mock.js");
var RetrieveCurrentUserRequestSuccessMock = require("../../mocks/retrieveCurrentUserRequestSuccess.mock.js");
var RetrieveCurrentInvoiceSummaryRequestSuccessMock = require("../../mocks/retrieveCurrentInvoiceSummaryRequestSuccess.mock.js");

(function () {
    describe("A Side Menu Button", function () {

        beforeAll(function () {
            browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestSuccessMock);
            browser.addMockModule("RetrieveCurrentUserMock", RetrieveCurrentUserRequestSuccessMock);
            browser.addMockModule("RetrieveCurrentInvoiceSummaryMock", RetrieveCurrentInvoiceSummaryRequestSuccessMock);

            //log in so we can get to the landing page
            new UserLoginPage().doLogin();

            browser.waitForAngular();

            this.page = new LandingPage();
        });

        afterAll(function () {
            browser.removeMockModule("AuthenticateUserMock");
            browser.removeMockModule("RetrieveCurrentUserMock");
            browser.removeMockModule("RetrieveCurrentInvoiceSummaryMock");
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