"use strict";

var PaymentAddPage = require("../../pages/paymentAdd.page.js");
var UserLoginPage = require("../../pages/userLogin.page.js");
var AuthenticateUserRequestSuccessMock = require("../../mocks/authenticateUserRequestSuccess.mock.js");
var RetrieveCurrentUserRequestSuccessMock = require("../../mocks/retrieveCurrentUserRequestSuccess.mock.js");
var RetrieveCurrentInvoiceSummaryRequestSuccessMock = require("../../mocks/retrieveCurrentInvoiceSummaryRequestSuccess.mock.js");

(function () {
    describe("A Side Menu", function () {

        beforeAll(function () {
            browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestSuccessMock);
            browser.addMockModule("RetrieveCurrentUserMock", RetrieveCurrentUserRequestSuccessMock);
            browser.addMockModule("RetrieveCurrentInvoiceSummaryMock", RetrieveCurrentInvoiceSummaryRequestSuccessMock);

            //log in so we can get to the landing page
            new UserLoginPage().doLogin();

            browser.waitForAngular();

            this.page = new PaymentAddPage();
        });

        afterAll(function () {
            browser.removeMockModule("AuthenticateUserMock");
            browser.removeMockModule("RetrieveCurrentUserMock");
            browser.removeMockModule("RetrieveCurrentInvoiceSummaryMock");
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