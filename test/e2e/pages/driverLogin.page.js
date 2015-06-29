"use strict";

var DriverLoginPage = (function () {

    function DriverLoginPage() {
        this.focus();

        this.userNameInput = element(by.css("form[name='vm.userLoginForm'] input[name='userName']"));
        this.passwordInput = element(by.css("form[name='vm.userLoginForm'] input[name='password']"));
        this.submitButton = element(by.css("form[name='vm.userLoginForm'] button[type='submit']"));
    }

    DriverLoginPage.prototype.focus = function () {
        return browser.get("/#/user/auth/login");
    };

    DriverLoginPage.prototype.clearUserName = function () {
        return this.userNameInput.clear();
    };

    DriverLoginPage.prototype.typeUserName = function (userName) {
        return this.userNameInput.sendKeys(userName);
    };

    DriverLoginPage.prototype.focusUserName = function () {
        return this.typeUserName("");
    };

    DriverLoginPage.prototype.clearPassword = function () {
        return this.passwordInput.clear();
    };

    DriverLoginPage.prototype.typePassword = function (password) {
        return this.passwordInput.sendKeys(password);
    };

    DriverLoginPage.prototype.focusPassword = function () {
        return this.typePassword("");
    };

    DriverLoginPage.prototype.submit = function () {
        return this.submitButton.click();
    };

    return DriverLoginPage;
})();

module.exports = DriverLoginPage;