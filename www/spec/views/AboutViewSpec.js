define(["Squire", "backbone", "mustache", "views/BaseView", "text!tmpl/about/page.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, BaseView, pageTemplate) {

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
        squire.mock("views/BaseView", BaseView);

        describe("An About View", function () {
            beforeEach(function (done) {
                squire.require(["views/AboutView"], function (AboutView) {
                    loadFixtures("../../../index.html");

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

            it("looks like a BaseView", function () {
                expect(aboutView instanceof BaseView).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(aboutView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(aboutView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(aboutView.el).toEqual("#about");
                });

                it("should set el nodeName", function () {
                    expect(aboutView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(aboutView.template).toEqual(pageTemplate);
                });
            });

            describe("has a pageCreate function that", function () {
                var actualContent;

                beforeEach(function () {
                    actualContent = aboutView.$el.find(".ui-content");
                    spyOn(aboutView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
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

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, appModel.toJSON());
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });
        });
    });
