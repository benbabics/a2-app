define(["globals", "Squire"],
    function (globals, Squire) {

        "use strict";

        // Mock application info
        var MOCK_APPLICATION_INFO = {
                "version" : "1.1.1"
            },
            mockApplicationInfoPlugin = {
                getBuildVersion : function (successCallback) { successCallback(MOCK_APPLICATION_INFO.version); }
            },
            squire = new Squire(),
            appModel;

        squire.mock("plugins/ApplicationInfo", mockApplicationInfoPlugin);

        describe("An AppModel", function() {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function(done) {
                squire.require(["models/AppModel"], function(AppModel) {
                    appModel = AppModel.getInstance();
                    done();
                });
            });

            it("is defined", function() {
                expect(appModel).toBeDefined();
            });

            it("looks like a Backbone model", function() {
                expect(appModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set buildVersion to \"Unknown\"", function () {
                    expect(appModel.defaults.buildVersion).toEqual("Unknown");
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockApplicationInfoPlugin, "getBuildVersion").andCallThrough();

                    appModel.initialize();
                });

                it("is defined", function () {
                    expect(appModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(appModel.initialize).toEqual(jasmine.any(Function));
                });

                it("should call the mockApplicationInfoPlugin getBuildVersion function", function () {
                    expect(mockApplicationInfoPlugin.getBuildVersion).toHaveBeenCalled();

                    expect(window.setTimeout.mostRecentCall.args.length).toEqual(0);
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
