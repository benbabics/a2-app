"use strict";

var PaymentAddPage = require("../../pages/paymentAdd.page.js");
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
                //use the add payment page for this test
                this.page = new PaymentAddPage();

                this.page.clickSideMenuButton();

                browser.waitForAngular();

                this.page.clickSideMenuHome();
            });

            it("should redirect to the landing page", function () {
                expect(browser.getCurrentUrl()).toMatch("/#/landing");
            });

            //TODO - Ionic side menu element always reports itself as displayed, even when it's not.
            //Figure out another way to test this.
            xit("should hide the side menu", function () {
                expect(this.page.sideMenu.isDisplayed()).toBeFalsy();
            });
        });

        xdescribe("when the 'Make Payment' option is clicked", function () {

            beforeAll(function () {
                //use the landing page for this test
                this.page = new LandingPage();

                this.page.clickSideMenuButton();

                browser.waitForAngular();

                this.page.clickSideMenuMakePayment();
            });

            it("should redirect to the Make Payment page", function () {
                expect(browser.getCurrentUrl()).toMatch("/#/payment/add");
            });

            //TODO - Ionic side menu element always reports itself as displayed, even when it's not.
            //Figure out another way to test this.
            xit("should hide the side menu", function () {
                expect(this.page.sideMenu.isDisplayed()).toBeFalsy();
            });
        });
    });

})();