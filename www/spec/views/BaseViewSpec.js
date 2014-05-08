define(["Squire", "mustache", "globals", "utils", "jasmine-jquery"],
    function (Squire, Mustache, globals, utils) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockUtils = utils,
            mockTemplate =
                "<div>" +
                "<label for='field1'>Field1:</label>" +
                "<input type='text' name='field1' id='field1' />" +
                "</div>" +
                "<div>" +
                "<label for='field2'>Field2:</label>" +
                "<input type='text' name='field2' id='field2' />" +
                "</div>" +
                "<div>" +
                "<label for='field3'>Field3:</label>" +
                "<input type='text' name='field3' id='field3' />" +
                "</div>" +
                "<div>" +
                "<label for='field4'>Field4:</label>" +
                "<select name='field4' id='field4' />" +
                "<option value=''>- - Select - -</option>" +
                "</select>" +
                "</div>" +
                "<div>" +
                "<label for='field5'>Field5:</label>" +
                "<textarea name='field5' id='field5' /></textarea>" +
                "</div>",
            formModel = new Backbone.Model(),
            BaseView,
            baseView;

        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);

        describe("A Base View", function () {

            beforeEach(function (done) {
                squire.require(["views/BaseView", "views/AppView"], function (JasmineBaseView, AppView) {

                    var appView = new AppView();
                    appView.initialize();

                    BaseView = JasmineBaseView;
                    baseView = new BaseView({
                        model   : formModel
                    });

                    baseView.template = mockTemplate;

                    done();
                });
            });

            it("is defined", function () {
                expect(baseView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(baseView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(baseView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.constructor).toEqual(jasmine.any(Function));
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(BaseView.__super__, "initialize").and.callFake(function () {});
                    spyOn(baseView, "setModel").and.callFake(function () { });
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(baseView, "pageCreate").and.callFake(function () { });

                    baseView.initialize();
                });

                it("is defined", function () {
                    expect(baseView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(BaseView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should call setModel()", function () {
                    expect(baseView.setModel).toHaveBeenCalledWith(formModel);
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(mockTemplate);
                });

                it("should call pageCreate()", function () {
                    expect(baseView.pageCreate).toHaveBeenCalledWith();
                });
            });

            describe("has a setModel function that", function () {
                beforeEach(function () {
                    spyOn(baseView, "setupLoadingIndicatorOnModel").and.callFake(function () { });

                    baseView.setModel(formModel);
                });

                it("is defined", function () {
                    expect(baseView.setModel).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.setModel).toEqual(jasmine.any(Function));
                });

                it("should call setupLoadingIndicatorOnModel", function () {
                    expect(baseView.setupLoadingIndicatorOnModel).toHaveBeenCalledWith(formModel);
                });
            });

            describe("has a setupLoadingIndicatorOnModel function that", function () {
                beforeEach(function () {
                    spyOn(baseView, "listenTo").and.callFake(function () { });

                    baseView.setupLoadingIndicatorOnModel(formModel);
                });

                it("is defined", function () {
                    expect(baseView.setupLoadingIndicatorOnModel).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.setupLoadingIndicatorOnModel).toEqual(jasmine.any(Function));
                });

                it("should register a function as the handler for the request event", function () {
                    var eventHandler;

                    expect(baseView.listenTo).toHaveBeenCalledWith(formModel, "request", jasmine.any(Function));

                    eventHandler = baseView.listenTo.calls.argsFor(0)[2];
                    spyOn(baseView, "showLoadingIndicator").and.callFake(function () { });

                    eventHandler.apply(baseView);

                    expect(baseView.showLoadingIndicator).toHaveBeenCalledWith(true);
                });

                it("should register a function as the handler for the sync and error events", function () {
                    var eventHandler;

                    expect(baseView.listenTo).toHaveBeenCalledWith(formModel, "sync error", jasmine.any(Function));

                    eventHandler = baseView.listenTo.calls.argsFor(1)[2];
                    spyOn(baseView, "hideLoadingIndicator").and.callFake(function () { });

                    eventHandler.apply(baseView);

                    expect(baseView.hideLoadingIndicator).toHaveBeenCalledWith(true);
                });
            });

            describe("has a pageCreate function that", function () {
                it("is defined", function () {
                    expect(baseView.pageCreate).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.pageCreate).toEqual(jasmine.any(Function));
                });
            });

            describe("has a resetModel function that", function () {
                beforeEach(function () {
                    spyOn(formModel, "clear");
                    spyOn(formModel, "set");

                    baseView.resetModel();
                });

                it("is defined", function () {
                    expect(baseView.resetModel).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.resetModel).toEqual(jasmine.any(Function));
                });

                it("should call clear on the Model", function () {
                    expect(formModel.clear).toHaveBeenCalledWith();
                });

                describe("when model.defaults is NOT a function", function () {
                    it("should call set on the Model", function () {
                        formModel.defaults = {
                            "field1": null,
                            "field2": null
                        };

                        baseView.resetModel();

                        expect(formModel.set).toHaveBeenCalledWith(formModel.defaults);
                    });
                });

                describe("when model.defaults is a function", function () {
                    var mockDefaults = {
                        "field1": "asdfasdf",
                        "field2": null,
                        "field3": null
                    };

                    beforeEach(function () {
                        formModel.defaults = function () {
                            return mockDefaults;
                        };

                        spyOn(formModel, "defaults").and.callThrough();

                        baseView.resetModel();
                    });

                    it("should call defaults on the model", function () {
                        expect(formModel.defaults).toHaveBeenCalledWith();
                    });

                    it("should call set on the Model", function () {
                        expect(formModel.set).toHaveBeenCalledWith(mockDefaults);
                    });
                });
            });
        });
    });
