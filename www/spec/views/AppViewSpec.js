define(["backbone", "utils", "Squire", "jasmine-jquery"],
    function (Backbone, utils, Squire) {
        "use strict";

        var squire = new Squire(),
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
        squire.mock("utils", mockUtils);

        describe("An App View", function () {
            var jasmineAsync = new AsyncSpec(this);

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/AppView"], function (AppView) {
                    loadFixtures("index.html");

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
                    spyOn(appView, "render").andCallThrough();
                    spyOn(appView, "setupBackboneLoadingIndicators").andCallFake(function () {});

                    appView.initialize();
                });

                it("is defined", function () {
                    expect(appView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(appView.initialize).toEqual(jasmine.any(Function));
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
                            spyOn(appView.$el, "is").andCallFake(function () { return false; });
                            spyOn(mockUtils.$.mobile, "loading").andCallFake(function () {});
                            appView.showLoadingIndicator(true);
                        });

                        it("should call the is function on AppView.$el", function () {
                            expect(appView.$el.is).toHaveBeenCalledWith(mockUtils.$.mobile.activePage);
                        });

                        it("should NOT call the loading function on utils.$.mobile", function () {
                            expect(mockUtils.$.mobile.loading).not.toHaveBeenCalled();
                        });
                    });

                    describe("when the active page", function () {
                        beforeEach(function () {
                            spyOn(appView.$el, "is").andCallFake(function () { return true; });
                            spyOn(mockUtils.$.mobile, "loading").andCallFake(function () {});
                            appView.showLoadingIndicator(true);
                        });

                        it("should call the is function on AppView.$el", function () {
                            expect(appView.$el.is).toHaveBeenCalledWith(mockUtils.$.mobile.activePage);
                        });

                        it("should call the loading function on utils.$.mobile", function () {
                            expect(mockUtils.$.mobile.loading).toHaveBeenCalledWith("show");
                        });
                    });
                });

                describe("when not checking that the view is the active page", function () {
                    beforeEach(function () {
                        spyOn(mockUtils.$.mobile, "loading").andCallFake(function () {});
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
                            spyOn(appView.$el, "is").andCallFake(function () { return false; });
                            spyOn(mockUtils.$.mobile, "loading").andCallFake(function () {});
                            appView.hideLoadingIndicator(true);
                        });

                        it("should call the is function on AppView.$el", function () {
                            expect(appView.$el.is).toHaveBeenCalledWith(mockUtils.$.mobile.activePage);
                        });

                        it("should NOT call the loading function on utils.$.mobile", function () {
                            expect(mockUtils.$.mobile.loading).not.toHaveBeenCalled();
                        });
                    });

                    describe("when the active page", function () {
                        beforeEach(function () {
                            spyOn(appView.$el, "is").andCallFake(function () { return true; });
                            spyOn(mockUtils.$.mobile, "loading").andCallFake(function () {});
                            appView.hideLoadingIndicator(true);
                        });

                        it("should call the is function on AppView.$el", function () {
                            expect(appView.$el.is).toHaveBeenCalledWith(mockUtils.$.mobile.activePage);
                        });

                        it("should call the loading function on utils.$.mobile", function () {
                            expect(mockUtils.$.mobile.loading).toHaveBeenCalledWith("hide");
                        });
                    });
                });

                describe("when not checking that the view is the active page", function () {
                    beforeEach(function () {
                        spyOn(mockUtils.$.mobile, "loading").andCallFake(function () {});
                        appView.hideLoadingIndicator(false);
                    });

                    it("should call the loading function on utils.$.mobile", function () {
                        expect(mockUtils.$.mobile.loading).toHaveBeenCalledWith("hide");
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
                    expect(mockButton.removeClass.mostRecentCall.args[0])
                        .toEqual("ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a " +
                                 "ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e");
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
                        spyOn(mockUtils, "$").andCallFake(function () { return mockNode; });
                        spyOn(mockUtils, "isFn").andCallFake(function () { return true; });
                        spyOn(mockUtils, "changePage").andCallFake(function () { });
                        spyOn(mockNode, "on").andCallThrough();
                        spyOn(mockNode, "off").andCallThrough();
                    });

                    it("should call $ on utils twice", function () {
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.$).toHaveBeenCalled();

                        expect(mockUtils.$.calls.length).toEqual(2);
                    });

                    it("the first call $ on utils should pass the correct parameter", function () {
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.$.calls[0].args.length).toEqual(1);
                        expect(mockUtils.$.calls[0].args[0]).toEqual("#reconnectButton");
                    });

                    it("the second call $ on utils should pass the correct parameter", function () {
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.$.calls[1].args.length).toEqual(1);
                        expect(mockUtils.$.calls[1].args[0]).toEqual("#reconnectButton");
                    });

                    it("should call off on mockNode", function () {
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockNode.off).toHaveBeenCalledWith();
                    });

                    it("should call isFn on utils", function () {
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.isFn).toHaveBeenCalledWith(mockCallback);
                    });

                    it("should call on on mockNode", function () {
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockNode.on).toHaveBeenCalledWith("click", mockCallback);
                    });

                    it("should call isActivePage on utils", function () {
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.isActivePage).toHaveBeenCalledWith("networkMsg");
                    });

                    describe("when networkMsg is not the active page", function () {
                        it("should call changePage on utils", function () {
                            spyOn(mockUtils, "isActivePage").andCallFake(function () { return false; });

                            appView.navigateCheckConnection();

                            expect(mockUtils.changePage).toHaveBeenCalledWith("#networkMsg");
                        });
                    });

                    describe("when networkMsg is the active page", function () {
                        it("should not call changePage on utils", function () {
                            spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                            appView.navigateCheckConnection();

                            expect(mockUtils.changePage).not.toHaveBeenCalled();
                        });
                    });
                });

                describe("when a callback function is not passed", function () {
                    var mockCallback = "";

                    beforeEach(function () {
                        spyOn(mockUtils, "$").andCallFake(function () { return mockNode; });
                        spyOn(mockUtils, "isFn").andCallFake(function () { return false; });
                        spyOn(mockUtils, "changePage").andCallFake(function () { });
                        spyOn(mockNode, "on").andCallThrough();
                        spyOn(mockNode, "off").andCallThrough();
                    });

                    it("should call $ on utils once", function () {
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.$).toHaveBeenCalled();

                        expect(mockUtils.$.calls.length).toEqual(1);
                    });

                    it("the first call $ on utils should pass the correct parameter", function () {
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.$.calls[0].args.length).toEqual(1);
                        expect(mockUtils.$.calls[0].args[0]).toEqual("#reconnectButton");
                    });

                    it("should call off on mockNode", function () {
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockNode.off).toHaveBeenCalled();

                        expect(mockNode.off.mostRecentCall.args.length).toEqual(0);
                    });

                    it("should call isFn on utils", function () {
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.isFn).toHaveBeenCalled();

                        expect(mockUtils.isFn.mostRecentCall.args.length).toEqual(1);
                        expect(mockUtils.isFn.mostRecentCall.args[0]).toEqual(mockCallback);
                    });

                    it("should not call on on mockNode", function () {
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockNode.on).not.toHaveBeenCalled();
                    });

                    it("should call isActivePage on utils", function () {
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

                        appView.navigateCheckConnection(mockCallback);

                        expect(mockUtils.isActivePage).toHaveBeenCalled();

                        expect(mockUtils.isActivePage.mostRecentCall.args.length).toEqual(1);
                        expect(mockUtils.isActivePage.mostRecentCall.args[0]).toEqual("networkMsg");
                    });

                    describe("when networkMsg is not the active page", function () {
                        it("should call changePage on utils", function () {
                            spyOn(mockUtils, "isActivePage").andCallFake(function () { return false; });

                            appView.navigateCheckConnection();

                            expect(mockUtils.changePage).toHaveBeenCalled();

                            expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(1);
                            expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual("#networkMsg");
                        });
                    });

                    describe("when networkMsg is the active page", function () {
                        it("should call changePage on utils", function () {
                            spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });

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
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return false; });
                        spyOn(mockUtils, "$").andCallFake(function () { return mockNode; });
                        spyOn(mockNode, "dialog").andCallThrough();

                        appView.closeCheckConnection();
                    });

                    it("should call isActivePage on utils", function () {
                        expect(mockUtils.isActivePage).toHaveBeenCalled();

                        expect(mockUtils.isActivePage.mostRecentCall.args.length).toEqual(1);
                        expect(mockUtils.isActivePage.mostRecentCall.args[0]).toEqual("networkMsg");
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
                        spyOn(mockUtils, "isActivePage").andCallFake(function () { return true; });
                        spyOn(mockUtils, "$").andCallFake(function () { return mockNode; });
                        spyOn(mockNode, "dialog").andCallThrough();

                        appView.closeCheckConnection();
                    });

                    it("should call isActivePage on utils", function () {
                        expect(mockUtils.isActivePage).toHaveBeenCalled();

                        expect(mockUtils.isActivePage.mostRecentCall.args.length).toEqual(1);
                        expect(mockUtils.isActivePage.mostRecentCall.args[0]).toEqual("networkMsg");
                    });

                    it("should call $ on utils", function () {
                        expect(mockUtils.$).toHaveBeenCalled();

                        expect(mockUtils.$.mostRecentCall.args.length).toEqual(1);
                        expect(mockUtils.$.mostRecentCall.args[0]).toEqual("#networkMsg");
                    });

                    it("should call dialog on mockNode", function () {
                        expect(mockNode.dialog).toHaveBeenCalled();

                        expect(mockNode.dialog.mostRecentCall.args.length).toEqual(1);
                        expect(mockNode.dialog.mostRecentCall.args[0]).toEqual("close");
                    });
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
                    spyOn(mockEvent, "preventDefault").andCallThrough();
                    spyOn(appView, "showLoadingIndicator").andCallFake(function () {});
                    spyOn(mockFacade, "publish").andCallFake(function () {});

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

                it("should show the loading indicator", function () {
                    expect(appView.showLoadingIndicator).toHaveBeenCalledWith();
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.mostRecentCall.args.length).toEqual(2);
                    expect(mockFacade.publish.mostRecentCall.args[0]).toEqual("login");
                    expect(mockFacade.publish.mostRecentCall.args[1]).toEqual("userLogout");
                });
            });
        });
    });
