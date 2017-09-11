import { browser, element, by } from "protractor";

describe("protractor with typescript", () => {

  beforeEach(() => {
    browser.get("http://localhost:8100");
  });

  it("should work", () => {
    let passwordValue = "PASSWORD";

    element(by.id("password-field")).element(by.tagName("input")).sendKeys(passwordValue).then(() => {
      let password = element(by.id("password-field")).element(by.tagName("input"));
      expect(password.getAttribute("value")).toEqual(passwordValue);
    });
  });
});
