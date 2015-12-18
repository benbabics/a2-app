"use strict";

var LandingPage = require("../../pages/landing.page.js");
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

            this.page = new LandingPage();

            this.page.clickSideMenuButton();

            browser.waitForAngular();
        });

        afterAll(function () {
            browser.removeMockModule("AuthenticateUserMock");
            browser.removeMockModule("FetchCurrentUserMock");
            browser.removeMockModule("FetchCurrentInvoiceSummaryMock");
        });

        it("should have a 'Home' option", function() {
            expect(this.page.sideMenuHome.isPresent()).toBeTruthy();
            expect(this.page.sideMenuHome.getInnerHtml()).toMatch("Home");
        });

        it("should have a 'Make Payment' option", function() {
            expect(this.page.sideMenuMakePayment.isPresent()).toBeTruthy();
            expect(this.page.sideMenuMakePayment.getInnerHtml()).toMatch("Make Payment");
        });

        it("should have a 'Transaction Activity' option", function() {
            expect(this.page.sideMenuTransactionActivity.isPresent()).toBeTruthy();
            expect(this.page.sideMenuTransactionActivity.getInnerHtml()).toMatch("Transaction Activity");
        });

        it("should have a 'Cards' option", function() {
            expect(this.page.sideMenuCards.isPresent()).toBeTruthy();
            expect(this.page.sideMenuCards.getInnerHtml()).toMatch("Cards");
        });

        it("should have a 'Payment Activity' option", function() {
            expect(this.page.sideMenuPaymentHistory.isPresent()).toBeTruthy();
            expect(this.page.sideMenuPaymentHistory.getInnerHtml()).toMatch("Payment Activity");
        });

        it("should have a 'Terms and Policies' option", function() {
            expect(this.page.sideMenuTerms.isPresent()).toBeTruthy();
            expect(this.page.sideMenuTerms.getInnerHtml()).toMatch("Terms and Policies");
        });

        it("should have a 'Privacy Policy' option", function() {
            expect(this.page.sideMenuPrivacyPolicy.isPresent()).toBeTruthy();
            expect(this.page.sideMenuPrivacyPolicy.getInnerHtml()).toMatch("Privacy Policy");
        });

        it("should have a 'Log Out' option", function() {
            expect(this.page.sideMenuLogOut.isPresent()).toBeTruthy();
            expect(this.page.sideMenuLogOut.getInnerHtml()).toMatch("Log Out");
        });
    });

})();