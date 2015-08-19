"use strict";

var UserLoginPage = require("../../pages/userLogin.page.js");
var AuthenticateUserRequestSuccessMock = require("../../mocks/authenticateUserRequestSuccess.mock.js");
var AuthenticateUserRequestFailedBadCredentials = require("../../mocks/authenticateUserRequestFailedBadCredentials.mock.js");
var FetchCurrentUserRequestSuccessMock = require("../../mocks/fetchCurrentUserRequestSuccess.mock.js");
var FetchCurrentInvoiceSummaryRequestSuccessMock = require("../../mocks/fetchCurrentInvoiceSummaryRequestSuccess.mock.js");

(function () {
    var mockUserName = "mockUserName",
        mockPassword = "mockPassword";

    describe("A User Login page", function () {

        beforeAll(function () {
            this.page = new UserLoginPage();
        });

        describe("has a username field that", function() {

            describe("when it is empty", function() {

                beforeAll(function() {
                    this.page.clearUserName();
                });

                describe("when it is selected", function() {

                    beforeAll(function() {
                        this.page.focusUserName();
                    });

                    it("should have the expected placeholder text", function() {
                        expect(this.page.userNameInput.getAttribute("placeholder")).toEqual("Username");
                    });
                });

                describe("when it is NOT selected", function() {

                    beforeAll(function() {
                        this.page.focusPassword();
                    });

                    it("should have the expected placeholder text", function() {
                        expect(this.page.userNameInput.getAttribute("placeholder")).toEqual("Username");
                    });
                });
            });
        });

        describe("has a password field that", function() {

            describe("when it is empty", function() {

                beforeAll(function() {
                    this.page.clearPassword();
                });

                describe("when it is selected", function() {

                    beforeAll(function() {
                        this.page.focusPassword();
                    });

                    it("should have the expected placeholder text", function() {
                        expect(this.page.passwordInput.getAttribute("placeholder")).toEqual("Password");
                    });
                });

                describe("when it is NOT selected", function() {

                    beforeAll(function() {
                        this.page.focusUserName();
                    });

                    it("should have the expected placeholder text", function() {
                        expect(this.page.passwordInput.getAttribute("placeholder")).toEqual("Password");
                    });
                });
            });
        });

        describe("has a submit button that", function() {

            describe("when all required fields have been filled out", function() {

                beforeAll(function() {
                    this.page.typeUserName(mockUserName);
                    this.page.typePassword(mockPassword);
                });

                afterAll(function() {
                    this.page.clearUserName();
                    this.page.clearPassword();
                });

                it("should be enabled", function() {
                    expect(this.page.submitButton.getAttribute("ng-disabled")).toBe("false");
                });

                describe("when it is clicked", function () {

                    describe("when the user is successfully authenticated", function () {

                        beforeAll(function () {
                            browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestSuccessMock);
                            browser.addMockModule("FetchCurrentUserMock", FetchCurrentUserRequestSuccessMock);
                            browser.addMockModule("FetchCurrentInvoiceSummaryMock", FetchCurrentInvoiceSummaryRequestSuccessMock);

                            browser.refresh();

                            //repopulate fields
                            this.page.typeUserName(mockUserName);
                            this.page.typePassword(mockPassword);

                            this.page.submit();
                        });

                        afterAll(function () {
                            browser.removeMockModule("AuthenticateUserMock");
                            browser.removeMockModule("FetchCurrentUserMock");
                            browser.removeMockModule("FetchCurrentInvoiceSummaryMock");

                            browser.refresh();

                            //go back to login and repopulate fields
                            this.page.focus();
                            this.page.typeUserName(mockUserName);
                            this.page.typePassword(mockPassword);
                        });

                        it("should navigate the user to the landing page", function () {
                            expect(browser.getCurrentUrl()).toMatch("/#/landing");
                        });
                    });

                    describe("when the user is NOT successfully authenticated", function () {

                        beforeAll(function () {
                            browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestFailedBadCredentials);

                            browser.refresh();

                            //repopulate fields
                            this.page.typeUserName(mockUserName);
                            this.page.typePassword(mockPassword);
                        });

                        afterAll(function () {
                            browser.removeMockModule("AuthenticateUserMock");

                            browser.refresh();

                            //repopulate fields
                            this.page.typeUserName(mockUserName);
                            this.page.typePassword(mockPassword);
                        });

                        it("should stay on the login page", function () {
                            this.page.submit();

                            expect(browser.getCurrentUrl()).toMatch("/#/user/auth/login");
                        });
                    });
                });
            });

            describe("when all required fields have NOT been filled out", function() {

                beforeAll(function() {
                    this.page.clearUserName();
                    this.page.clearPassword();
                });

                it("should NOT be enabled", function() {
                    expect(this.page.submitButton.getAttribute("ng-disabled")).toBe("true");
                });
            });
        });
    });
})();