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
                it("should set id to 1", function () {
                    expect(appModel.defaults.id).toEqual(1);
                });

                it("should set buildVersion to \"Unknown\"", function () {
                    expect(appModel.defaults.buildVersion).toEqual("Unknown");
                });

                it("should set platform to \"Unknown\"", function () {
                    expect(appModel.defaults.platform).toEqual("Unknown");
                });

                it("should set platformVersion to \"Unknown\"", function () {
                    expect(appModel.defaults.platformVersion).toEqual("Unknown");
                });

                it("should set lastWarnVersion to null", function () {
                    expect(appModel.defaults.lastWarnVersion).toBeNull();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(appModel, "fetch").andCallFake(function () {});
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

                it("should set application name with the Application Info's version", function () {
                    expect(appModel.get("buildVersion")).toEqual(MOCK_APPLICATION_INFO.version);
                });

                it("should call fetch", function () {
                    expect(appModel.fetch).toHaveBeenCalled();

                    expect(appModel.fetch.mostRecentCall.args.length).toEqual(0);
                });
            });

            describe("has a sync function that", function () {
                beforeEach(function () {
                    var store = {};

                    spyOn(localStorage, "getItem").andCallFake(function (key) {
                        return store[key];
                    });
                    spyOn(localStorage, "setItem").andCallFake(function (key, value) {
                        store[key] = value;
                    });
                });

                it("is defined", function () {
                    expect(appModel.sync).toBeDefined();
                });

                it("is a function", function () {
                    expect(appModel.sync).toEqual(jasmine.any(Function));
                });

                describe("when the method is update", function () {
                    // Mock application info
                    var MOCK_APP_INFO = {
                        "lastWarnVersion" : "2.1.0"
                    };

                    beforeEach(function () {
                        appModel.set("lastWarnVersion", MOCK_APP_INFO.lastWarnVersion);

                        spyOn(appModel, "get").andCallThrough();
                        appModel.sync("update", appModel);
                    });

                    it("should call get", function () {
                        expect(appModel.get).toHaveBeenCalled();
                    });

                    it("should store lastWarnVersion", function () {
                        expect(localStorage.setItem).toHaveBeenCalled();
                        expect(localStorage.getItem(globals.APP.constants.LAST_WARN_VERSION)).toEqual(appModel.get("lastWarnVersion"));
                    });
                });

                describe("when the method is create", function () {
                    // Mock application info
                    var MOCK_APP_INFO = {
                        "lastWarnVersion" : "2.1.0"
                    };

                    beforeEach(function () {
                        // Set the storage to have values that should get replaced
                        localStorage.setItem(globals.APP.constants.LAST_WARN_VERSION, MOCK_APP_INFO.lastWarnVersion);

                        spyOn(appModel, "set").andCallThrough();
                        appModel.sync("create", appModel);
                    });

                    it("should set lastWarnVersion in the AppModel to null", function () {
                        expect(appModel.set).toHaveBeenCalled();

                        expect(appModel.set.mostRecentCall.args[0]).toEqual("lastWarnVersion");
                        expect(appModel.set.mostRecentCall.args[1]).toBeNull();
                    });

                    it("should call localStorage.setItem 2 times", function () { // 1 of the calls are in the beforeEach
                        expect(localStorage.setItem.calls.length).toEqual(2);
                    });

                    it("should set lastWarnVersion in the local storage to null", function () {
                        expect(localStorage.getItem("lastWarnVersion")).toBeNull();
                    });
                });

                describe("when the method is read", function () {
                    // Mock application info
                    var MOCK_APP_INFO = {
                        "lastWarnVersion" : "2.1.0"
                    };

                    beforeEach(function () {
                        localStorage.setItem(globals.APP.constants.LAST_WARN_VERSION, MOCK_APP_INFO.lastWarnVersion);

                        spyOn(appModel, "set").andCallThrough();
                        appModel.sync("read", appModel);
                    });

                    it("should call set", function () {
                        expect(appModel.set).toHaveBeenCalled();

                        expect(appModel.set.mostRecentCall.args[0]).toEqual("lastWarnVersion");
                        expect(appModel.set.mostRecentCall.args[1]).toEqual(MOCK_APP_INFO.lastWarnVersion);
                    });

                    it("should call localStorage.getItem 1 time", function () {
                        expect(localStorage.getItem.calls.length).toEqual(1);
                    });

                    it("should set lastWarnVersion", function () {
                        expect(appModel.get("lastWarnVersion")).toEqual(MOCK_APP_INFO.lastWarnVersion);
                    });
                });
            });
        });
    });
