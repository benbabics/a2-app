define(["backbone", "Squire", "jasmine-jquery"],
    function (Backbone, Squire) {
        "use strict";

        var squire = new Squire(),
            mockAppModel = {
                "buildVersion": "1.1.1"
            },
            appModel = new Backbone.Model(),
            appView;

        squire.mock("backbone", Backbone);

        describe("An App View", function () {
            var jasmineAsync = new AsyncSpec(this);

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            jasmineAsync.beforeEach(function(done) {
                squire.require(["views/AppView"], function(AppView) {
                    loadFixtures("index.html");

                    appModel.set(mockAppModel);

                    appView = new AppView({
                        model: appModel,
                        el   : document.body
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(appView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(appView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(appView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el nodeName", function () {
                    expect(appView.el.nodeName).toEqual("BODY");
                });

                it("should set model", function () {
                    expect(appView.model).toEqual(appModel);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(appView, "render").andCallThrough();

                    appView.initialize();
                });

                it("is defined", function () {
                    expect(appView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call render", function () {
                    expect(appView.render).toHaveBeenCalled();

                    expect(appView.render.mostRecentCall.args.length).toEqual(0);
                });
            });

            describe("has an render function that", function () {
                beforeEach(function () {
                    spyOn(appView.$el, "toggleClass").andCallFake(function () {});
                });

                it("is defined", function () {
                    expect(appView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.render).toEqual(jasmine.any(Function));
                });

                describe("when display is not passed", function () {
                    it("should call toggleClass on $el", function () {
                        appView.render();

                        expect(appView.$el.toggleClass).toHaveBeenCalled();

                        expect(appView.$el.toggleClass.mostRecentCall.args.length).toEqual(2);
                        expect(appView.$el.toggleClass.mostRecentCall.args[0]).toEqual("ui-hidden");
                        expect(appView.$el.toggleClass.mostRecentCall.args[1]).toBeFalsy();
                    });
                });

                describe("when false is passed", function () {
                    it("should call toggleClass on $el", function () {
                        appView.render(false);

                        expect(appView.$el.toggleClass).toHaveBeenCalled();

                        expect(appView.$el.toggleClass.mostRecentCall.args.length).toEqual(2);
                        expect(appView.$el.toggleClass.mostRecentCall.args[0]).toEqual("ui-hidden");
                        expect(appView.$el.toggleClass.mostRecentCall.args[1]).toBeFalsy();
                    });
                });

                describe("when true is passed", function () {
                    it("should call toggleClass on $el", function () {
                        appView.render(true);

                        expect(appView.$el.toggleClass).toHaveBeenCalled();

                        expect(appView.$el.toggleClass.mostRecentCall.args.length).toEqual(2);
                        expect(appView.$el.toggleClass.mostRecentCall.args[0]).toEqual("ui-hidden");
                        expect(appView.$el.toggleClass.mostRecentCall.args[1]).toBeTruthy();
                    });
                });
            });
        });
    });
