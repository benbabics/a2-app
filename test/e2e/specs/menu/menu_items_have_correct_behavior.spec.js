"use strict";

var PaymentAddPage = require("../../pages/paymentAdd.page.js");
var UserLoginPage = require("../../pages/userLogin.page.js");
var AuthenticateUserRequestSuccessMock = require("../../mocks/authenticateUserRequestSuccess.mock.js");
var FetchCurrentUserRequestSuccessMock = require("../../mocks/fetchCurrentUserRequestSuccess.mock.js");
var FetchCurrentInvoiceSummaryRequestSuccessMock = require("../../mocks/fetchCurrentInvoiceSummaryRequestSuccess.mock.js");

(function () {
    describe("A Side Menu", function () {

        beforeAll(function () {
            browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestSuccessMock);
            browser.addMockModule("FetchCurrentUserMock", FetchCurrentUserRequestSuccessMock);
            browser.addMockModule("FetchCurrentInvoiceSummaryMock", FetchCurrentInvoiceSummaryRequestSuccessMock);

            //log in so we can get to the landing page
            new UserLoginPage().doLogin();

            browser.waitForAngular();

            this.page = new PaymentAddPage();
        });

        afterAll(function () {
            browser.removeMockModule("AuthenticateUserMock");
            browser.removeMockModule("FetchCurrentUserMock");
            browser.removeMockModule("FetchCurrentInvoiceSummaryMock");
        });

        //TODO - The login validator/redirection handler is interfering with these tests.
        //Reinstate this test when it has been fixed
        xdescribe("when the 'Home' option is clicked", function () {

            beforeAll(function () {
                this.page.clickSideMenuButton();

                browser.waitForAngular();

                this.page.clickSideMenuHome();
            });

            it("should redirect to the landing page", function () {
                expect(browser.getCurrentUrl()).toMatch("/#/landing");
            });
        });
    });

})();