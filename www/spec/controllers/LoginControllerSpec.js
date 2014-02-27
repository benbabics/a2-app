define(["utils", "Squire"],
    function (utils, Squire) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            mockLoginModel = {},
            mockLoginView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { }
            },
            loginController;

        squire.mock("utils", mockUtils);
        squire.mock("views/LoginView", Squire.Helpers.returns(mockLoginView));
        squire.mock("models/LoginModel", Squire.Helpers.returns(mockLoginModel));

        describe("A Login Controller", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["controllers/LoginController"], function (LoginController) {
                    loginController = LoginController;
                    loginController.init();

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

                it("should set the loginModel variable to a new LoginModel object", function () {
                    expect(loginController.getLoginModel()).not.toBeNull();
                    expect(loginController.getLoginModel()).toEqual(mockLoginModel);
                });

                it("should set the loginView variable to a new LoginView object", function () {
                    expect(loginController.getLoginView()).not.toBeNull();
                    expect(loginController.getLoginView()).toEqual(mockLoginView);
                });
            });

            describe("has a navigate function that", function () {
                beforeEach(function () {
                    spyOn(mockUtils, "changePage").andCallThrough();

                    loginController.navigate();
                });

                it("is defined", function () {
                    expect(loginController.navigate).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginController.navigate).toEqual(jasmine.any(Function));
                });

                it("should change the page to the Login View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(1);
                    expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual(mockLoginView.$el);
                });
            });
        });
    });