"use strict";

var UserLoginPage = require("../../pages/userLogin.page.js");
var AuthenticateUserRequestFailedBadCredentials = require("../../mocks/authenticateUserRequestFailedBadCredentials.mock.js");
var AuthenticateUserRequestFailedPasswordRequired = require("../../mocks/authenticateUserRequestFailedPasswordRequired.mock.js");
var AuthenticateUserRequestFailedUsernameRequiredMock = require("../../mocks/authenticateUserRequestFailedUsernameRequired.mock.js");

(function () {
    var mockUsername = "invalid@invalid.com",
        mockPassword = "0123456789012";

    describe("A User Login page", function () {
        beforeAll(function () {
            this.page = new UserLoginPage();
        });

        describe("When authentication fails with a Bad Credentials error", function () {
            beforeAll(function () {
                this.page.typeUserName(mockUsername);
                this.page.typePassword(mockPassword);

                // Set up HTTP Request/Response Mocks
                browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestFailedBadCredentials);

                this.page.submit();
            });

            afterAll(function () {
                this.page.clearUserName();
                this.page.clearPassword();

                // Remove HTTP Request/Response Mocks
                browser.removeMockModule("AuthenticateUserMock");
            });

            it("should have an error message", function () {
                expect(this.page.errorMessage.isPresent()).toBeTruthy();
                expect(this.page.errorMessage.isDisplayed()).toBeTruthy();
                expect(this.page.errorMessage.getText()).toMatch("Invalid login information. Please check your username and password or go online to set up or recover your username and password.");
            });

            it("should still have values in username and password", function () {
                expect(this.page.getUserName()).toMatch(mockUsername);
                expect(this.page.getPassword()).toMatch(mockPassword);
            });
        });

        describe("When authentication fails with a Password Required error", function () {
            beforeAll(function () {
                this.page.typeUserName(mockUsername);
                this.page.typePassword(mockPassword);

                // Set up HTTP Request/Response Mocks
                browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestFailedPasswordRequired);

                this.page.submit();
            });

            afterAll(function () {
                this.page.clearUserName();
                this.page.clearPassword();

                // Remove HTTP Request/Response Mocks
                browser.removeMockModule("AuthenticateUserMock");
            });

            it("should have an error message", function () {
                expect(this.page.errorMessage.isPresent()).toBeTruthy();
                expect(this.page.errorMessage.isDisplayed()).toBeTruthy();
                expect(this.page.errorMessage.getText()).toMatch("Invalid login information. Please check your username and password or go online to set up or recover your username and password.");
            });

            it("should still have values in username and password", function () {
                expect(this.page.getUserName()).toMatch(mockUsername);
                expect(this.page.getPassword()).toMatch(mockPassword);
            });
        });

        describe("When authentication fails with a Username Required error", function () {
            beforeAll(function () {
                this.page.typeUserName(mockUsername);
                this.page.typePassword(mockPassword);

                // Set up HTTP Request/Response Mocks
                browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestFailedUsernameRequiredMock);

                this.page.submit();
            });

            afterAll(function () {
                this.page.clearUserName();
                this.page.clearPassword();

                // Remove HTTP Request/Response Mocks
                browser.removeMockModule("AuthenticateUserMock");
            });

            it("should have an error message", function () {
                expect(this.page.errorMessage.isPresent()).toBeTruthy();
                expect(this.page.errorMessage.isDisplayed()).toBeTruthy();
                expect(this.page.errorMessage.getText()).toMatch("Invalid login information. Please check your username and password or go online to set up or recover your username and password.");
            });

            it("should still have values in username and password", function () {
                expect(this.page.getUserName()).toMatch(mockUsername);
                expect(this.page.getPassword()).toMatch(mockPassword);
            });
        });
    });
})();