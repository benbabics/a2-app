define(["globals", "Squire"],
    function (globals, Squire) {

        "use strict";

        // Mock application info
        var MOCK_APPLICATION_INFO = {
                "version" : "1.1.1"
            },
            squire = new Squire(),
            appModel;

        describe("An AppModel", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["models/AppModel"], function (AppModel) {
                    spyOn(ApplicationInfo, "getBuildVersion").andCallFake(function (successCallback) { successCallback(MOCK_APPLICATION_INFO.version); });

                    appModel = AppModel.getInstance();
                    done();
                });
            });

            it("is defined", function () {
                expect(appModel).toBeDefined();
            });

            it("looks like a Backbone model", function () {
                expect(appModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set buildVersion to \"Unknown\"", function () {
                    expect(appModel.defaults.buildVersion).toEqual("Unknown");
                });

                it("should set platform to \"Unknown\"", function () {
                    expect(appModel.defaults.platform).toEqual("Unknown");
                });

                it("should set platformVersion to \"Unknown\"", function () {
                    expect(appModel.defaults.platformVersion).toEqual("Unknown");
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    appModel.initialize();
                });

                it("is defined", function () {
                    expect(appModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(appModel.initialize).toEqual(jasmine.any(Function));
                });

                it("should set platform with the device's platform", function () {
                    expect(appModel.get("platform")).toEqual(device.platform);
                });

                it("should set platformVersion with the device's version", function () {
                    expect(appModel.get("platformVersion")).toEqual(device.version);
                });

                it("should call the ApplicationInfo getBuildVersion function", function () {
                    expect(ApplicationInfo.getBuildVersion).toHaveBeenCalled();

                    expect(ApplicationInfo.getBuildVersion.mostRecentCall.args.length).toEqual(1);
                    expect(ApplicationInfo.getBuildVersion.mostRecentCall.args[0]).toEqual(jasmine.any(Function));
                });

                it("should set application name with the Application Info\"s version", function () {
                    expect(appModel.get("buildVersion")).toEqual(MOCK_APPLICATION_INFO.version);
                });
            });

            describe("has a sync function that", function () {
                it("is defined", function () {
                    expect(appModel.sync).toBeDefined();
                });

                it("is a function", function () {
                    expect(appModel.sync).toEqual(jasmine.any(Function));
                });
            });
        });

        return "App Model";
    });
