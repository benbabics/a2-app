define(["Squire", "mustache", "globals", "utils", "text!tmpl/home/page.html", "jasmine-jquery"],
    function (Squire, Mustache, globals, utils, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            homeView,
            HomeView;

        squire.mock("mustache", mockMustache);

        describe("A Home View", function () {
            var jasmineAsync = new AsyncSpec(this);

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/HomeView"], function (JasmineHomeView) {
                    loadFixtures("index.html");

                    HomeView = JasmineHomeView;
                    homeView = new HomeView();

                    done();
                });
            });

            it("is defined", function () {
                expect(homeView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(homeView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(homeView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(homeView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(homeView.el).toBe("#home");
                });

                it("should set el nodeName", function () {
                    expect(homeView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(homeView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").andCallThrough();
                    spyOn(homeView, "pageCreate").andCallFake(function () { });

                    homeView.initialize();
                });

                it("is defined", function () {
                    expect(homeView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(homeView.initialize).toEqual(jasmine.any(Function));
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(homeView.template);
                });

                it("should call pageCreate()", function () {
                    expect(homeView.pageCreate).toHaveBeenCalledWith();
                });
            });

            describe("has a pageCreate function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "render").andCallThrough();

                    homeView.initialize(); // initialize calls pageCreate
                });

                it("is defined", function () {
                    expect(homeView.pageCreate).toBeDefined();
                });

                it("is a function", function () {
                    expect(homeView.pageCreate).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalled();
                    expect(mockMustache.render.mostRecentCall.args.length).toEqual(1);
                    expect(mockMustache.render.mostRecentCall.args[0]).toEqual(homeView.template);
                });

                it("sets content", function () {
                    var expectedContent,
                        actualContent = homeView.$el.find(":jqmData(role=content)");

                    expectedContent = Mustache.render(pageTemplate);

                    expect(actualContent[0]).toContainHtml(expectedContent);
                });
            });
        });
    });
