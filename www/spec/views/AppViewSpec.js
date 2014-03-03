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

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/AppView"], function (AppView) {
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

            describe("has events that", function () {
                it("should call handlePageBack when a data-rel=back is clicked", function () {
                    expect(appView.events["click [data-rel=back]"]).toEqual("handlePageBack");
                });
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

            describe("has a displayDialog function that", function () {
                it("is defined", function () {
                    expect(appView.displayDialog).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.displayDialog).toEqual(jasmine.any(Function));
                });

                //TODO - Much more
            });

            describe("has a highlightButton function that", function () {
                var mockButton = {
                    addClass : function () { return this; }
                };

                beforeEach(function () {
                    spyOn(mockButton, "addClass").andCallThrough();

                    appView.highlightButton(mockButton);
                });

                it("is defined", function () {
                    expect(appView.highlightButton).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.highlightButton).toEqual(jasmine.any(Function));
                });

                it("should call addClass on the button", function () {
                    expect(mockButton.addClass).toHaveBeenCalled();

                    expect(mockButton.addClass.mostRecentCall.args.length).toEqual(1);
                    expect(mockButton.addClass.mostRecentCall.args[0]).toEqual("ui-btn-active");
                });
            });

            describe("has a unhighlightButton function that", function () {
                var mockButton = {
                    addClass : function () { return this; },
                    attr : function () { return this; },
                    removeClass : function () { return this; }
                };

                beforeEach(function () {
                    spyOn(mockButton, "addClass").andCallThrough();
                    spyOn(mockButton, "attr").andCallThrough();
                    spyOn(mockButton, "removeClass").andCallThrough();

                    appView.unhighlightButton(mockButton);
                });

                it("is defined", function () {
                    expect(appView.unhighlightButton).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.unhighlightButton).toEqual(jasmine.any(Function));
                });

                it("should call removeClass on the button", function () {
                    expect(mockButton.removeClass).toHaveBeenCalled();

                    expect(mockButton.removeClass.mostRecentCall.args.length).toEqual(1);
                    expect(mockButton.removeClass.mostRecentCall.args[0]).toEqual("ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e");
                });

                it("should call addClass on the button", function () {
                    expect(mockButton.addClass).toHaveBeenCalled();

                    expect(mockButton.addClass.mostRecentCall.args.length).toEqual(1);
                    expect(mockButton.addClass.mostRecentCall.args[0]).toEqual("ui-btn-up-d");
                });

                it("should call attr on the button", function () {
                    expect(mockButton.attr).toHaveBeenCalled();

                    expect(mockButton.attr.mostRecentCall.args.length).toEqual(2);
                    expect(mockButton.attr.mostRecentCall.args[0]).toEqual("data-theme");
                    expect(mockButton.attr.mostRecentCall.args[1]).toEqual("d");
                });
            });

            describe("has a handlePageBack function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").andCallThrough();
                    spyOn(window.history, "back").andCallFake(function () {});

                    appView.handlePageBack(mockEvent);
                });

                it("is defined", function () {
                    expect(appView.handlePageBack).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.handlePageBack).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalled();
                });

                it("should call window.history.back", function () {
                    expect(window.history.back).toHaveBeenCalled();
                });
            });
        });
    });
