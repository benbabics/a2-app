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
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["controllers/UpdatePromptController"], function (UpdatePromptController) {
                    appModel.set(mockAppModel);
                    spyOn(AppModel, "getInstance").andCallFake(function () { return appModel; });

                    updatePromptController = UpdatePromptController;

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
                    spyOn(mockUtils, "$").andCallFake(function () { });

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

                    expect(mockUtils.$.calls[0].args.length).toEqual(1);
                    expect(mockUtils.$.calls[0].args[0]).toEqual(jasmine.any(Function));
                });

                describe("when calling the function passed to $ on utils", function () {
                    var callback;

                    beforeEach(function () {
                        callback = mockUtils.$.calls[0].args[0];

                        spyOn(updatePromptController, "checkAppVersionStatus").andCallFake(function () {});

                        callback.apply();
                    });

                    describe("when AppModel.buildVersion is NOT set to Unknown", function () {
                        beforeEach(function () {
                            appModel.set("buildVersion", "1.1.0");

                            callback.apply();
                        });

                        it("should call checkAppVersionStatus", function () {
                            expect(updatePromptController.checkAppVersionStatus).toHaveBeenCalled();

                            expect(updatePromptController.checkAppVersionStatus.mostRecentCall.args.length).toEqual(0);
                        });
                    });

                    describe("when AppModel.buildVersion is set to Unknown", function () {
                        beforeEach(function () {
                            appModel.set("buildVersion", "Unknown");
                            spyOn(appModel, "once").andCallFake(function () { });

                            callback.apply();
                        });

                        it("should call once on the AppModel", function () {
                            expect(appModel.once).toHaveBeenCalled();

                            expect(appModel.once.mostRecentCall.args.length).toEqual(2);
                            expect(appModel.once.mostRecentCall.args[0]).toEqual("change:buildVersion");
                            expect(appModel.once.mostRecentCall.args[1]).toEqual(jasmine.any(Function));
                        });

                        describe("when the handler of the change:buildVersion event is called", function () {
                            var callback;

                            beforeEach(function () {
                                callback = appModel.once.mostRecentCall.args[1];
                                callback.apply(appModel);
                            });

                            it("should call checkAppVersionStatus", function () {
                                expect(updatePromptController.checkAppVersionStatus).toHaveBeenCalled();

                                expect(updatePromptController.checkAppVersionStatus.mostRecentCall.args.length).toEqual(0);
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
                        spyOn(updatePromptController, "fetchAppVersionStatus").andCallFake(function () { });
                        spyOn(updatePromptController, "showPromptToUpdateFail").andCallFake(function () { });

                        updatePromptController.init();
                        updatePromptController.checkAppVersionStatus();
                    });

                    it("should call the fetchAppVersionStatus function", function () {
                        expect(updatePromptController.fetchAppVersionStatus).toHaveBeenCalled();

                        expect(updatePromptController.fetchAppVersionStatus.mostRecentCall.args.length).toEqual(0);
                    });

                    it("should call the showPromptToUpdateFail function", function () {
                        expect(updatePromptController.showPromptToUpdateFail).toHaveBeenCalled();

                        expect(updatePromptController.showPromptToUpdateFail.mostRecentCall.args.length).toEqual(0);
                    });
                });

                describe("when the app version status is warn", function () {
                    beforeEach(function () {
                        appModel.set(globals.APP.constants.APP_VERSION_STATUS, "warn");
                        spyOn(updatePromptController, "fetchAppVersionStatus").andCallFake(function () { });

                        updatePromptController.init();
                    });

                    it("should call the fetchAppVersionStatus function", function () {
                        updatePromptController.checkAppVersionStatus();

                        expect(updatePromptController.fetchAppVersionStatus).toHaveBeenCalled();

                        expect(updatePromptController.fetchAppVersionStatus.mostRecentCall.args.length).toEqual(0);
                    });

                    describe("when lastWarnVersion is null", function () {
                        beforeEach(function () {
                            appModel.set("lastWarnVersion", null);
                        });

                        it("should call the showPromptToUpdateWarn function", function () {
                            spyOn(updatePromptController, "showPromptToUpdateWarn").andCallFake(function () { });

                            updatePromptController.checkAppVersionStatus();

                            expect(updatePromptController.showPromptToUpdateWarn).toHaveBeenCalled();

                            expect(updatePromptController.showPromptToUpdateWarn.mostRecentCall.args.length).toEqual(0);
                        });
                    });

                    describe("when lastWarnVersion is not equal to buildVersion", function () {
                        beforeEach(function () {
                            appModel.set("lastWarnVersion", "someVersion");
                            appModel.set("buildVersion",    "someOtherVersion");
                        });

                        it("should call the showPromptToUpdateWarn function", function () {
                            spyOn(updatePromptController, "showPromptToUpdateWarn").andCallFake(function () { });

                            updatePromptController.checkAppVersionStatus();

                            expect(updatePromptController.showPromptToUpdateWarn).toHaveBeenCalled();

                            expect(updatePromptController.showPromptToUpdateWarn.mostRecentCall.args.length).toEqual(0);
                        });
                    });

                    describe("when lastWarnVersion is equal to buildVersion", function () {
                        beforeEach(function () {
                            appModel.set("lastWarnVersion", appModel.get("buildVersion"));
                        });

                        it("should not call the showPromptToUpdateWarn function", function () {
                            spyOn(updatePromptController, "showPromptToUpdateWarn").andCallFake(function () { });

                            updatePromptController.checkAppVersionStatus();

                            expect(updatePromptController.showPromptToUpdateWarn).not.toHaveBeenCalled();
                        });
                    });
                });

                describe("when the app version status is ok", function () {
                    beforeEach(function () {
                        appModel.set(globals.APP.constants.APP_VERSION_STATUS, "ok");
                        spyOn(updatePromptController, "fetchAppVersionStatus").andCallFake(function () { });
                        spyOn(mockFacade, "publish").andCallFake(function () { });

                        updatePromptController.init();
                        updatePromptController.checkAppVersionStatus();
                    });

                    it("should call the fetchAppVersionStatus function", function () {
                        expect(updatePromptController.fetchAppVersionStatus).toHaveBeenCalled();

                        expect(updatePromptController.fetchAppVersionStatus.mostRecentCall.args.length).toEqual(0);
                    });

                    it("should call publish on the facade", function () {
                        expect(mockFacade.publish).toHaveBeenCalled();

                        expect(mockFacade.publish.mostRecentCall.args.length).toEqual(2);
                        expect(mockFacade.publish.mostRecentCall.args[0]).toEqual("login");
                        expect(mockFacade.publish.mostRecentCall.args[1]).toEqual("navigate");
                    });
                });
            });

            describe("has a fetchAppVersionStatus function that", function () {
                var appVersionStatusURL = "Mock appVersionStatusURL",
                    appVersionStatus = "Mock appVersionStatus";

                beforeEach(function () {
                    spyOn(mockUtils, "getJSON").andCallFake(function () { return appVersionStatus; });
                    spyOn(appModel, "set").andCallThrough();
                    spyOn(updatePromptController, "getAppVersionStatusURL").andCallFake(function () { return appVersionStatusURL; });

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

                    expect(mockUtils.getJSON.mostRecentCall.args.length).toEqual(1);
                    expect(mockUtils.getJSON.mostRecentCall.args[0]).toEqual(appVersionStatusURL);
                });

                it("should call the set function on AppModel", function () {
                    expect(appModel.set).toHaveBeenCalled();

                    expect(appModel.set.mostRecentCall.args.length).toEqual(2);
                    expect(appModel.set.mostRecentCall.args[0]).toEqual(globals.APP.constants.APP_VERSION_STATUS);
                    expect(appModel.set.mostRecentCall.args[1]).toEqual(appVersionStatus);
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
                    spyOn(mockUpdatePromptView, "renderFail").andCallFake(function () { });
                    spyOn(mockUtils, "changePage").andCallThrough();

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

                    expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(1);
                    expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual(mockUpdatePromptView.$el);
                });

                it("should call the updatePromptView renderFail function", function () {
                    expect(mockUpdatePromptView.renderFail).toHaveBeenCalled();

                    expect(mockUpdatePromptView.renderFail.mostRecentCall.args.length).toEqual(0);
                });
            });

            describe("has a showUpdatePromptToWarn function that", function () {
                beforeEach(function () {
                    spyOn(mockUpdatePromptView, "renderWarn").andCallFake(function () { });
                    spyOn(mockUtils, "changePage").andCallThrough();

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

                    expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(1);
                    expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual(mockUpdatePromptView.$el);
                });

                it("should call the updatePromptView renderWarn function", function () {
                    expect(mockUpdatePromptView.renderWarn).toHaveBeenCalled();

                    expect(mockUpdatePromptView.renderWarn.mostRecentCall.args.length).toEqual(0);
                });
            });
        });
    });