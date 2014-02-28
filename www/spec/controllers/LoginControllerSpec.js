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

                describe("when initializing the LoginView", function () {
                    beforeEach(function () {
                        spyOn(mockLoginView, "constructor").andCallThrough();
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
        });
    });