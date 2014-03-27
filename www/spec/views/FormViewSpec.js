define(["Squire", "mustache", "globals", "utils", "jasmine-jquery"],
    function (Squire, Mustache, globals, utils) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockUtils = utils,
            mockFacade = {
                publish: function () { }
            },
            mockTemplate =
                "<form>" +
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
                    "</div>" +
                "</form>",
            formModel = new Backbone.Model(),
            formView;

        squire.mock("facade", mockFacade);
        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);

        describe("A Form View", function () {

            beforeEach(function (done) {
                squire.require(["views/FormView", "views/AppView"], function (FormView, AppView) {

                    var appView = new AppView();
                    appView.initialize();

                    formView = new FormView({
                        model: formModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(formView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(formView instanceof Backbone.View).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call handleInputChanged when an input is changed", function () {
                    expect(formView.events["change :input"]).toEqual("handleInputChanged");
                });
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(formView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(formView.constructor).toEqual(jasmine.any(Function));
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(formModel, "on").and.callFake(function () { });
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(formView, "pageCreate").and.callFake(function () { });
                    spyOn(mockUtils._, "bindAll").and.callFake(function () { });

                    formView.initialize();
                });

                it("is defined", function () {
                    expect(formView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(formView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call utils._.bindAll", function () {
                    expect(mockUtils._.bindAll).toHaveBeenCalled();

                    expect(mockUtils._.bindAll.calls.mostRecent().args.length).toEqual(3);
                    expect(mockUtils._.bindAll.calls.mostRecent().args[0]).toEqual(formView);
                    expect(mockUtils._.bindAll.calls.mostRecent().args[1]).toEqual("handleInputChanged");
                    expect(mockUtils._.bindAll.calls.mostRecent().args[2]).toEqual("submitForm");
                });

                it("should register a function as the handler for the request event", function () {
                    var eventHandler;

                    expect(formModel.on).toHaveBeenCalled();
                    expect(formModel.on.calls.argsFor(0).length).toEqual(3);
                    expect(formModel.on.calls.argsFor(0)[0]).toEqual("request");
                    expect(formModel.on.calls.argsFor(0)[2]).toEqual(formView);

                    eventHandler = formModel.on.calls.argsFor(0)[1];
                    spyOn(formView, "showLoadingIndicator").and.callFake(function () { });

                    eventHandler.apply(formView);

                    expect(formView.showLoadingIndicator).toHaveBeenCalledWith(true);
                });

                it("should register a function as the handler for the sync and error events", function () {
                    var eventHandler;

                    expect(formModel.on).toHaveBeenCalled();
                    expect(formModel.on.calls.argsFor(1).length).toEqual(3);
                    expect(formModel.on.calls.argsFor(1)[0]).toEqual("sync error");
                    expect(formModel.on.calls.argsFor(1)[2]).toEqual(formView);

                    eventHandler = formModel.on.calls.argsFor(1)[1];
                    spyOn(formView, "hideLoadingIndicator").and.callFake(function () { });

                    eventHandler.apply(formView);

                    expect(formView.hideLoadingIndicator).toHaveBeenCalledWith(true);
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(formView.template);
                });

                it("should call pageCreate()", function () {
                    expect(formView.pageCreate).toHaveBeenCalledWith();
                });
            });

            describe("has a pageCreate function that", function () {
                it("is defined", function () {
                    expect(formView.pageCreate).toBeDefined();
                });

                it("is a function", function () {
                    expect(formView.pageCreate).toEqual(jasmine.any(Function));
                });
            });

            describe("has an updateAttribute function that", function () {
                it("is defined", function () {
                    expect(formView.updateAttribute).toBeDefined();
                });

                it("is a function", function () {
                    expect(formView.updateAttribute).toEqual(jasmine.any(Function));
                });

                it("should set the attribute on the model with the new value", function () {
                    var key = "fakeKey",
                        value = "fakeValue";

                    spyOn(formModel, "set");
                    formView.updateAttribute(key, value);

                    expect(formModel.set).toHaveBeenCalled();
                    expect(formModel.set.calls.mostRecent().args.length).toEqual(2);
                    expect(formModel.set.calls.mostRecent().args[0]).toEqual(key);
                    expect(formModel.set.calls.mostRecent().args[1]).toEqual(value);
                });
            });

            describe("has a resetForm function that", function () {
                beforeEach(function () {
                    spyOn(formModel, "clear");
                    spyOn(formModel, "set");
                    formView.$el.html(mockTemplate);
                    spyOn(formView.$el.find("form")[0], "reset").and.callFake(function () { });

                    formView.resetForm();
                });

                afterEach(function () {
                    formView.$el.html("");
                });

                it("is defined", function () {
                    expect(formView.resetForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(formView.resetForm).toEqual(jasmine.any(Function));
                });

                it("should call reset on the form", function () {
                    expect(formView.$el.find("form")[0].reset).toHaveBeenCalledWith();
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

                        formView.resetForm();

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

                        formView.resetForm();
                    });

                    it("should call defaults on the model", function () {
                        expect(formModel.defaults).toHaveBeenCalledWith();
                    });

                    it("should call set on the Model", function () {
                        expect(formModel.set).toHaveBeenCalledWith(mockDefaults);
                    });
                });
            });

            describe("has a handleInputChanged function that", function () {
                it("is defined", function () {
                    expect(formView.handleInputChanged).toBeDefined();
                });

                it("is a function", function () {
                    expect(formView.handleInputChanged).toEqual(jasmine.any(Function));
                });

                it("should call updateAttribute", function () {
                    var mockEvent = {
                        "target"            : {
                            "name"  : "target_name",
                            "value" : "target_value"
                        }
                    };

                    spyOn(formView, "updateAttribute").and.callThrough();
                    formView.handleInputChanged(mockEvent);

                    expect(formView.updateAttribute).toHaveBeenCalled();
                    expect(formView.updateAttribute.calls.mostRecent().args.length).toEqual(2);
                    expect(formView.updateAttribute.calls.mostRecent().args[0]).toEqual(mockEvent.target.name);
                    expect(formView.updateAttribute.calls.mostRecent().args[1]).toEqual(mockEvent.target.value);
                });
            });

            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(formModel, "save").and.callFake(function () { });
                    formView.submitForm(mockEvent);
                });

                it("is defined", function () {
                    expect(formView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(formView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                it("should call save() on the model", function () {
                    expect(formModel.save).toHaveBeenCalledWith();
                });
            });
        });
    });
