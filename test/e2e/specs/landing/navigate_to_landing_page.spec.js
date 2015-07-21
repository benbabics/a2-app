"use strict";

var LandingPage = require("../../pages/landing.page.js");
var UserLoginPage = require("../../pages/userLogin.page.js");
var AuthenticateUserRequestSuccessMock = require("../../mocks/authenticateUserRequestSuccess.mock.js");
var FetchCurrentUserRequestSuccessMock = require("../../mocks/fetchCurrentUserRequestSuccess.mock.js");
var FetchCurrentInvoiceSummaryRequestSuccessMock = require("../../mocks/fetchCurrentInvoiceSummaryRequestSuccess.mock.js");

(function () {

    describe("A Landing page", function () {

        beforeAll(function () {
            var loginPage;

            // Login a user so we can get to the landing page
            loginPage = new UserLoginPage();

            browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestSuccessMock);
            browser.addMockModule("FetchCurrentUserMock", FetchCurrentUserRequestSuccessMock);
            browser.addMockModule("FetchCurrentInvoiceSummaryMock", FetchCurrentInvoiceSummaryRequestSuccessMock);

            loginPage.doLogin();

            this.page = new LandingPage();
        });

        afterAll(function () {
            browser.removeMockModule("AuthenticateUserMock");
            browser.removeMockModule("FetchCurrentUserMock");
            browser.removeMockModule("FetchCurrentInvoiceSummaryMock");
        });

        it("should have the correct URL", function () {
            expect(browser.getCurrentUrl()).toMatch("/#/landing");
        });

        it("should have a title", function() {
            expect(browser.getTitle()).toEqual("WEX Fleet Manager");
        });

        it("should display the Company Name", function () {
            expect(this.page.companyDetails.getText()).toContain("billingCompanyName");
        });

        it("should display the Company Account Number", function () {
            expect(this.page.companyDetails.getText()).toContain("billingCompanyAccountNumber");
        });

        it("should display the Available Credit", function () {
            expect(this.page.availableCredit.getText()).toContain("$350.29");
        });

        it("should display the Available Credit Label", function () {
            expect(this.page.availableCredit.getText()).toContain("Available");
        });

        it("should display the Payment Due Date Label", function () {
            expect(this.page.paymentDueDateLabel.getText()).toMatch("Payment Due Date");
        });

        it("should display the Payment Due Date", function () {
            expect(this.page.paymentDueDate.getText()).toMatch("7/31/2015");
        });

        it("should display the Current Balance Label", function () {
            expect(this.page.currentBalanceLabel.getText()).toMatch("Current Balance");
        });

        it("should display the Current Balance", function () {
            expect(this.page.currentBalance.getText()).toContain("$9,649.71");
        });

        it("should display the Minimum Payment Label", function () {
            expect(this.page.minimumPaymentLabel.getText()).toMatch("Minimum Payment");
        });

        it("should display the Minimum Payment", function () {
            expect(this.page.minimumPayment.getText()).toContain("$200.00");
        });

        it("should have a Make Payment button displayed", function () {
            expect(this.page.makePaymentButton.getText()).toMatch("MAKE PAYMENT");
            expect(this.page.makePaymentButton.isPresent()).toBeTruthy();
            expect(this.page.makePaymentButton.isDisplayed()).toBeTruthy();
        });

        it("should have a View Activity button displayed", function () {
            expect(this.page.viewActivityButton.getText()).toMatch("View Activity");
            expect(this.page.viewActivityButton.isPresent()).toBeTruthy();
            expect(this.page.viewActivityButton.isDisplayed()).toBeTruthy();
        });

        it("should have a Cards button displayed", function () {
            expect(this.page.cardsButton.getText()).toMatch("Cards");
            expect(this.page.cardsButton.isPresent()).toBeTruthy();
            expect(this.page.cardsButton.isDisplayed()).toBeTruthy();
        });

        it("should have a Drivers button displayed", function () {
            expect(this.page.driversButton.getText()).toMatch("Drivers");
            expect(this.page.driversButton.isPresent()).toBeTruthy();
            expect(this.page.driversButton.isDisplayed()).toBeTruthy();
        });
    });

})();