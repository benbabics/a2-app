import { ModelGenerators } from "@angular-wex/models/mocks";
import { LoginPage } from "./login-page.spec";
import { Page } from "../page.spec";
import { TestUtils } from "../../test-utils";

describe("The Login Page login form", () => {
    let page: LoginPage;

    beforeEach(function () {
        page = Page.init(LoginPage);
    });

    describe("when entered", function () {

        it("should have a disabled login button", function () {
            expect(page.loginButton.isEnabled()).toBe(false);
        });
    });

    describe("when entering credentials", TestUtils.testTemplate(["username", "password"], function (username: string, password: string) {
    
        describe(`when username is ${username ? username : "not entered"} and password is ${password ? password : "not entered"}`, function () {

            beforeEach(function () {
                page.init();

                if (username) {
                    page.usernameField.sendKeys(username);
                }

                if (password) {
                    page.passwordField.sendKeys(password);
                }
            });

            it("should receive the text", function () {
                if (username) {
                    page.usernameField.click();
                    expect(page.fieldValue("usernameField")).toEqual(username);
                }

                if (password) {
                    page.passwordField.click();
                    expect(page.fieldValue("passwordField")).toEqual(password);
                }
            });

            // TODO - Tests for adding asterisks to end of usernames

            if (username && password) {
                it("should enable the login button", function () {
                    expect(page.loginButton.isEnabled()).toBe(true);
                });
            }
            else {
                it("should disable the login button", function () {
                    expect(page.loginButton.isEnabled()).toBe(false);
                });
            }

            // TODO - Tests for pressing the login button
        });
    }, { }, {
        username: ModelGenerators.for<string>("Email")
    },
    {
        password: ModelGenerators.for<string>(String, 15)
    },
    {
        username: ModelGenerators.for<string>("Email"),
        password: ModelGenerators.for<string>(String, 15)
    }));
});
