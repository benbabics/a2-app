"use strict";

var AppPage = require("./app.page.js");

var UserLoginPage = (function () {

    function UserLoginPage() {
        AppPage.call(this);

        this.focus();

        this.userNameInput = element(by.css("form[name='vm.userLoginForm'] input[name='userName']"));
        this.passwordInput = element(by.css("form[name='vm.userLoginForm'] input[name='password']"));
        this.errorMessage = element(by.id("errorMessage"));
        this.submitButton = element(by.css("form[name='vm.userLoginForm'] button[type='submit']"));
    }

    UserLoginPage.prototype = Object.create(AppPage.prototype);

    UserLoginPage.prototype.focus = function () {
        return browser.get("/#/user/auth/login");
    };

    UserLoginPage.prototype.clearUserName = function () {
        return this.userNameInput.clear();
    };

    UserLoginPage.prototype.getUserName = function () {
        return this.userNameInput.getAttribute("value");
    };

    UserLoginPage.prototype.typeUserName = function (userName) {
        return this.userNameInput.sendKeys(userName);
    };

    UserLoginPage.prototype.focusUserName = function () {
        return this.typeUserName("");
    };

    UserLoginPage.prototype.clearPassword = function () {
        return this.passwordInput.clear();
    };

    UserLoginPage.prototype.getPassword = function () {
        return this.passwordInput.getAttribute("value");
    };

    UserLoginPage.prototype.typePassword = function (password) {
        return this.passwordInput.sendKeys(password);
    };

    UserLoginPage.prototype.focusPassword = function () {
        return this.typePassword("");
    };

    UserLoginPage.prototype.submit = function () {
        return this.submitButton.click();
    };

    UserLoginPage.prototype.doLogin = function () {
        this.focus();

        browser.refresh();

        //repopulate fields
        this.typeUserName("mockUserName");
        this.typePassword("mockPassword");

        this.submit();

        return browser.waitForAngular();
    };

    return UserLoginPage;
})();

module.exports = UserLoginPage;