"use strict";

var PaymentAddPage = require("../../pages/paymentAdd.page.js");
var UserLoginPage = require("../../pages/userLogin.page.js");
var AuthenticateUserRequestSuccessMock = require("../../mocks/authenticateUserRequestSuccess.mock.js");
var FetchCurrentUserRequestSuccessMock = require("../../mocks/fetchCurrentUserRequestSuccess.mock.js");
var FetchCurrentInvoiceSummaryRequestSuccessMock = require("../../mocks/fetchCurrentInvoiceSummaryRequestSuccess.mock.js");
var FetchMakePaymentAvailabilityRequestSuccessBanksNotSetupMock = require("../../mocks/fetchMakePaymentAvailabilityRequestSuccessBanksNotSetup.mock.js");
var FetchMakePaymentAvailabilityRequestSuccessDirectDebitSetupMock = require("../../mocks/fetchMakePaymentAvailabilityRequestSuccessDirectDebitSetup.mock.js");
var FetchMakePaymentAvailabilityRequestSuccessNoErrorsMock = require("../../mocks/fetchMakePaymentAvailabilityRequestSuccessNoErrors.mock.js");

(function () {

    //TODO - Enable once browser.get("/#/payment/add") works
    xdescribe("A Payment Add page", function () {

        beforeAll(function () {
            browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestSuccessMock);
            browser.addMockModule("FetchCurrentUserMock", FetchCurrentUserRequestSuccessMock);
            browser.addMockModule("FetchCurrentInvoiceSummaryMock", FetchCurrentInvoiceSummaryRequestSuccessMock);

            // log in so we can get to the landing page
            new UserLoginPage().doLogin();
        });

        afterAll(function () {
            browser.removeMockModule("AuthenticateUserMock");
            browser.removeMockModule("FetchCurrentUserMock");
            browser.removeMockModule("FetchCurrentInvoiceSummaryMock");
        });

        describe("when bank accounts have NOT been setup", function () {
            beforeAll(function () {
                browser.addMockModule("FetchMakePaymentAvailabilityRequestSuccessMock", FetchMakePaymentAvailabilityRequestSuccessBanksNotSetupMock);

                this.page = new PaymentAddPage();
                browser.waitForAngular();
            });

            afterAll(function () {
                browser.removeMockModule("FetchMakePaymentAvailabilityRequestSuccessMock");
            });

            it("should NOT go to the payment add page", function () {
                expect(browser.getCurrentUrl()).not.toMatch("/#/payment/add");
            });

            //TODO - Test that a popup is displayed
        });

        describe("when direct debit has been setup", function () {
            beforeAll(function () {
                browser.addMockModule("FetchMakePaymentAvailabilityRequestSuccessMock", FetchMakePaymentAvailabilityRequestSuccessDirectDebitSetupMock);

                this.page = new PaymentAddPage();
                browser.waitForAngular();
            });

            afterAll(function () {
                browser.removeMockModule("FetchMakePaymentAvailabilityRequestSuccessMock");
            });

            it("should NOT go to the payment add page", function () {
                expect(browser.getCurrentUrl()).not.toMatch("/#/payment/add");
            });

            //TODO - Test that a popup is displayed
        });

        describe("when making a payment is available", function () {
            beforeAll(function () {
                browser.addMockModule("FetchMakePaymentAvailabilityRequestSuccessMock", FetchMakePaymentAvailabilityRequestSuccessNoErrorsMock);

                this.page = new PaymentAddPage();
                browser.waitForAngular();
            });

            afterAll(function () {
                browser.removeMockModule("FetchMakePaymentAvailabilityRequestSuccessMock");
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

    });

})();