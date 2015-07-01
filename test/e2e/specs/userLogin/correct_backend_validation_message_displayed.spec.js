"use strict";

var UserLoginPage = require("../../pages/userLogin.page.js");
var AuthenticateUserRequestFailedBadCredentials = require("../../mocks/authenticateUserRequestFailedBadCredentials.mock.js");
var AuthenticateUserRequestFailedPasswordRequired = require("../../mocks/authenticateUserRequestFailedPasswordRequired.mock.js");
var AuthenticateUserRequestFailedUsernameRequiredMock = require("../../mocks/authenticateUserRequestFailedUsernameRequired.mock.js");
var AuthenticateUserRequestFailedUserLockedMock = require("../../mocks/authenticateUserRequestFailedUserLocked.mock.js");

(function () {
    var mockUsername = "username1",
        mockPassword = "Password1";

    describe("A User Login page", function () {
        describe("When authentication fails with a Bad Credentials error", function () {
            beforeAll(function () {
                // Set up HTTP Request/Response Mocks
                browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestFailedBadCredentials);

                this.page = new UserLoginPage();

                this.page.typeUserName(mockUsername);
                this.page.typePassword(mockPassword);

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
                // Set up HTTP Request/Response Mocks
                browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestFailedPasswordRequired);

                this.page = new UserLoginPage();

                this.page.typeUserName(mockUsername);
                this.page.typePassword(mockPassword);

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
                // Set up HTTP Request/Response Mocks
                browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestFailedUsernameRequiredMock);

                this.page = new UserLoginPage();

                this.page.typeUserName(mockUsername);
                this.page.typePassword(mockPassword);

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

        describe("When authentication fails with a User Locked error", function () {
            beforeAll(function () {
                // Set up HTTP Request/Response Mocks
                browser.addMockModule("AuthenticateUserMock", AuthenticateUserRequestFailedUserLockedMock);

                this.page = new UserLoginPage();

                this.page.typeUserName(mockUsername);
                this.page.typePassword(mockPassword);

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
                expect(this.page.errorMessage.getText()).toMatch("You have exceeded the number of allowable login attempts. You will need to access your online account to retrieve your username and password.");
            });

            it("should still have values in username and password", function () {
                expect(this.page.getUserName()).toMatch(mockUsername);
                expect(this.page.getPassword()).toMatch(mockPassword);
            });
        });
    });
})();