define(["backbone", "utils", "globals", "mustache", "text!tmpl/updateprompt/page.html", "Squire", "jasmine-jquery", "jasmine-sinon", "RequestMatchers"],
    function (Backbone, utils, globals, Mustache, pageTemplate, Squire) {
        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockBackbone = Backbone,
            mockAppModel = {
                "buildVersion"   : "1.1.2",
                "platform"       : "Android",
                "platformVersion": "4.4.2"
            },
            appModel = new Backbone.Model(),
            AppModel = {
                getInstance: function () { }
            },
            mockFailTemplateContent = {
                title: globals.UPDATE_APP.TITLE,
                message: globals.UPDATE_APP.FAIL_MESSAGE,
                primaryBtnLabel: globals.UPDATE_APP.PRIMARY_BTN_LABEL,
                secondaryBtnLabel: null
            },
            mockWarnTemplateContent = {
                title: globals.UPDATE_APP.TITLE,
                message: globals.UPDATE_APP.WARN_MESSAGE,
                primaryBtnLabel: globals.UPDATE_APP.PRIMARY_BTN_LABEL,
                secondaryBtnLabel: globals.UPDATE_APP.SECONDARY_BTN_LABEL
            },
            mockFacade = {
                publish: function (channel, event) { }
            },
            updatePromptView;

        squire.mock("backbone", mockBackbone);
        squire.mock("facade", mockFacade);
        squire.mock("mustache", mockMustache);
        squire.mock("models/AppModel", AppModel);

        describe("A UpdatePrompt View", function () {
            var jasmineAsync = new AsyncSpec(this);

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/UpdatePromptView"], function (UpdatePromptView) {
                    loadFixtures("index.html");

                    appModel.set(mockAppModel);
                    spyOn(AppModel, "getInstance").andCallFake(function () { return appModel; });

                    updatePromptView = new UpdatePromptView();

                    done();
                });
            });

            it("is defined", function () {
                expect(updatePromptView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(updatePromptView instanceof Backbone.View).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call handleUpdateClick when a updatePromptPrimary is clicked", function () {
                    expect(updatePromptView.events["click .updatePromptPrimary"]).toEqual("handleUpdateClick");
                });

                it("should call handleUpdateDismiss when a updatePromptSecondary is clicked", function () {
                    expect(updatePromptView.events["click .updatePromptSecondary"]).toEqual("handleUpdateDismiss");
                });
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(updatePromptView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set the template", function () {
                    expect(updatePromptView.template).toEqual(pageTemplate);
                });

                describe("when initializing the AppModel", function () {
                    it("should set the appModel variable to the AppModel instance", function () {
                        expect(updatePromptView.appModel).toEqual(appModel);
                    });
                });
            });

            describe("has a render function that", function () {
                it("is defined", function () {
                    expect(updatePromptView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptView.render).toEqual(jasmine.any(Function));
                });

                describe("when rendering", function () {
                    beforeEach(function () {
                        spyOn(updatePromptView.$content, "trigger").andCallFake(function () { });
                        spyOn(mockMustache, "render").andCallThrough();

                        updatePromptView.templateContent = mockFailTemplateContent;

                        updatePromptView.render();
                    });

                    it("sets content", function () {
                        var expectedContent = Mustache.render(pageTemplate, updatePromptView.templateContent);

                        expect(updatePromptView.$content[0]).toContainHtml(expectedContent);
                    });

                    it("should call Mustache.render() on the template", function () {
                        expect(mockMustache.render).toHaveBeenCalledWith(updatePromptView.template, updatePromptView.templateContent);
                    });

                    it("should contain the title", function () {
                        expect(updatePromptView.$content[0]).toContainHtml(mockFailTemplateContent.title);
                    });

                    it("should contain the message", function () {
                        expect(updatePromptView.$content[0]).toContainHtml(mockFailTemplateContent.message);
                    });

                    it("should have a properly labeled primary action button", function () {
                        expect(updatePromptView.$content[0]).toContainHtml(mockFailTemplateContent.primaryBtnLabel);
                    });

                    it("calls the trigger function on updatePromptView.$content", function () {
                        expect(updatePromptView.$content.trigger).toHaveBeenCalled();
                        expect(updatePromptView.$content.trigger.mostRecentCall.args.length).toEqual(1);
                        expect(updatePromptView.$content.trigger.mostRecentCall.args[0]).toEqual("create");
                    });
                });
            });

            describe("has a renderFail function that", function () {
                beforeEach(function () {
                    spyOn(updatePromptView, "render");
                    updatePromptView.renderFail();
                });

                it("is defined", function () {
                    expect(updatePromptView.renderFail).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptView.renderFail).toEqual(jasmine.any(Function));
                });

                it("sets the template content", function () {
                    expect(updatePromptView.templateContent).toEqual(mockFailTemplateContent);
                });

                it("calls the render function", function () {
                    expect(updatePromptView.render).toHaveBeenCalled();
                    expect(updatePromptView.render.mostRecentCall.args.length).toEqual(0);
                });
            });

            describe("has a renderWarn function that", function () {
                beforeEach(function () {
                    spyOn(updatePromptView, "render");
                    updatePromptView.renderWarn();
                });

                it("is defined", function () {
                    expect(updatePromptView.renderWarn).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptView.renderWarn).toEqual(jasmine.any(Function));
                });

                it("sets the template content", function () {
                    expect(updatePromptView.templateContent).toEqual(mockWarnTemplateContent);
                });

                it("calls the render function", function () {
                    expect(updatePromptView.render).toHaveBeenCalled();
                    expect(updatePromptView.render.mostRecentCall.args.length).toEqual(0);
                });
            });

            describe("has a handleUpdateClick function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").andCallThrough();
                    spyOn(window, "open").andCallFake(function () {});
                    updatePromptView.handleUpdateClick(mockEvent);
                });

                it("is defined", function () {
                    expect(updatePromptView.handleUpdateClick).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptView.handleUpdateClick).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalled();
                });

                it("should call window.open", function () {
                    expect(window.open).toHaveBeenCalled();

                    expect(window.open.mostRecentCall.args.length).toEqual(2);
                    expect(window.open.mostRecentCall.args[0]).toEqual(globals.UPDATE_APP.URL);
                    expect(window.open.mostRecentCall.args[1]).toEqual("_self");
                });
            });

            describe("has a handleUpdateDismiss function that", function () {
                beforeEach(function () {
                    spyOn(appModel, "set").andCallThrough();
                    spyOn(appModel, "save").andCallFake(function () {});
                    spyOn(mockFacade, "publish").andCallFake(function () {});
                    updatePromptView.handleUpdateDismiss();
                });

                it("is defined", function () {
                    expect(updatePromptView.handleUpdateDismiss).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptView.handleUpdateDismiss).toEqual(jasmine.any(Function));
                });

                it("should call appModel.set", function () {
                    expect(appModel.set).toHaveBeenCalled();

                    expect(appModel.set.mostRecentCall.args.length).toEqual(2);
                    expect(appModel.set.mostRecentCall.args[0]).toEqual("lastWarnVersion");
                    expect(appModel.set.mostRecentCall.args[1]).toEqual(mockAppModel.buildVersion);
                });

                it("should call appModel.save", function () {
                    expect(appModel.save).toHaveBeenCalled();
                    expect(appModel.save.mostRecentCall.args.length).toEqual(0);
                });

                it("should call the publish function on facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.mostRecentCall.args.length).toEqual(2);

                    // First parameter is the channel landing
                    expect(mockFacade.publish.mostRecentCall.args[0]).toEqual("login");

                    // Second parameter is the navigate event
                    expect(mockFacade.publish.mostRecentCall.args[1]).toEqual("navigate");
                });
            });
        });
    });
