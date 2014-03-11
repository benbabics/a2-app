define(["Squire", "backbone", "mustache", "globals", "utils", "text!tmpl/contactUs/page.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockFacade = {
                publish: function () { }
            },
            mockUserModel = {
                "authenticated": "true",
                "email": "mobiledevelopment@wexinc.com"
            },
            userModel = new Backbone.Model(),
            UserModel = {
                getInstance: function () { }
            },
            mockContactUsModel = {
                "email": "JoeUser@gmail.com",
                "subject": "Other",
                "message": "This is a message"
            },
            contactUsModel = new Backbone.Model(),
            contactUsView,
            ContactUsView;

        squire.mock("mustache", mockMustache);
        squire.mock("backbone", Backbone);
        squire.mock("facade", mockFacade);

        describe("A Contact Us View", function () {
            var jasmineAsync = new AsyncSpec(this);

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/ContactUsView"], function (JasmineContactUsView) {
                    loadFixtures("index.html");

                    contactUsModel.set(mockContactUsModel);
                    userModel.set(mockUserModel);

                    ContactUsView = JasmineContactUsView;
                    contactUsView = new ContactUsView({
                        model: contactUsModel,
                        userModel: userModel
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
                it("should call submitForm when submitContactUs-btn is clicked", function () {
                    expect(contactUsView.events["click #submitContactUs-btn"]).toEqual("submitForm");
                });

                it("should call submitForm when contactUsForm is submitted", function () {
                    expect(contactUsView.events["submit #contactUsForm"]).toEqual("submitForm");
                });
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
                    spyOn(mockMustache, "parse").andCallThrough();
                    spyOn(ContactUsView.__super__, "initialize").andCallFake(function () {});

                    contactUsView.initialize();
                });

                it("is defined", function () {
                    expect(contactUsView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(ContactUsView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(contactUsView.template);
                });

                it("should set userModel", function () {
                    expect(contactUsView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                var expectedConfiguration;

                beforeEach(function () {
                    expectedConfiguration = utils._.extend({}, utils.deepClone(globals.contactUs.configuration));
                    expectedConfiguration.sender.value = mockUserModel.email;
                    expectedConfiguration.authenticated = mockUserModel.authenticated;

                    spyOn(mockMustache, "render").andCallThrough();
                    spyOn(contactUsView, "getConfiguration").andCallFake(function() { return expectedConfiguration; });
                    spyOn(contactUsView, "formatRequiredFields").andCallThrough();

                    contactUsView.render();
                });

                it("is defined", function () {
                    expect(contactUsView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsView.render).toEqual(jasmine.any(Function));
                });

                it("should call getConfiguration()", function () {
                    expect(contactUsView.formatRequiredFields).toHaveBeenCalledWith();
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalled();
                    expect(mockMustache.render.mostRecentCall.args.length).toEqual(2);
                    expect(mockMustache.render.mostRecentCall.args[0]).toEqual(contactUsView.template);
                    expect(mockMustache.render.mostRecentCall.args[1]).toEqual(expectedConfiguration);
                });

                it("should set the content", function () {
                    var $content = contactUsView.$el.find(":jqmData(role=content)"),
                        expectedContent = Mustache.render(pageTemplate, expectedConfiguration);

                    expect($content[0]).toContainHtml(expectedContent);
                });

                it("should call formatRequiredFields()", function () {
                    expect(contactUsView.formatRequiredFields).toHaveBeenCalledWith();
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(contactUsView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsView.getConfiguration).toEqual(jasmine.any(Function));
                });

                it("should return the expected result", function () {
                    var expectedConfiguration,
                        actualConfiguration;

                    expectedConfiguration = utils._.extend({}, utils.deepClone(globals.contactUs.configuration));
                    expectedConfiguration.sender.value = mockUserModel.email;
                    expectedConfiguration.authenticated = mockUserModel.authenticated;

                    actualConfiguration = contactUsView.getConfiguration();

                    expect(actualConfiguration).toEqual(expectedConfiguration);
                });
            });

            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").andCallThrough();
                    spyOn(contactUsModel, "save").andCallFake(function () { });
                    contactUsView.submitForm(mockEvent);
                });

                it("is defined", function () {
                    expect(contactUsView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                describe("when calling save() on the model", function () {
                    it("should send the model as the first argument", function () {
                        expect(contactUsModel.save).toHaveBeenCalled();
                        expect(contactUsModel.save.mostRecentCall.args.length).toEqual(2);
                        expect(contactUsModel.save.mostRecentCall.args[0]).toEqual(contactUsModel.toJSON());
                    });

                    describe("sends as the second argument the options object with a success callback that", function () {
                        var response = {},
                            model,
                            options;

                        beforeEach(function () {
                            spyOn(contactUsView, "trigger").andCallFake(function () { });

                            options = contactUsModel.save.mostRecentCall.args[1];
                            options.success.call(contactUsView, model, response);
                        });

                        it("should trigger contactUsSuccess", function () {
                            expect(contactUsView.trigger).toHaveBeenCalled();
                            expect(contactUsView.trigger.mostRecentCall.args.length).toEqual(2);
                            expect(contactUsView.trigger.mostRecentCall.args[0]).toEqual("contactUsSuccess");
                            expect(contactUsView.trigger.mostRecentCall.args[1]).toEqual(response);
                        });
                    });

                    describe("sends as the second argument the options object with a error callback that", function () {
                        beforeEach(function () {
                            var options = contactUsModel.save.mostRecentCall.args[1];

                            spyOn(contactUsView, "trigger").andCallFake(function () { });

                            options.error.call(contactUsView);
                        });

                        it("should trigger contactUsFailure", function () {
                            expect(contactUsView.trigger).toHaveBeenCalled();
                            expect(contactUsView.trigger.mostRecentCall.args.length).toEqual(1);
                            expect(contactUsView.trigger.mostRecentCall.args[0]).toEqual("contactUsFailure");
                        });
                    });
                });
            });
        });
    });
