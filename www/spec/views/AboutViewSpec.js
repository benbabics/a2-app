define(["Squire", "jasmine-jquery"],
    function (Squire) {

        "use strict";

        var squire = new Squire(),
            aboutView;

        describe("An About View", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/AboutView"],
                    function (AboutView) {
                        aboutView = new AboutView();

                        done();
                    });
            });

            it("is defined", function () {
                expect(aboutView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(aboutView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(aboutView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(aboutView.constructor).toEqual(jasmine.any(Function));
                });
            });

            describe("has an initialize function that", function () {
                it("is defined", function () {
                    expect(aboutView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(aboutView.initialize).toEqual(jasmine.any(Function));
                });
            });
        });
    });
