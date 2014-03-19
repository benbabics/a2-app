define(["backbone", "utils", "Squire"],
    function (Backbone, utils, Squire) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            mockUserModel = { },
            userModel = new Backbone.Model(),
            UserModel = {
                getInstance: function () { }
            },
            mockHomeView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { }
            },
            homeController;

        squire.mock("backbone", Backbone);
        squire.mock("utils", mockUtils);
        squire.mock("views/HomeView", Squire.Helpers.returns(mockHomeView));

        describe("A Home Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/HomeController"], function (HomeController) {
                    userModel.set(mockUserModel);
                    spyOn(UserModel, "getInstance").and.callFake(function () { return userModel; });

                    homeController = HomeController;
                    homeController.init();

                    done();
                });
            });

            it("is defined", function () {
                expect(homeController).toBeDefined();
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

                describe("when initializing the HomeView", function () {
                    beforeEach(function () {
                        spyOn(mockHomeView, "constructor").and.callThrough();
                    });

                    it("should set the homeView variable to a new HomeView object", function () {
                        expect(homeController.homeView).toEqual(mockHomeView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockHomeView.constructor).toHaveBeenCalled();
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
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.calls.mostRecent().args.length).toEqual(4);
                    expect(mockUtils.changePage.calls.mostRecent().args[0]).toEqual(mockHomeView.$el);
                    expect(mockUtils.changePage.calls.mostRecent().args[1]).toBeNull();
                    expect(mockUtils.changePage.calls.mostRecent().args[2]).toBeNull();
                    expect(mockUtils.changePage.calls.mostRecent().args[3]).toBeTruthy();
                });
            });
        });
    });