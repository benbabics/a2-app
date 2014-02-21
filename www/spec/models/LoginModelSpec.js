define(["Squire"],
    function (Squire) {

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
