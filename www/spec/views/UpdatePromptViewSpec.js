define(["backbone", "utils", "globals", "mustache", "views/BaseView", "text!tmpl/updatePrompt/page.html", "Squire",
        "jasmine-jquery"],
    function (Backbone, utils, globals, Mustache, BaseView, pageTemplate, Squire) {
        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockBackbone = Backbone,
            mockUtils = utils,
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
                publish: function () { }
            },
            UpdatePromptView,
            updatePromptView;

        squire.mock("backbone", mockBackbone);
        squire.mock("facade", mockFacade);
        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("models/AppModel", AppModel);
        squire.mock("views/BaseView", BaseView);

        describe("A UpdatePrompt View", function () {
            beforeEach(function (done) {
                squire.require(["views/UpdatePromptView"], function (JasmineUpdatePromptView) {
                    loadFixtures("../../../index.html");

                    UpdatePromptView = JasmineUpdatePromptView;

                    appModel.set(mockAppModel);
                    spyOn(AppModel, "getInstance").and.callFake(function () { return appModel; });

                    updatePromptView = new UpdatePromptView();

                    done();
                });
            });

            it("is defined", function () {
                expect(updatePromptView).toBeDefined();
            });

            it("looks like a BaseView", function () {
                expect(updatePromptView instanceof BaseView).toBeTruthy();
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
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(UpdatePromptView.__super__, "initialize").and.callFake(function () {});
                    spyOn(mockUtils._, "bindAll").and.callFake(function () { });

                    updatePromptView.initialize();
                });

                it("is defined", function () {
                    expect(updatePromptView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(UpdatePromptView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should call utils._.bindAll", function () {
                    expect(mockUtils._.bindAll)
                        .toHaveBeenCalledWith(updatePromptView, "handleUpdateDismiss", "handleUpdateClick");
                });

                it("should set the appModel variable to the AppModel instance", function () {
                    expect(updatePromptView.appModel).toEqual(appModel);
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
                    var actualContent;

                    beforeEach(function () {
                        actualContent = updatePromptView.$el.find(":jqmData(role=content)");
                        spyOn(updatePromptView.$el, "find").and.returnValue(actualContent);
                        spyOn(actualContent, "html").and.callThrough();
                        spyOn(actualContent, "trigger").and.callThrough();
                        spyOn(mockMustache, "render").and.callThrough();

                        updatePromptView.templateContent = mockFailTemplateContent;
                        updatePromptView.render();
                    });

                    it("should call the html function on the content", function () {
                        var expectedContent = Mustache.render(pageTemplate, updatePromptView.templateContent);
                        expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                    });

                    it("should call Mustache.render() on the template", function () {
                        expect(mockMustache.render).toHaveBeenCalledWith(updatePromptView.template,
                            updatePromptView.templateContent);
                    });

                    it("should call the html function on the content", function () {
                        var expectedContent = Mustache.render(pageTemplate, updatePromptView.templateContent);
                        expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                    });

                    it("should contain the title", function () {
                        expect(actualContent[0]).toContainHtml(mockFailTemplateContent.title);
                    });

                    it("should contain the message", function () {
                        expect(actualContent[0]).toContainHtml(mockFailTemplateContent.message);
                    });

                    it("should have a properly labeled primary action button", function () {
                        expect(actualContent[0]).toContainHtml(mockFailTemplateContent.primaryBtnLabel);
                    });

                    it("calls the trigger function on the content", function () {
                        expect(actualContent.trigger).toHaveBeenCalledWith("create");
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
                    expect(updatePromptView.render.calls.mostRecent().args.length).toEqual(0);
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
                    expect(updatePromptView.render.calls.mostRecent().args.length).toEqual(0);
                });
            });

            describe("has a handleUpdateClick function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(window, "open").and.callFake(function () {});
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

                    expect(window.open.calls.mostRecent().args.length).toEqual(2);
                    expect(window.open.calls.mostRecent().args[0]).toEqual(globals.UPDATE_APP.URL);
                    expect(window.open.calls.mostRecent().args[1]).toEqual("_self");
                });
            });

            describe("has a handleUpdateDismiss function that", function () {
                beforeEach(function () {
                    spyOn(appModel, "set").and.callThrough();
                    spyOn(appModel, "save").and.callFake(function () {});
                    spyOn(mockFacade, "publish").and.callFake(function () {});
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

                    expect(appModel.set.calls.mostRecent().args.length).toEqual(2);
                    expect(appModel.set.calls.mostRecent().args[0]).toEqual("lastWarnVersion");
                    expect(appModel.set.calls.mostRecent().args[1]).toEqual(mockAppModel.buildVersion);
                });

                it("should call appModel.save", function () {
                    expect(appModel.save).toHaveBeenCalled();
                    expect(appModel.save.calls.mostRecent().args.length).toEqual(0);
                });

                it("should call the publish function on facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(2);

                    // First parameter is the channel landing
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("login");

                    // Second parameter is the navigate event
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("navigate");
                });
            });
        });
    });
