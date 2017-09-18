import { ModelGenerators } from "@angular-wex/models/mocks";
import { LoginPage } from "./login-page.spec";
import { Page } from "../page.spec";

describe("The Login Page login form", () => {

  let page: LoginPage;

  beforeEach(function () {
    page = Page.Init(LoginPage);
  });

  describe("when a username is entered", function () {

    beforeEach(function () {
      this.username = ModelGenerators.for<string>("Email");

      page.usernameField.sendKeys(this.username);
    });

    it("should recieve the text", function () {
      expect(page.fieldValue("usernameField")).toEqual(this.username);
    });
  });
});
