define(["backbone", "Squire", "globals", "utils"],
    function (Backbone, Squire, globals, utils) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function (channel, event) { }
            },
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
            mockUpdatePromptView = {
                constructor: function () { },
                render: function () { },
                renderWarn: function () {},
                renderFail: function () {},
                $el: "",
                template: function () {},
                templateContent : {}
            },
            updatePromptController;

        squire.mock("backbone", mockBackbone);
        squire.mock("utils", mockUtils);
        squire.mock("facade", mockFacade);
        squire.mock("models/AppModel", AppModel);
        squire.mock("views/UpdatePromptView", Squire.Helpers.returns(mockUpdatePromptView));

        describe("A Update Prompt Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/UpdatePromptController"], function (UpdatePromptController) {
                    appModel.set(mockAppModel);
                    spyOn(AppModel, "getInstance").and.callFake(function () { return appModel; });

                    updatePromptController = UpdatePromptController;

                    spyOn(mockUtils, "getJSON").and.returnValue("ok"); // Stub so we're not actually making the request to the server

                    done();
                });
            });

            it("is defined", function () {
                expect(updatePromptController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(updatePromptController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockUtils, "$").and.callFake(function () { });

                    updatePromptController.init();
                });

                it("is defined", function () {
                    expect(updatePromptController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptController.init).toEqual(jasmine.any(Function));
                });

                describe("when initializing the AppModel", function () {
                    it("should set the appModel variable to the AppModel instance", function () {
                        expect(updatePromptController.appModel).toEqual(appModel);
                    });
                });

                describe("when initializing UpdatePromptView", function () {
                    it("should set the updatePromptView variable to a new UpdatePromptView object", function () {
                        expect(updatePromptController.updatePromptView).toEqual(mockUpdatePromptView);
                    });
                });

                it("should call $ on utils", function () {
                    expect(mockUtils.$).toHaveBeenCalled();

                    expect(mockUtils.$.calls.argsFor(0).length).toEqual(1);
                    expect(mockUtils.$.calls.argsFor(0)[0]).toEqual(jasmine.any(Function));
                });

                describe("when calling the function passed to $ on utils", function () {
                    var callback;

                    beforeEach(function () {
                        callback = mockUtils.$.calls.argsFor(0)[0];

                        spyOn(updatePromptController, "checkAppVersionStatus").and.callFake(function () {});

                        callback.apply();
                    });

                    describe("when AppModel.buildVersion is NOT set to Unknown", function () {
                        beforeEach(function () {
                            appModel.set("buildVersion", "1.1.0");

                            callback.apply();
                        });

                        it("should call checkAppVersionStatus", function () {
                            expect(updatePromptController.checkAppVersionStatus).toHaveBeenCalled();

                            expect(updatePromptController.checkAppVersionStatus.calls.mostRecent().args.length).toEqual(0);
                        });
                    });

                    describe("when AppModel.buildVersion is set to Unknown", function () {
                        beforeEach(function () {
                            appModel.set("buildVersion", "Unknown");
                            spyOn(appModel, "once").and.callFake(function () { });

                            callback.apply();
                        });

                        it("should call once on the AppModel", function () {
                            expect(appModel.once).toHaveBeenCalled();

                            expect(appModel.once.calls.mostRecent().args.length).toEqual(2);
                            expect(appModel.once.calls.mostRecent().args[0]).toEqual("change:buildVersion");
                            expect(appModel.once.calls.mostRecent().args[1]).toEqual(jasmine.any(Function));
                        });

                        describe("when the handler of the change:buildVersion event is called", function () {
                            var callback;

                            beforeEach(function () {
                                callback = appModel.once.calls.mostRecent().args[1];
                                callback.apply(appModel);
                            });

                            it("should call checkAppVersionStatus", function () {
                                expect(updatePromptController.checkAppVersionStatus).toHaveBeenCalled();

                                expect(updatePromptController.checkAppVersionStatus.calls.mostRecent().args.length).toEqual(0);
                            });
                        });
                    });
                });
            });

            describe("has a checkAppVersionStatus function that", function () {
                it("is defined", function () {
                    expect(updatePromptController.checkAppVersionStatus).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptController.checkAppVersionStatus).toEqual(jasmine.any(Function));
                });

                describe("when the app version status is fail", function () {
                    beforeEach(function () {
                        appModel.set(globals.APP.constants.APP_VERSION_STATUS, "fail");
                        spyOn(updatePromptController, "fetchAppVersionStatus").and.callFake(function () { });
                        spyOn(updatePromptController, "showPromptToUpdateFail").and.callFake(function () { });

                        updatePromptController.init();
                        updatePromptController.checkAppVersionStatus();
                    });

                    it("should call the fetchAppVersionStatus function", function () {
                        expect(updatePromptController.fetchAppVersionStatus).toHaveBeenCalled();

                        expect(updatePromptController.fetchAppVersionStatus.calls.mostRecent().args.length).toEqual(0);
                    });

                    it("should call the showPromptToUpdateFail function", function () {
                        expect(updatePromptController.showPromptToUpdateFail).toHaveBeenCalled();

                        expect(updatePromptController.showPromptToUpdateFail.calls.mostRecent().args.length).toEqual(0);
                    });
                });

                describe("when the app version status is warn", function () {
                    beforeEach(function () {
                        appModel.set(globals.APP.constants.APP_VERSION_STATUS, "warn");
                        spyOn(updatePromptController, "fetchAppVersionStatus").and.callFake(function () { });

                        updatePromptController.init();
                    });

                    it("should call the fetchAppVersionStatus function", function () {
                        updatePromptController.checkAppVersionStatus();

                        expect(updatePromptController.fetchAppVersionStatus).toHaveBeenCalled();

                        expect(updatePromptController.fetchAppVersionStatus.calls.mostRecent().args.length).toEqual(0);
                    });

                    describe("when lastWarnVersion is null", function () {
                        beforeEach(function () {
                            appModel.set("lastWarnVersion", null);
                        });

                        it("should call the showPromptToUpdateWarn function", function () {
                            spyOn(updatePromptController, "showPromptToUpdateWarn").and.callFake(function () { });

                            updatePromptController.checkAppVersionStatus();

                            expect(updatePromptController.showPromptToUpdateWarn).toHaveBeenCalled();

                            expect(updatePromptController.showPromptToUpdateWarn.calls.mostRecent().args.length).toEqual(0);
                        });
                    });

                    describe("when lastWarnVersion is not equal to buildVersion", function () {
                        beforeEach(function () {
                            appModel.set("lastWarnVersion", "someVersion");
                            appModel.set("buildVersion",    "someOtherVersion");
                        });

                        it("should call the showPromptToUpdateWarn function", function () {
                            spyOn(updatePromptController, "showPromptToUpdateWarn").and.callFake(function () { });

                            updatePromptController.checkAppVersionStatus();

                            expect(updatePromptController.showPromptToUpdateWarn).toHaveBeenCalled();

                            expect(updatePromptController.showPromptToUpdateWarn.calls.mostRecent().args.length).toEqual(0);
                        });
                    });

                    describe("when lastWarnVersion is equal to buildVersion", function () {
                        beforeEach(function () {
                            appModel.set("lastWarnVersion", appModel.get("buildVersion"));
                        });

                        it("should not call the showPromptToUpdateWarn function", function () {
                            spyOn(updatePromptController, "showPromptToUpdateWarn").and.callFake(function () { });

                            updatePromptController.checkAppVersionStatus();

                            expect(updatePromptController.showPromptToUpdateWarn).not.toHaveBeenCalled();
                        });
                    });
                });

                describe("when the app version status is ok", function () {
                    beforeEach(function () {
                        appModel.set(globals.APP.constants.APP_VERSION_STATUS, "ok");
                        spyOn(updatePromptController, "fetchAppVersionStatus").and.callFake(function () { });
                        spyOn(mockFacade, "publish").and.callFake(function () { });

                        updatePromptController.init();
                        updatePromptController.checkAppVersionStatus();
                    });

                    it("should call the fetchAppVersionStatus function", function () {
                        expect(updatePromptController.fetchAppVersionStatus).toHaveBeenCalled();

                        expect(updatePromptController.fetchAppVersionStatus.calls.mostRecent().args.length).toEqual(0);
                    });

                    it("should call publish on the facade", function () {
                        expect(mockFacade.publish).toHaveBeenCalled();

                        expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(2);
                        expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("login");
                        expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("navigate");
                    });
                });
            });

            describe("has a fetchAppVersionStatus function that", function () {
                var appVersionStatusURL = "Mock appVersionStatusURL",
                    appVersionStatus = "Mock appVersionStatus";

                beforeEach(function () {
                    mockUtils.getJSON.and.returnValue(appVersionStatus);
                    spyOn(appModel, "set").and.callThrough();
                    spyOn(updatePromptController, "getAppVersionStatusURL").and.callFake(function () { return appVersionStatusURL; });

                    updatePromptController.fetchAppVersionStatus();
                });

                it("is defined", function () {
                    expect(updatePromptController.fetchAppVersionStatus).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptController.fetchAppVersionStatus).toEqual(jasmine.any(Function));
                });

                it("should call the getJSON function on utils", function () {
                    expect(mockUtils.getJSON).toHaveBeenCalled();

                    expect(mockUtils.getJSON.calls.mostRecent().args.length).toEqual(1);
                    expect(mockUtils.getJSON.calls.mostRecent().args[0]).toEqual(appVersionStatusURL);
                });

                it("should call the set function on AppModel", function () {
                    expect(appModel.set).toHaveBeenCalled();

                    expect(appModel.set.calls.mostRecent().args.length).toEqual(2);
                    expect(appModel.set.calls.mostRecent().args[0]).toEqual(globals.APP.constants.APP_VERSION_STATUS);
                    expect(appModel.set.calls.mostRecent().args[1]).toEqual(appVersionStatus);
                });
            });

            describe("has a getAppVersionStatusURL function that", function () {
                it("is defined", function () {
                    expect(updatePromptController.getAppVersionStatusURL).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptController.getAppVersionStatusURL).toEqual(jasmine.any(Function));
                });

                it("should return the expected results", function () {
                    var expectedResult,
                        actualResult;

                    expectedResult = globals.WEBSERVICE.APP_VERSION_STATUS.URL +
                        "?" +
                        globals.WEBSERVICE.APP_VERSION_STATUS.VERSION_NUMBER +
                        mockAppModel.buildVersion +
                        "&" +
                        globals.WEBSERVICE.APP_VERSION_STATUS.PLATFORM +
                        mockAppModel.platform;

                    actualResult = updatePromptController.getAppVersionStatusURL();

                    expect(actualResult).toEqual(expectedResult);
                });
            });

            describe("has a showUpdatePromptToFail function that", function () {
                beforeEach(function () {
                    spyOn(mockUpdatePromptView, "renderFail").and.callFake(function () { });
                    spyOn(mockUtils, "changePage").and.callThrough();

                    updatePromptController.init();
                    updatePromptController.showPromptToUpdateFail();
                });

                it("is defined", function () {
                    expect(updatePromptController.showPromptToUpdateFail).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptController.showPromptToUpdateFail).toEqual(jasmine.any(Function));
                });

                it("should change the page to the Update Prompt View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.calls.mostRecent().args.length).toEqual(1);
                    expect(mockUtils.changePage.calls.mostRecent().args[0]).toEqual(mockUpdatePromptView.$el);
                });

                it("should call the updatePromptView renderFail function", function () {
                    expect(mockUpdatePromptView.renderFail).toHaveBeenCalled();

                    expect(mockUpdatePromptView.renderFail.calls.mostRecent().args.length).toEqual(0);
                });
            });

            describe("has a showUpdatePromptToWarn function that", function () {
                beforeEach(function () {
                    spyOn(mockUpdatePromptView, "renderWarn").and.callFake(function () { });
                    spyOn(mockUtils, "changePage").and.callThrough();

                    updatePromptController.init();
                    updatePromptController.showPromptToUpdateWarn();
                });

                it("is defined", function () {
                    expect(updatePromptController.showPromptToUpdateWarn).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptController.showPromptToUpdateWarn).toEqual(jasmine.any(Function));
                });

                it("should change the page to the Update Prompt View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.calls.mostRecent().args.length).toEqual(1);
                    expect(mockUtils.changePage.calls.mostRecent().args[0]).toEqual(mockUpdatePromptView.$el);
                });

                it("should call the updatePromptView renderWarn function", function () {
                    expect(mockUpdatePromptView.renderWarn).toHaveBeenCalled();

                    expect(mockUpdatePromptView.renderWarn.calls.mostRecent().args.length).toEqual(0);
                });
            });
        });
    });