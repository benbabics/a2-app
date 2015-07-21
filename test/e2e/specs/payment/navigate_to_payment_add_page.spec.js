"use strict";

var PaymentAddPage = require("../../pages/paymentAdd.page.js");
var UserLoginPage = require("../../pages/userLogin.page.js");
var AuthenticateUserRequestSuccessMock = require("../../mocks/authenticateUserRequestSuccess.mock.js");
var RetrieveCurrentUserRequestSuccessMock = require("../../mocks/retrieveCurrentUserRequestSuccess.mock.js");
var RetrieveCurrentInvoiceSummaryRequestSuccessMock = require("../../mocks/retrieveCurrentInvoiceSummaryRequestSuccess.mock.js");

(function () {

    //TODO - Enable once browser.get("/#/payment/add") works
    xdescribe("A Payment Add page", function () {

        beforeAll(function () {
            var loginPage;

            // Login a user so we can get to the landing page
            loginPage = new UserLoginPage();

            browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestSuccessMock);
            browser.addMockModule("RetrieveCurrentUserMock", RetrieveCurrentUserRequestSuccessMock);
            browser.addMockModule("RetrieveCurrentInvoiceSummaryMock", RetrieveCurrentInvoiceSummaryRequestSuccessMock);

            loginPage.doLogin();

            this.page = new PaymentAddPage();
        });

        afterAll(function () {
            browser.removeMockModule("AuthenticateUserMock");
            browser.removeMockModule("RetrieveCurrentUserMock");
            browser.removeMockModule("RetrieveCurrentInvoiceSummaryMock");
        });

        it("should have the correct URL", function () {
            expect(browser.getCurrentUrl()).toMatch("/#/payment/add");
        });

        it("should have a title", function() {
            expect(browser.getTitle()).toEqual("Make Payment");
        });

        it("should display the Invoice Number Label", function () {
            expect(this.page.invoiceNumberLabel.getText()).toMatch("Invoice Number");
        });

        it("should display the Invoice Number", function () {
            expect(this.page.invoiceNumber.getText()).toMatch("367367367376");
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

        it("should have a Submit button displayed", function () {
            expect(this.page.submitButton.getText()).toMatch("Next");
            expect(this.page.submitButton.isPresent()).toBeTruthy();
            expect(this.page.submitButton.isDisplayed()).toBeTruthy();
        });

    });

})();