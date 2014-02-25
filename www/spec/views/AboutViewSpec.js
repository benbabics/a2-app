define(["Squire", "backbone", "mustache", "text!tmpl/about/page.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockBackbone = Backbone,
            mockMustache = Mustache,
            mockAppModel = {
                "buildVersion"   : "Mock Build Version",
                "platform"       : "Mock Platform",
                "platformVersion": "Mock Platform Version"
            },
            appModel = new Backbone.Model(),
            aboutView;

        squire.mock("backbone", mockBackbone);
        squire.mock("mustache", mockMustache);

        describe("An About View", function () {
            var jasmineAsync = new AsyncSpec(this);

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/AboutView"],
                    function (AboutView) {
                        loadFixtures("index.html");

                        appModel.set(mockAppModel);

                        aboutView =  new AboutView({
                            model: appModel
                        });

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

                it("should set el", function () {
                    expect(aboutView.el).toBe("#about");
                });

                it("should set el nodeName", function () {
                    expect(aboutView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(aboutView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").andCallThrough();
                    spyOn(aboutView, "pageCreate").andCallFake(function () { });
                    aboutView.initialize();
                });

                it("is defined", function () {
                    expect(aboutView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(aboutView.initialize).toEqual(jasmine.any(Function));
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(aboutView.template);
                });

                it("should call pageCreate()", function () {
                    expect(aboutView.pageCreate).toHaveBeenCalledWith();
                });
            });

            describe("has a pageCreate function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "render").andCallThrough();
                    aboutView.initialize();
                });

                it("is defined", function () {
                    expect(aboutView.pageCreate).toBeDefined();
                });

                it("is a function", function () {
                    expect(aboutView.pageCreate).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(aboutView.template, aboutView.model.toJSON());
                });

                it("sets content", function () {
                    var expectedContent = Mustache.render(pageTemplate, appModel.toJSON()),
                        $content = aboutView.$el.find(":jqmData(role=content)");

                    expect($content[0]).toContainHtml(expectedContent);
                });
            });
        });
    });
