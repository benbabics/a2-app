"use strict";

var DriverLoginPage = require("../../pages/driverLogin.page.js");

(function () {
    var mockUserName = "mockUserName",
        mockPassword = "mockPassword";

    describe("A Driver Login page", function () {

        beforeAll(function () {
            this.page = new DriverLoginPage();
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

                    it("should have no placeholder text", function() {
                        expect(this.page.userNameInput.getAttribute("placeholder")).toBeFalsy();
                    });
                });

                describe("when it is NOT selected", function() {

                    beforeAll(function() {
                        this.page.focusPassword();
                    });

                    it("should have the expected placeholder text", function() {
                        expect(this.page.userNameInput.getAttribute("placeholder")).toEqual("User Name");
                    });
                });
            });

            //TODO - getAttribute("placeholder") captures placeholder text whether it is displayed or not
            // Find out way to capture only visible placeholder text and verify based on that
            xdescribe("when it is NOT empty", function() {

                beforeAll(function() {
                    this.page.typeUserName(mockUserName);
                });

                afterAll(function() {
                    this.page.clearUserName();
                });

                describe("when it is selected", function() {

                    beforeAll(function() {
                        this.page.focusUserName();
                    });

                    it("should have no placeholder text", function() {
                        expect(this.page.userNameInput.getAttribute("placeholder")).toBeFalsy();
                    });
                });

                describe("when it is NOT selected", function() {

                    beforeAll(function() {
                        this.page.focusPassword();
                    });

                    it("should have no placeholder text", function() {
                        expect(this.page.userNameInput.getAttribute("placeholder")).toBeFalsy();
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

                    it("should have no placeholder text", function() {
                        expect(this.page.passwordInput.getAttribute("placeholder")).toBeFalsy();
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

            //TODO - getAttribute("placeholder") captures placeholder text whether it is displayed or not
            // Find out way to capture only visible placeholder text and verify based on that
            xdescribe("when it is NOT empty", function() {

                beforeAll(function() {
                    this.page.typePassword(mockPassword);
                });

                afterAll(function() {
                    this.page.clearPassword();
                });

                describe("when it is selected", function() {

                    beforeAll(function() {
                        this.page.focusPassword();
                    });

                    it("should have no placeholder text", function() {
                        expect(this.page.passwordInput.getAttribute("placeholder")).toBeFalsy();
                    });
                });

                describe("when it is NOT selected", function() {

                    beforeAll(function() {
                        this.page.focusUserName();
                    });

                    it("should have no placeholder text", function() {
                        expect(this.page.passwordInput.getAttribute("placeholder")).toBeFalsy();
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