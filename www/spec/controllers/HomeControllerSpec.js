define(["Squire"],
    function (Squire) {

        "use strict";

        var squire = new Squire(),
            homeController;

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
            });
        });
    });