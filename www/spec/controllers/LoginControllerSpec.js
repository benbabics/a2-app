define(["utils", "Squire"],
    function (utils, Squire) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            mockLoginModel = {},
            mockUserModel = {
                reset: function () { },
                get: function () { },
                set: function () { }
            },
            UserModel = {
                getInstance: function () { }
            },
            mockLoginView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { }
            },
            loginController;

        squire.mock("utils", mockUtils);
        squire.mock("views/LoginView", Squire.Helpers.returns(mockLoginView));
        squire.mock("models/LoginModel", Squire.Helpers.returns(mockLoginModel));
        squire.mock("models/UserModel", UserModel);

        describe("A Login Controller", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["controllers/LoginController"], function (LoginController) {
                    spyOn(UserModel, "getInstance").andCallFake(function () { return mockUserModel; });

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

                describe("when initializing the LoginView", function () {
                    beforeEach(function () {
                        spyOn(mockLoginView, "constructor").andCallThrough();

                        loginController.init();
                    });

                    it("should set the loginView variable to a new LoginView object", function () {
                        expect(loginController.loginView).toEqual(mockLoginView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockLoginView.constructor).toHaveBeenCalled();
                        expect(mockLoginView.constructor).toHaveBeenCalledWith({
                            model: mockLoginModel,
                            el   : document.body
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                it("should register a function as the handler for the view loginSuccess event", function () {
                    spyOn(mockLoginView, "on").andCallFake(function () { });

                    loginController.init();

                    expect(mockLoginView.on).toHaveBeenCalled();
                    expect(mockLoginView.on.calls[0].args.length).toEqual(3);
                    expect(mockLoginView.on.calls[0].args[0]).toEqual("loginSuccess");
                    expect(mockLoginView.on.calls[0].args[1]).toEqual(loginController.setAuthentication);
                    expect(mockLoginView.on.calls[0].args[2]).toEqual(loginController);
                });

                it("should register a function as the handler for the view loginFailure event", function () {
                    spyOn(mockLoginView, "on").andCallFake(function () { });

                    loginController.init();

                    expect(mockLoginView.on).toHaveBeenCalled();
                    expect(mockLoginView.on.calls[1].args.length).toEqual(3);
                    expect(mockLoginView.on.calls[1].args[0]).toEqual("loginFailure");
                    expect(mockLoginView.on.calls[1].args[1]).toEqual(loginController.clearAuthentication);
                    expect(mockLoginView.on.calls[1].args[2]).toEqual(loginController);
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

                    expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(4);
                    expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual(mockLoginView.$el);
                    expect(mockUtils.changePage.mostRecentCall.args[1]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[2]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[3]).toBeTruthy();
                });
            });

            describe("has a setAuthentication function that", function () {
                it("is defined", function () {
                    expect(loginController.setAuthentication).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginController.setAuthentication).toEqual(jasmine.any(Function));
                });

                it("should set isAuthenticated to true", function () {
                    spyOn(mockUserModel, "set").andCallFake(function () { });

                    loginController.setAuthentication(null);

                    expect(mockUserModel.set).toHaveBeenCalled();
                    expect(mockUserModel.set.mostRecentCall.args.length).toEqual(2);
                    expect(mockUserModel.set.mostRecentCall.args[0]).toEqual("isAuthenticated");
                    expect(mockUserModel.set.mostRecentCall.args[1]).toBeTruthy();
                });
            });

            describe("has a clearAuthentication function that", function () {
                it("is defined", function () {
                    expect(loginController.clearAuthentication).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginController.clearAuthentication).toEqual(jasmine.any(Function));
                });

                it("should reset the User Model", function () {
                    spyOn(mockUserModel, "reset").andCallFake(function () { });

                    loginController.clearAuthentication();

                    expect(mockUserModel.reset).toHaveBeenCalledWith();
                });

            });
        });
    });