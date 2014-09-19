define(["backbone", "mustache", "utils", "Squire", "globals", "text!tmpl/common/jqueryDialog.html", "jasmine-jquery"],
    function (Backbone, Mustache, utils, Squire, globals, dialogTemplate) {
        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockUtils = utils,
            mockFacade = {
                publish: function () { }
            },
            mockAppModel = {
                "buildVersion": "1.1.1"
            },
            appModel = new Backbone.Model(),
            appView;

        squire.mock("backbone", Backbone);
        squire.mock("facade", mockFacade);
        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);

        describe("An App View", function () {
            beforeEach(function (done) {
                squire.require(["views/AppView"], function (AppView) {
                    loadFixtures("../../../index.html");

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

                it("should call handleLogout when a data-rel=logout is clicked", function () {
                    expect(appView.events["click [data-rel=logout]"]).toEqual("handleLogout");
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
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(appView, "render").and.callThrough();
                    spyOn(appView, "setupBackboneLoadingIndicators").and.callFake(function () {});

                    appView.initialize();
                });

                it("is defined", function () {
                    expect(appView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.initialize).toEqual(jasmine.any(Function));
                });

                it("should parse the dialogTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(appView.dialogTemplate);
                });

                it("should call render", function () {
                    expect(appView.render).toHaveBeenCalledWith();
                });

                it("should call setupBackboneLoadingIndicators", function () {
                    expect(appView.setupBackboneLoadingIndicators).toHaveBeenCalledWith();
                });
            });

            describe("has an render function that", function () {
                beforeEach(function () {
                    spyOn(appView.$el, "toggleClass").and.callFake(function () {});
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

                        expect(appView.$el.toggleClass).toHaveBeenCalledWith("ui-hidden", false);
                    });
                });

                describe("when false is passed", function () {
                    it("should call toggleClass on $el", function () {
                        appView.render(false);

                        expect(appView.$el.toggleClass).toHaveBeenCalledWith("ui-hidden", false);
                    });
                });

                describe("when true is passed", function () {
                    it("should call toggleClass on $el", function () {
                        appView.render(true);

                        expect(appView.$el.toggleClass).toHaveBeenCalledWith("ui-hidden", true);
                    });
                });
            });

            describe("has a setupBackboneLoadingIndicators function that", function () {
                it("is defined", function () {
                    expect(appView.setupBackboneLoadingIndicators).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.setupBackboneLoadingIndicators).toEqual(jasmine.any(Function));
                });

                // setupBackboneLoadingIndicators defines showLoadingIndicator and hideLoadingIndicator functions
                // and those functions are tested below so there's not much else to do here unless we can figure out
                // how to test that the functions were added to all Backbone views
            });

            describe("has a showLoadingIndicator function that", function () {
                it("is defined", function () {
                    expect(appView.showLoadingIndicator).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.showLoadingIndicator).toEqual(jasmine.any(Function));
                });

                describe("when checking that the view is the active page", function () {
                    describe("when NOT the active page", function () {
                        beforeEach(function () {
                            spyOn(appView.$el, "is").and.returnValue(false);
                            spyOn(mockUtils.$.mobile, "loading");
                            appView.showLoadingIndicator(true);
                        });

                        it("should NOT call the loading function on utils.$.mobile", function () {
                            expect(mockUtils.$.mobile.loading).not.toHaveBeenCalled();
                        });
                    });

                    describe("when the active page", function () {
                        beforeEach(function () {
                            spyOn(appView.$el, "is").and.returnValue(true);
                            spyOn(mockUtils.$.mobile, "loading");
                            appView.showLoadingIndicator(true);
                        });

                        it("should call the loading function on utils.$.mobile", function () {
                            expect(mockUtils.$.mobile.loading).toHaveBeenCalledWith("show");
                        });
                    });
                });

                describe("when not checking that the view is the active page", function () {
                    beforeEach(function () {
                        spyOn(mockUtils.$.mobile, "loading").and.callFake(function () {});
                        appView.showLoadingIndicator(false);
                    });

                    it("should call the loading function on utils.$.mobile", function () {
                        expect(mockUtils.$.mobile.loading).toHaveBeenCalledWith("show");
                    });
                });
            });

            describe("has a hideLoadingIndicator function that", function () {
                it("is defined", function () {
                    expect(appView.hideLoadingIndicator).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.hideLoadingIndicator).toEqual(jasmine.any(Function));
                });

                describe("when checking that the view is the active page", function () {
                    describe("when NOT the active page", function () {
                        beforeEach(function () {
                            spyOn(appView.$el, "is").and.returnValue(false);
                            spyOn(mockUtils.$.mobile, "loading");
                            appView.hideLoadingIndicator(true);
                        });

                        it("should NOT call the loading function on utils.$.mobile", function () {
                            expect(mockUtils.$.mobile.loading).not.toHaveBeenCalled();
                        });
                    });

                    describe("when the active page", function () {
                        beforeEach(function () {
                            spyOn(appView.$el, "is").and.returnValue(true);
                            spyOn(mockUtils.$.mobile, "loading");
                            appView.hideLoadingIndicator(true);
                        });

                        it("should call the loading function on utils.$.mobile", function () {
                            expect(mockUtils.$.mobile.loading).toHaveBeenCalledWith("hide");
                        });
                    });
                });

                describe("when not checking that the view is the active page", function () {
                    beforeEach(function () {
                        spyOn(mockUtils.$.mobile, "loading").and.callFake(function () {});
                        appView.hideLoadingIndicator(false);
                    });

                    it("should call the loading function on utils.$.mobile", function () {
                        expect(mockUtils.$.mobile.loading).toHaveBeenCalledWith("hide");
                    });
                });
            });

            describe("has a displayDialog function that", function () {
                var dialogOptions = {
                        title: "Title",
                        message: "Message",
                        primaryBtnLabel: "Primary Button Label",
                        primaryBtnHandler: function () {},
                        secondaryBtnLabel: "Secondary Button Label",
                        secondaryBtnHandler: function () {},
                        tertiaryBtnLabel: "Tertiary Button Label",
                        tertiaryBtnHandler: function () {},
                        popupbeforeposition: function () {},
                        popupafteropen: function () {},
                        popupafterclose: function () {},
                        highlightButton: "highlightButtonId",
                        unhighlightButton: "unhighlightButtonId"
                    },
                    mockPopup = {
                        bind: function () { },
                    },
                    mockHeader = {
                        css: function () { return "Mock Value"; }
                    },
                    mockContent = {
                        append: function () { }
                    },
                    mockDialog = {
                        find : function () { },
                        popup: function () { return mockPopup; },
                        trigger : function () { }
                    },
                    mockPrimaryButton = {
                        on: function () { }
                    },
                    mockSecondaryButton = {
                        on: function () { }
                    },
                    mockTertiaryButton = {
                        on: function () { }
                    },
                    mockHighlightButton = {},
                    mockUnhighlightButton = {},
                    mockCurrentPage = {
                        find : function () { }
                    },
                    mockMustacheRenderResponse = "Render response",
                    cssSpy,
                    mockBody = {
                        pagecontainer: function () { }
                    };

                beforeEach(function () {
                    spyOn(utils, "getPageBody").and.returnValue(mockBody);
                    spyOn(mockBody, "pagecontainer").and.returnValue(mockCurrentPage);

                    spyOn(mockCurrentPage, "find").and.callFake(
                        function (findParameter) {
                            if (findParameter === ":jqmData(role='header')") {
                                return mockHeader;
                            }
                            if (findParameter === ".ui-content") {
                                return mockContent;
                            }
                            if (findParameter === "#" + globals.DIALOG.ID) {
                                return mockDialog;
                            }
                        }
                    );

                    spyOn(mockDialog, "find").and.callFake(
                        function (findParameter) {
                            if (findParameter === "#" + globals.DIALOG.PRIMARY_BTN_ID) {
                                return mockPrimaryButton;
                            }
                            if (findParameter === "#" + globals.DIALOG.SECONDARY_BTN_ID) {
                                return mockSecondaryButton;
                            }
                            if (findParameter === "#" + globals.DIALOG.TERTIARY_BTN_ID) {
                                return mockTertiaryButton;
                            }
                            if (findParameter === "#" + dialogOptions.highlightButton) {
                                return mockHighlightButton;
                            }
                            if (findParameter === "#" +  dialogOptions.unhighlightButton) {
                                return mockUnhighlightButton;
                            }
                        }
                    );

                    cssSpy = spyOn(mockHeader, "css").and.callThrough();
                    spyOn(mockContent, "append").and.callThrough();
                    spyOn(mockPrimaryButton, "on").and.callThrough();
                    spyOn(mockSecondaryButton, "on").and.callThrough();
                    spyOn(mockTertiaryButton, "on").and.callThrough();
                    spyOn(mockDialog, "popup").and.callThrough();
                    spyOn(mockDialog, "trigger").and.callThrough();
                    spyOn(mockPopup, "bind").and.callThrough();
                    spyOn(mockMustache, "render").and.returnValue(mockMustacheRenderResponse);
                    spyOn(appView, "highlightButton").and.callFake(function () {});
                    spyOn(appView, "unhighlightButton").and.callFake(function () {});

                    appView.displayDialog(dialogOptions);
                });

                it("is defined", function () {
                    expect(appView.displayDialog).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.displayDialog).toEqual(jasmine.any(Function));
                });

                it("should call find on the current page to get the header", function () {
                    expect(mockCurrentPage.find).toHaveBeenCalledWith(":jqmData(role='header')");
                });

                it("should call find on the current page to get the content", function () {
                    expect(mockCurrentPage.find).toHaveBeenCalledWith(".ui-content");
                });

                it("should call Mustache.render() on the dialog template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(appView.dialogTemplate, dialogOptions);
                });

                it("should call append on the content", function () {
                    expect(mockContent.append).toHaveBeenCalledWith(mockMustacheRenderResponse);
                });

                it("should call find on the current page to get the dialog", function () {
                    expect(mockCurrentPage.find).toHaveBeenCalledWith("#" + globals.DIALOG.ID);
                });

                it("should call find on the dialog to get the primary button", function () {
                    expect(mockDialog.find).toHaveBeenCalledWith("#" + globals.DIALOG.PRIMARY_BTN_ID);
                });

                it("should call find on the dialog to get the secondary button", function () {
                    expect(mockDialog.find).toHaveBeenCalledWith("#" + globals.DIALOG.SECONDARY_BTN_ID);
                });

                it("should call find on the dialog to get the tertiary button", function () {
                    expect(mockDialog.find).toHaveBeenCalledWith("#" + globals.DIALOG.TERTIARY_BTN_ID);
                });

                it("should call trigger on the dialog ", function () {
                    expect(mockDialog.trigger).toHaveBeenCalledWith("create");
                });

                it("should call popup on the dialog with no arguments", function () {
                    expect(mockDialog.popup).toHaveBeenCalledWith();
                });

                describe("the popupbeforeposition callback passed to bind", function () {
                    beforeEach(function () {
                        spyOn(dialogOptions, "popupbeforeposition").and.callThrough();

                        var callback = mockPopup.bind.calls.argsFor(0)[0];
                        callback.popupbeforeposition.call(mockDialog);
                    });

                    it("should call popupbeforeposition on the dialog options", function () {
                        expect(dialogOptions.popupbeforeposition).toHaveBeenCalledWith();
                    });
                });

                describe("the popupafteropen callback passed to bind", function () {
                    beforeEach(function () {
                        spyOn(dialogOptions, "popupafteropen").and.callThrough();

                        var callback = mockPopup.bind.calls.argsFor(0)[0];
                        callback.popupafteropen.call(mockDialog);
                    });

                    it("should call popupafteropen on the dialog options", function () {
                        expect(dialogOptions.popupafteropen).toHaveBeenCalledWith();
                    });
                });

                describe("the popupafterclose callback passed to bind", function () {
                    var mockJqueryReturn = {
                        remove: function () {}
                    };

                    describe("when the header has an absolute position", function () {
                        beforeEach(function () {
                            cssSpy.and.returnValue("absolute");
                            appView.displayDialog(dialogOptions);

                            spyOn(dialogOptions, "popupafterclose").and.callThrough();
                            spyOn(utils, "$").and.returnValue(mockJqueryReturn);
                            spyOn(mockJqueryReturn, "remove").and.callThrough();

                            var callback = mockPopup.bind.calls.argsFor(0)[0];
                            callback.popupafterclose.call(mockDialog);
                        });

                        it("should get the css value of position on the header", function () {
                            expect(mockHeader.css).toHaveBeenCalledWith("position");
                        });

                        it("should NOT set the css value of position on the header", function () {
                            expect(mockHeader.css).not.toHaveBeenCalledWith("position", "absolute");
                        });

                        it("should call popupafterclose on the dialog options", function () {
                            expect(dialogOptions.popupafterclose).toHaveBeenCalledWith();
                        });

                        it("should get the css value of position on the header", function () {
                            expect(mockHeader.css).toHaveBeenCalledWith("position");
                        });

                        it("should set the css value of position on the header", function () {
                            expect(mockHeader.css).toHaveBeenCalledWith("position", "Mock Value");
                        });

                        it("should call $ on utils", function () {
                            expect(utils.$).toHaveBeenCalledWith(mockDialog);
                        });

                        it("should call remove", function () {
                            expect(mockJqueryReturn.remove).toHaveBeenCalledWith();
                        });
                    });

                    describe("when the header has a fixed position", function () {
                        beforeEach(function () {
                            cssSpy.and.returnValue("fixed");
                            appView.displayDialog(dialogOptions);

                            spyOn(dialogOptions, "popupafterclose").and.callThrough();
                            spyOn(utils, "$").and.returnValue(mockJqueryReturn);
                            spyOn(mockJqueryReturn, "remove").and.callThrough();

                            var callback = mockPopup.bind.calls.argsFor(0)[0];
                            callback.popupafterclose.call(mockDialog);
                        });

                        it("should get the css value of position on the header", function () {
                            expect(mockHeader.css).toHaveBeenCalledWith("position");
                        });

                        it("should set the css value of position on the header", function () {
                            expect(mockHeader.css).toHaveBeenCalledWith("position", "absolute");
                        });

                        it("should call popupafterclose on the dialog options", function () {
                            expect(dialogOptions.popupafterclose).toHaveBeenCalledWith();
                        });

                        it("should get the css value of position on the header", function () {
                            expect(mockHeader.css).toHaveBeenCalledWith("position");
                        });

                        it("should NOT set the css value of position on the header", function () {
                            expect(mockHeader.css).not.toHaveBeenCalledWith("position", "Mock Value");
                        });

                        it("should call $ on utils", function () {
                            expect(utils.$).toHaveBeenCalledWith(mockDialog);
                        });

                        it("should call remove", function () {
                            expect(mockJqueryReturn.remove).toHaveBeenCalledWith();
                        });
                    });
                });

                it("should call on on the primary button to set the click handler", function () {
                    expect(mockPrimaryButton.on).toHaveBeenCalledWith("click", jasmine.any(Function));
                });

                describe("the callback from the primary button call to on", function () {
                    beforeEach(function () {
                        spyOn(dialogOptions, "primaryBtnHandler").and.callThrough();

                        var callback = mockPrimaryButton.on.calls.argsFor(0)[1];
                        callback.call(appView);
                    });

                    it("should call the primary button handler", function () {
                        expect(dialogOptions.primaryBtnHandler).toHaveBeenCalledWith();
                    });
                });

                it("should call on on the secondary button to set the click handler", function () {
                    expect(mockSecondaryButton.on).toHaveBeenCalledWith("click", jasmine.any(Function));
                });

                describe("the callback from the secondary button call to on", function () {
                    beforeEach(function () {
                        spyOn(dialogOptions, "secondaryBtnHandler").and.callThrough();

                        var callback = mockSecondaryButton.on.calls.argsFor(0)[1];
                        callback.call(appView);
                    });

                    it("should call the secondary button handler", function () {
                        expect(dialogOptions.secondaryBtnHandler).toHaveBeenCalledWith();
                    });
                });

                it("should call on on the secondary button to set the click handler", function () {
                    expect(mockTertiaryButton.on).toHaveBeenCalledWith("click", jasmine.any(Function));
                });

                describe("the callback from the tertiary button call to on", function () {
                    beforeEach(function () {
                        spyOn(dialogOptions, "tertiaryBtnHandler").and.callThrough();

                        var callback = mockTertiaryButton.on.calls.argsFor(0)[1];
                        callback.call(appView);
                    });

                    it("should call the tertiary button handler", function () {
                        expect(dialogOptions.tertiaryBtnHandler).toHaveBeenCalledWith();
                    });
                });

                it("should call find on the dialog to get the highlightButton button", function () {
                    expect(mockDialog.find).toHaveBeenCalledWith("#" + dialogOptions.highlightButton);
                });

                it("should call highlightButton ", function () {
                    expect(appView.highlightButton).toHaveBeenCalledWith(mockHighlightButton);
                });

                it("should call find on the dialog to get the unhighlight button", function () {
                    expect(mockDialog.find).toHaveBeenCalledWith("#" + dialogOptions.unhighlightButton);
                });

                it("should call unhighlightButton ", function () {
                    expect(appView.unhighlightButton).toHaveBeenCalledWith(mockUnhighlightButton);
                });

                it("should call popup on the dialog ", function () {
                    expect(mockDialog.popup).toHaveBeenCalledWith("open");
                });

                it("should call popup on the dialog ", function () {
                    expect(mockDialog.popup).toHaveBeenCalledWith("open");
                });
            });

            describe("has a highlightButton function that", function () {
                var mockButton = {
                    addClass : function () { return this; }
                };

                beforeEach(function () {
                    spyOn(mockButton, "addClass").and.callThrough();

                    appView.highlightButton(mockButton);
                });

                it("is defined", function () {
                    expect(appView.highlightButton).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.highlightButton).toEqual(jasmine.any(Function));
                });

                it("should call addClass on the button", function () {
                    expect(mockButton.addClass).toHaveBeenCalledWith("ui-btn-active");
                });
            });

            describe("has a unhighlightButton function that", function () {
                var mockButton = {
                    addClass : function () { return this; },
                    attr : function () { return this; },
                    removeClass : function () { return this; }
                };

                beforeEach(function () {
                    spyOn(mockButton, "addClass").and.callThrough();
                    spyOn(mockButton, "attr").and.callThrough();
                    spyOn(mockButton, "removeClass").and.callThrough();

                    appView.unhighlightButton(mockButton);
                });

                it("is defined", function () {
                    expect(appView.unhighlightButton).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.unhighlightButton).toEqual(jasmine.any(Function));
                });

                it("should call removeClass on the button", function () {
                    expect(mockButton.removeClass)
                        .toHaveBeenCalledWith("ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e");
                });

                it("should call addClass on the button", function () {
                    expect(mockButton.addClass).toHaveBeenCalledWith("ui-btn-up-d");
                });

                it("should call attr on the button", function () {
                    expect(mockButton.attr).toHaveBeenCalledWith("data-theme", "d");
                });
            });

            describe("has a navigateCheckConnection function that", function () {
                var mockNode = {
                    on  : function () { },
                    off : function () { }
                };

                it("is defined", function () {
                    expect(appView.navigateCheckConnection).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.navigateCheckConnection).toEqual(jasmine.any(Function));
                });

                describe("when a callback function is passed", function () {
                    var mockCallback = function () {};

                    beforeEach(function () {
                        spyOn(mockUtils, "$").and.callFake(function () { return mockNode; });
                        spyOn(mockUtils, "isFn").and.callFake(function () { return true; });
                        spyOn(mockUtils, "changePage").and.callFake(function () { });
                        spyOn(mockNode, "on").and.callThrough();
                        spyOn(mockNode, "off").and.callThrough();
                    });

                    it("should call $ on utils twice", function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.$).toHaveBeenCalled();

                        expect(mockUtils.$.calls.count()).toEqual(2);
                    });

                    it("the first call $ on utils should pass the correct parameter", function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.$.calls.argsFor(0).length).toEqual(1);
                        expect(mockUtils.$.calls.argsFor(0)[0]).toEqual("#reconnectButton");
                    });

                    it("the second call $ on utils should pass the correct parameter", function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.$.calls.argsFor(1).length).toEqual(1);
                        expect(mockUtils.$.calls.argsFor(1)[0]).toEqual("#reconnectButton");
                    });

                    it("should call off on mockNode", function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockNode.off).toHaveBeenCalledWith();
                    });

                    it("should call isFn on utils", function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.isFn).toHaveBeenCalledWith(mockCallback);
                    });

                    it("should call on on mockNode", function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockNode.on).toHaveBeenCalledWith("click", mockCallback);
                    });

                    it("should call isActivePage on utils", function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.isActivePage).toHaveBeenCalledWith("networkMsg");
                    });

                    describe("when networkMsg is not the active page", function () {
                        it("should call changePage on utils", function () {
                            spyOn(mockUtils, "isActivePage").and.callFake(function () { return false; });

                            appView.navigateCheckConnection();

                            expect(mockUtils.changePage).toHaveBeenCalledWith("#networkMsg");
                        });
                    });

                    describe("when networkMsg is the active page", function () {
                        it("should not call changePage on utils", function () {
                            spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                            appView.navigateCheckConnection();

                            expect(mockUtils.changePage).not.toHaveBeenCalled();
                        });
                    });
                });

                describe("when a callback function is not passed", function () {
                    var mockCallback = "";

                    beforeEach(function () {
                        spyOn(mockUtils, "$").and.callFake(function () { return mockNode; });
                        spyOn(mockUtils, "isFn").and.callFake(function () { return false; });
                        spyOn(mockUtils, "changePage").and.callFake(function () { });
                        spyOn(mockNode, "on").and.callThrough();
                        spyOn(mockNode, "off").and.callThrough();
                    });

                    it("should call $ on utils once", function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.$).toHaveBeenCalled();

                        expect(mockUtils.$.calls.count()).toEqual(1);
                    });

                    it("the first call $ on utils should pass the correct parameter", function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.$.calls.argsFor(0).length).toEqual(1);
                        expect(mockUtils.$.calls.argsFor(0)[0]).toEqual("#reconnectButton");
                    });

                    it("should call off on mockNode", function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockNode.off).toHaveBeenCalledWith();
                    });

                    it("should call isFn on utils", function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.isFn).toHaveBeenCalledWith(mockCallback);
                    });

                    it("should not call on on mockNode", function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockNode.on).not.toHaveBeenCalled();
                    });

                    it("should call isActivePage on utils", function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.isActivePage).toHaveBeenCalledWith("networkMsg");
                    });

                    describe("when networkMsg is not the active page", function () {
                        it("should call changePage on utils", function () {
                            spyOn(mockUtils, "isActivePage").and.callFake(function () { return false; });

                            appView.navigateCheckConnection();

                            expect(mockUtils.changePage).toHaveBeenCalledWith("#networkMsg");
                        });
                    });

                    describe("when networkMsg is the active page", function () {
                        it("should call changePage on utils", function () {
                            spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });

                            appView.navigateCheckConnection();

                            expect(utils.changePage).not.toHaveBeenCalled();
                        });
                    });
                });
            });

            describe("has a closeCheckConnection function that", function () {
                var mockNode = {
                    dialog : function () { }
                };

                it("is defined", function () {
                    expect(appView.closeCheckConnection).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.closeCheckConnection).toEqual(jasmine.any(Function));
                });

                describe("when networkMsg is not the active page", function () {
                    beforeEach(function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return false; });
                        spyOn(mockUtils, "$").and.callFake(function () { return mockNode; });
                        spyOn(mockNode, "dialog").and.callThrough();

                        appView.closeCheckConnection();
                    });

                    it("should call isActivePage on utils", function () {
                        expect(mockUtils.isActivePage).toHaveBeenCalledWith("networkMsg");
                    });

                    it("should not call $ on utils", function () {
                        expect(mockUtils.$).not.toHaveBeenCalled();
                    });

                    it("should not call dialog on mockNode", function () {
                        expect(mockNode.dialog).not.toHaveBeenCalled();
                    });
                });

                describe("when networkMsg is the active page", function () {
                    beforeEach(function () {
                        spyOn(mockUtils, "isActivePage").and.callFake(function () { return true; });
                        spyOn(mockUtils, "$").and.callFake(function () { return mockNode; });
                        spyOn(mockNode, "dialog").and.callThrough();

                        appView.closeCheckConnection();
                    });

                    it("should call isActivePage on utils", function () {
                        expect(mockUtils.isActivePage).toHaveBeenCalledWith("networkMsg");
                    });

                    it("should call $ on utils", function () {
                        expect(mockUtils.$).toHaveBeenCalledWith("#networkMsg");
                    });

                    it("should call dialog on mockNode", function () {
                        expect(mockNode.dialog).toHaveBeenCalledWith("close");
                    });
                });
            });

            describe("has a handlePageBack function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(window.history, "back").and.callFake(function () {});

                    appView.handlePageBack(mockEvent);
                });

                it("is defined", function () {
                    expect(appView.handlePageBack).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.handlePageBack).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                it("should call window.history.back", function () {
                    expect(window.history.back).toHaveBeenCalledWith();
                });
            });

            describe("has a handleLogout function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(mockFacade, "publish").and.callFake(function () {});

                    appView.handleLogout(mockEvent);
                });

                it("is defined", function () {
                    expect(appView.handleLogout).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.handleLogout).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalledWith("login", "userLogout");
                });
            });
        });
    });
