import { browser, element, by, ElementFinder } from "protractor";
import { Page } from "../page.spec";

export class LoginPage extends Page<LoginPage> {

    public get loginButton(): ElementFinder {
        return element(by.id("form-actions"))
            .element(by.tagName("button"));
    }

    public get passwordField(): ElementFinder {
        return element(by.id("password-field"))
            .element(by.tagName("input"));
    }

    public get usernameField(): ElementFinder {
        return element(by.id("username-field"))
            .element(by.tagName("input"));
    }

    public init() {
        browser.get("/");
    }
}