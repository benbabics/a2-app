import { browser, element, by, ElementFinder } from "protractor";
import { Page } from "../page.spec";

export class LoginPage extends Page<LoginPage> {

    constructor() {
        super();

        browser.get("/");
    }

    public get passwordField(): ElementFinder {
        return element(by.id("password-field"))
            .element(by.tagName("input"));
    }

    public get usernameField(): ElementFinder {
        return element(by.id("username-field"))
            .element(by.tagName("input"));
    }
}