define(["backbone", "utils", "Squire"],
    function (Backbone, utils, Squire) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            mockAppModel = {
                "buildVersion": "1.1.1"
            },
            appModel = new Backbone.Model(),
            AppModel = {
                getInstance: function () { }
            },
            mockRouter = {
                start: function () { },
                navigate: function () { }
            },
            mockAppView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                displayDialog: function () { },
                showLoadingIndicator: function () { },
                hideLoadingIndicator: function () { },
                closeCheckConnection: function () { },
                navigateCheckConnection: function () { }
            },
            appController;

        squire.mock("utils", mockUtils);
        squire.mock("models/AppModel", AppModel);
        squire.mock("routers/AppRouter", Squire.Helpers.returns(mockRouter));
        squire.mock("views/AppView", Squire.Helpers.returns(mockAppView));

        describe("An App Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/AppController"], function (AppController) {
                    appModel.set(mockAppModel);
                    spyOn(AppModel, "getInstance").and.callFake(function () { return appModel; });

                    appController = AppController;

                    done();
                });
            });

            it("is defined", function () {
                expect(appController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(appController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(appController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    appController.init();
                });

                it("is defined", function () {
                    expect(appController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(appController.init).toEqual(jasmine.any(Function));
                });

                describe("when initializing the AppRouter", function () {
                    it("should set the appRouter variable to a new AppRouter object", function () {
                        expect(appController.appRouter).toEqual(mockRouter);
                    });
                });

                describe("when initializing the AppModel", function () {
                    it("should set the appModel variable to the AppModel instance", function () {
                        expect(appController.appModel).toEqual(appModel);
                    });
                });

                describe("when initializing the AppView", function () {
                    beforeEach(function () {
                        spyOn(mockAppView, "constructor").and.callThrough();
                    });

                    it("should set the appView variable to a new AppView object", function () {
                        expect(appController.appView).toEqual(mockAppView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockAppView.constructor).toHaveBeenCalled();
                        expect(mockAppView.constructor).toHaveBeenCalledWith({
                            model: appModel,
                            el   : document.body
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });
            });

            describe("has a ready function that", function () {
                beforeEach(function () {
                    spyOn(appController, "onOffline").and.callFake(function () { });
                    spyOn(mockRouter, "start").and.callThrough();
                    spyOn(mockRouter, "navigate").and.callFake(function () { });
                    spyOn(mockAppView, "render").and.callThrough();
                    spyOn(document, "addEventListener").and.callThrough();
                    spyOn(window, "setTimeout").and.callThrough();
                    appController.init();
                    appController.ready();
                });

                it("is defined", function () {
                    expect(appController.ready).toBeDefined();
                });

                it("is a function", function () {
                    expect(appController.ready).toEqual(jasmine.any(Function));
                });

                it("should call the appRouter start function", function () {
                    expect(mockRouter.start).toHaveBeenCalled();

                    expect(mockRouter.start.calls.mostRecent().args.length).toEqual(0);
                });

                it("should call the appView render function", function () {
                    expect(mockAppView.render).toHaveBeenCalled();

                    expect(mockAppView.render.calls.mostRecent().args.length).toEqual(0);
                });

                it("should call the document addEventListener function", function () {
                    expect(document.addEventListener).toHaveBeenCalled();

                    expect(document.addEventListener.calls.mostRecent().args.length).toEqual(3);
                    expect(document.addEventListener.calls.mostRecent().args[0]).toEqual("offline");
                    expect(document.addEventListener.calls.mostRecent().args[1]).toEqual(jasmine.any(Function));
                    expect(document.addEventListener.calls.mostRecent().args[2]).toBeFalsy();
                });

                describe("calling the addEventListener callback parameter", function () {
                    it("should call the onOffline function", function () {
                        var callback = document.addEventListener.calls.mostRecent().args[1];

                        callback.apply();

                        expect(appController.onOffline).toHaveBeenCalledWith();
                    });
                });

                it("should call the window setTimeout function", function () {
                    expect(window.setTimeout).toHaveBeenCalled();

                    expect(window.setTimeout.calls.mostRecent().args.length).toEqual(2);
                    expect(window.setTimeout.calls.mostRecent().args[0]).toEqual(jasmine.any(Function));
                    expect(window.setTimeout.calls.mostRecent().args[1]).toEqual(2000);
                });

                describe("calling the window setTimeout callback parameter", function () {
                    it("should call the navigator.splashscreen.hide function", function () {
                        var callback = window.setTimeout.calls.mostRecent().args[0];

                        spyOn(navigator.splashscreen, "hide").and.callFake(function () {
                        });

                        callback.apply();

                        expect(navigator.splashscreen.hide).toHaveBeenCalled();

                        expect(navigator.splashscreen.hide.calls.mostRecent().args.length).toEqual(0);
                    });
                });
            });

            describe("has an onOffline function that", function () {
                beforeEach(function () {
                    spyOn(appController, "checkConnection").and.callFake(function () { });

                    appController.onOffline();
                });

                it("is defined", function () {
                    expect(appController.onOffline).toBeDefined();
                });

                it("is a function", function () {
                    expect(appController.onOffline).toEqual(jasmine.any(Function));
                });

                it("should call the checkConnection function", function () {
                    expect(appController.checkConnection).toHaveBeenCalledWith();
                });
            });

            describe("has a checkConnection function that", function () {
                var checkConnectionCallback;

                beforeEach(function () {
                    checkConnectionCallback = jasmine.createSpy("checkConnectionCallback");
                });

                it("is defined", function () {
                    expect(appController.checkConnection).toBeDefined();
                });

                it("is a function", function () {
                    expect(appController.checkConnection).toEqual(jasmine.any(Function));
                });

                describe("when the utils.hasNetworkConnection function returns true", function () {
                    beforeEach(function () {
                        spyOn(mockUtils, "hasNetworkConnection").and.callFake(function () { return true; });
                        spyOn(mockAppView, "closeCheckConnection").and.callFake(function () { });
                    });

                    it("should call the closeCheckConnection function on AppView", function () {
                        appController.checkConnection(checkConnectionCallback);

                        expect(mockAppView.closeCheckConnection).toHaveBeenCalledWith();
                    });

                    describe("when the utils.isFn function returns true", function () {
                        it("should call the callback", function () {
                            spyOn(mockUtils, "isFn").and.callFake(function () { return true; });

                            appController.checkConnection(checkConnectionCallback);

                            expect(checkConnectionCallback).toHaveBeenCalledWith();
                        });
                    });

                    describe("when the utils.isFn function returns false", function () {
                        it("should not call the callback", function () {
                            spyOn(mockUtils, "isFn").and.callFake(function () { return false; });

                            appController.checkConnection(checkConnectionCallback);

                            expect(checkConnectionCallback).not.toHaveBeenCalled();
                        });
                    });
                });

                describe("when the utils.hasNetworkConnection function returns false", function () {
                    beforeEach(function () {
                        spyOn(mockUtils, "hasNetworkConnection").and.callFake(function () { return false; });
                    });

                    describe("should call the navigateCheckConnection function on AppView", function () {
                        it("by passing a callback", function () {
                            spyOn(mockAppView, "navigateCheckConnection").and.callFake(function () { });

                            appController.checkConnection(checkConnectionCallback);

                            expect(mockAppView.navigateCheckConnection).toHaveBeenCalledWith(jasmine.any(Function));
                        });

                        describe("when the callback is called", function () {
                            var navigateCheckConnectionCallback;

                            beforeEach(function () {
                                spyOn(mockAppView, "navigateCheckConnection").and.callFake(function () { });

                                appController.checkConnection(checkConnectionCallback);

                                navigateCheckConnectionCallback =
                                    mockAppView.navigateCheckConnection.calls.mostRecent().args[0];

                                spyOn(mockAppView, "showLoadingIndicator").and.callFake(function (callback) { });
                                spyOn(window, "setTimeout").and.callThrough();
                                spyOn(mockAppView, "hideLoadingIndicator").and.callFake(function (callback) { });
                                spyOn(appController, "checkConnection").and.callFake(function () { });

                                navigateCheckConnectionCallback.call();
                            });

                            it("should call the showLoadingIndicator function on AppView", function () {
                                expect(mockAppView.showLoadingIndicator).toHaveBeenCalled();

                                expect(mockAppView.showLoadingIndicator.calls.mostRecent().args.length).toEqual(1);
                                expect(mockAppView.showLoadingIndicator.calls.mostRecent().args[0]).toBeFalsy();
                            });

                            describe("should call the setTimeout function on window", function () {
                                it("by passing a callback", function () {
                                    expect(window.setTimeout).toHaveBeenCalled();

                                    expect(window.setTimeout.calls.mostRecent().args.length).toEqual(2);
                                    expect(window.setTimeout.calls.mostRecent().args[0]).toEqual(jasmine.any(Function));
                                    expect(window.setTimeout.calls.mostRecent().args[1]).toEqual(2000);
                                });

                                describe("when the callback is called", function () {
                                    var setTimeoutCallback;

                                    beforeEach(function () {
                                        setTimeoutCallback = window.setTimeout.calls.mostRecent().args[0];

                                        setTimeoutCallback.call();
                                    });

                                    it("should call the hideLoadingIndicator function on AppView", function () {
                                        expect(mockAppView.hideLoadingIndicator).toHaveBeenCalled();

                                        expect(mockAppView.hideLoadingIndicator.calls.mostRecent().args.length).toEqual(1);
                                        expect(mockAppView.hideLoadingIndicator.calls.mostRecent().args[0]).toBeFalsy();
                                    });

                                    it("should call the checkConnection function", function () {
                                        expect(appController.checkConnection)
                                            .toHaveBeenCalledWith(checkConnectionCallback);
                                    });
                                });
                            });
                        });
                    });
                });
            });

            describe("has an alert function that", function () {
                var alertOptions = {
                    message          : "Alert Message Text",
                    primaryBtnLabel  : "OK"
                };

                beforeEach(function () {
                    spyOn(mockAppView, "displayDialog").and.callFake(function () { });

                    appController.alert(alertOptions);
                });

                it("is defined", function () {
                    expect(appController.alert).toBeDefined();
                });

                it("is a function", function () {
                    expect(appController.alert).toEqual(jasmine.any(Function));
                });

                it("should call the displayDialog function on AppView", function () {
                    expect(mockAppView.displayDialog).toHaveBeenCalled();

                    expect(mockAppView.displayDialog.calls.mostRecent().args.length).toEqual(1);
                    expect(mockAppView.displayDialog.calls.mostRecent().args[0]).toEqual(alertOptions);
                });
            });
        });
    });
