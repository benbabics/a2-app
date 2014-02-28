define(["Squire", "mustache", "globals", "utils", "text!tmpl/contactUs/page.html", "jasmine-jquery"],
    function (Squire, Mustache, globals, utils, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockContactUsModel = {
                "email": "JoeUser@gmail.com",
                "subject": "Other",
                "message": "This is a message"
            },
            contactUsModel = new Backbone.Model(),
            contactUsView,
            ContactUsView;

        squire.mock("mustache", mockMustache);

        describe("A Contact Us View", function () {
            var jasmineAsync = new AsyncSpec(this);

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/ContactUsView"], function (JasmineContactUsView) {
                    loadFixtures("index.html");

                    contactUsModel.set(mockContactUsModel);

                    ContactUsView = JasmineContactUsView;
                    contactUsView = new ContactUsView({
                        model: contactUsModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(contactUsView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(contactUsView instanceof Backbone.View).toBeTruthy();
            });

            describe("has events that", function () {
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(contactUsView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(contactUsView.el).toBe("#contactUs");
                });

                it("should set el nodeName", function () {
                    expect(contactUsView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(contactUsView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(ContactUsView.__super__, "initialize").andCallFake(function () {});
                    contactUsView.initialize();
                });

                it("is defined", function () {
                    expect(contactUsView.pageCreate).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsView.pageCreate).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(ContactUsView.__super__.initialize).toHaveBeenCalledWith();
                });
            });

            describe("has a pageCreate function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "render").andCallThrough();
                    contactUsView.initialize();
                });

                it("is defined", function () {
                    expect(contactUsView.pageCreate).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsView.pageCreate).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalled();
                    expect(mockMustache.render.mostRecentCall.args.length).toEqual(1);
                    expect(mockMustache.render.mostRecentCall.args[0]).toEqual(contactUsView.template);
                });

                it("sets content", function () {
                    var expectedContent,
                        actualContent = contactUsView.$el.find(":jqmData(role=content)");

                    expectedContent = Mustache.render(pageTemplate);

                    expect(actualContent[0]).toContainHtml(expectedContent);
                });
            });
        });
    });
