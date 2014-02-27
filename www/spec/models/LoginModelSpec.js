define(["Squire", "globals"],
    function (Squire, globals) {

        "use strict";

        var squire = new Squire(),
            loginModel;

        describe("A Login Model", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["models/LoginModel"], function (LoginModel) {
                    loginModel = new LoginModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(loginModel).toBeDefined();
            });

            it("looks like a Backbone model", function () {
                expect(loginModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set username to default", function () {
                    expect(loginModel.defaults.username).toBeNull();
                });

                it("should set password to default", function () {
                    expect(loginModel.defaults.password).toBeNull();
                });
            });

            describe("has property validation that", function () {
                describe("has a validation configuration for the username field that", function () {
                    it("should set the field as required", function () {
                        expect(loginModel.validation.username.required).toBeTruthy();
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(loginModel.validation.username.msg).toEqual(globals.login.constants.ERROR_USERNAME_REQUIRED_FIELD);
                    });
                });

                describe("has a validation configuration for the password field that", function () {
                    it("should set the field as required", function () {
                        expect(loginModel.validation.password.required).toBeTruthy();
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(loginModel.validation.password.msg).toEqual(globals.login.constants.ERROR_PASSWORD_REQUIRED_FIELD);
                    });
                });
            });

            describe("has an initialize function that", function () {
                it("is defined", function () {
                    expect(loginModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginModel.initialize).toEqual(jasmine.any(Function));
                });
            });
        });
    });
