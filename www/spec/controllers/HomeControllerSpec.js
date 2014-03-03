define(["utils", "Squire"],
    function (utils, Squire) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            mockHomeView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                pageCreate: function () { }
            },
            homeController;

        squire.mock("utils", mockUtils);
        squire.mock("views/HomeView", Squire.Helpers.returns(mockHomeView));

        describe("A Home Controller", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["controllers/HomeController"], function (HomeController) {
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
                        spyOn(mockHomeView, "constructor").andCallThrough();
                    });

                    it("should set the homeView variable to a new HomeView object", function () {
                        expect(homeController.homeView).toEqual(mockHomeView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockHomeView.constructor).toHaveBeenCalled();
                        expect(mockHomeView.constructor).toHaveBeenCalledWith();

                        // TODO: this is not working, need to figure out how to test
                    });
                });
            });

            describe("has a navigate function that", function () {
                beforeEach(function () {
                    spyOn(mockUtils, "changePage").andCallThrough();

                    homeController.navigate();
                });

                it("is defined", function () {
                    expect(homeController.navigate).toBeDefined();
                });

                it("is a function", function () {
                    expect(homeController.navigate).toEqual(jasmine.any(Function));
                });

                it("should change the page to the Login View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(1);
                    expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual(mockHomeView.$el);
                });
            });
        });
    });