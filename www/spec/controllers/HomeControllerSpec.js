define(["backbone", "utils", "Squire", "controllers/BaseController"],
    function (Backbone, utils, Squire, BaseController) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function () { }
            },
            mockUtils = utils,
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                hasMultipleAccounts: false,
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "3673683",
                    wexAccountNumber: "5764309"
                }
            },
            userModel = new Backbone.Model(),
            UserModel = {
                getInstance: function () { return userModel; }
            },
            mockHomeView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { }
            },
            homeController;

        squire.mock("backbone", Backbone);
        squire.mock("facade", mockFacade);
        squire.mock("utils", mockUtils);
        squire.mock("controllers/BaseController", BaseController);
        squire.mock("models/UserModel", UserModel);
        squire.mock("views/HomeView", Squire.Helpers.returns(mockHomeView));

        describe("A Home Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/HomeController"], function (HomeController) {
                    userModel.set(mockUserModel);

                    homeController = HomeController;
                    homeController.init();

                    done();
                });
            });

            it("is defined", function () {
                expect(homeController).toBeDefined();
            });

            it("looks like a BaseController", function () {
                expect(homeController instanceof BaseController).toBeTruthy();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(homeController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(homeController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                it("is defined", function () {
                    expect(homeController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(homeController.init).toEqual(jasmine.any(Function));
                });

                it("should set the userModel variable to a UserModel object", function () {
                    expect(homeController.userModel).toEqual(userModel);
                });

                describe("when initializing the HomeView", function () {
                    beforeEach(function () {
                        spyOn(mockHomeView, "constructor").and.callThrough();
                    });

                    it("should set the homeView variable to a new HomeView object", function () {
                        expect(homeController.homeView).toEqual(mockHomeView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockHomeView.constructor).toHaveBeenCalledWith({
                            model: userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });
            });

            describe("has a navigate function that", function () {
                beforeEach(function () {
                    spyOn(mockHomeView, "render").and.callThrough();
                    spyOn(mockUtils, "changePage").and.callThrough();

                    homeController.navigate();
                });

                it("is defined", function () {
                    expect(homeController.navigate).toBeDefined();
                });

                it("is a function", function () {
                    expect(homeController.navigate).toEqual(jasmine.any(Function));
                });

                it("should call render on the Home View", function () {
                    expect(mockHomeView.render).toHaveBeenCalledWith();
                });

                it("should change the page to the Home View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalledWith(mockHomeView.$el, null, null, true);
                });
            });

            describe("has a beforeNavigateCondition function that", function () {
                it("is defined", function () {
                    expect(homeController.beforeNavigateCondition).toBeDefined();
                });

                it("is a function", function () {
                    expect(homeController.beforeNavigateCondition).toEqual(jasmine.any(Function));
                });

                describe("when the user has a selected company", function () {
                    var actualReturnValue;

                    beforeEach(function () {
                        spyOn(mockFacade, "publish").and.callThrough();

                        actualReturnValue = homeController.beforeNavigateCondition();
                    });

                    it("should call NOT publish on the facade", function () {
                        expect(mockFacade.publish).not.toHaveBeenCalled();
                    });

                    it("should return true", function () {
                        expect(actualReturnValue).toBeTruthy();
                    });
                });

                describe("when the user does NOT have a selected company", function () {
                    var actualReturnValue;

                    beforeEach(function () {
                        userModel.set("selectedCompany", null);
                        spyOn(mockFacade, "publish").and.callThrough();

                        actualReturnValue = homeController.beforeNavigateCondition();
                    });

                    it("should call publish on the facade", function () {
                        expect(mockFacade.publish).toHaveBeenCalledWith("hierarchy", "navigate");
                    });

                    it("should return false", function () {
                        expect(actualReturnValue).toBeFalsy();
                    });
                });
            });
        });
    });