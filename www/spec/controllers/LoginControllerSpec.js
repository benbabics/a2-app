define(["Squire"],
    function (Squire) {

        "use strict";

        var squire = new Squire(),
            mockLoginModel = {},
            mockLoginView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { }
            },
            loginController;

        squire.mock("views/LoginView", Squire.Helpers.constructs(mockLoginView));
        squire.mock("models/LoginModel", Squire.Helpers.constructs(mockLoginModel));

        describe("A Login Controller", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["controllers/LoginController"], function (LoginController) {
                    loginController = LoginController;

                    done();
                });
            });

            it("is defined", function () {
                expect(loginController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(loginController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                it("is defined", function () {
                    expect(loginController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginController.init).toEqual(jasmine.any(Function));
                });
            });
        });
    });