define(["Squire", "mustache", "globals", "utils", "jasmine-jquery", "backbone-validation"],
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
            MockModel = Backbone.Model.extend({
                validation: {
                    "field1": {
                        required: true
                    },
                    "field2": {
                        max: 100
                    },
                    "field4": {
                        required: true
                    },
                    "field5": {
                        required: true
                    }
                }
            }),
            formModel = new MockModel(),
            formView;

        squire.mock("facade", mockFacade);
        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);

        describe("A Form View", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
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
                    spyOn(Backbone.Validation, "bind").andCallThrough();
                    spyOn(formModel, "on").andCallFake(function () { });
                    spyOn(mockMustache, "parse").andCallThrough();
                    spyOn(formView, "pageCreate").andCallFake(function () { });
                    spyOn(mockUtils._, "bindAll").andCallFake(function () { });

                    formView.initialize();
                });

                it("is defined", function () {
                    expect(formView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(formView.initialize).toEqual(jasmine.any(Function));
                });

                it("should bind the Backbone.Validation", function () {
                    expect(Backbone.Validation.bind).toHaveBeenCalledWith(formView);
                });

                it("should call utils._.bindAll", function () {
                    expect(mockUtils._.bindAll).toHaveBeenCalled();

                    expect(mockUtils._.bindAll.mostRecentCall.args.length).toEqual(4);
                    expect(mockUtils._.bindAll.mostRecentCall.args[0]).toEqual(formView);
                    expect(mockUtils._.bindAll.mostRecentCall.args[1]).toEqual("handleValidationError");
                    expect(mockUtils._.bindAll.mostRecentCall.args[2]).toEqual("handleInputChanged");
                    expect(mockUtils._.bindAll.mostRecentCall.args[3]).toEqual("submitForm");
                });

                it("should register a function as the handler for the invalid event", function () {
                    expect(formModel.on).toHaveBeenCalled();
                    expect(formModel.on.calls[0].args.length).toEqual(2);
                    expect(formModel.on.calls[0].args[0]).toEqual("invalid");
                    expect(formModel.on.calls[0].args[1]).toEqual(formView.handleValidationError);
                });

                it("should register a function as the handler for the request event", function () {
                    var eventHandler;

                    expect(formModel.on).toHaveBeenCalled();
                    expect(formModel.on.calls[1].args.length).toEqual(3);
                    expect(formModel.on.calls[1].args[0]).toEqual("request");
                    expect(formModel.on.calls[1].args[2]).toEqual(formView);

                    // TODO: figure out why it says the showLoadingIndicator method doesn't exist
                    eventHandler = formModel.on.calls[1].args[1];
                    spyOn(formView, "showLoadingIndicator").andCallFake(function () { });

                    eventHandler.apply(formView);

                    expect(formView.showLoadingIndicator).toHaveBeenCalledWith(true);
                });

                it("should register a function as the handler for the sync and error events", function () {
                    var eventHandler;

                    expect(formModel.on).toHaveBeenCalled();
                    expect(formModel.on.calls[2].args.length).toEqual(3);
                    expect(formModel.on.calls[2].args[0]).toEqual("sync error");
                    expect(formModel.on.calls[2].args[2]).toEqual(formView);

                    // TODO: figure out why it says the hideLoadingIndicator method doesn't exist
                    eventHandler = formModel.on.calls[2].args[1];
                    spyOn(formView, "hideLoadingIndicator").andCallFake(function () { });

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

            describe("has a updateAttribute function that", function () {
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
                    expect(formModel.set.mostRecentCall.args.length).toEqual(2);
                    expect(formModel.set.mostRecentCall.args[0]).toEqual(key);
                    expect(formModel.set.mostRecentCall.args[1]).toEqual(value);
                });
            });

            describe("has a formatRequiredFields function that", function () {
                beforeEach(function () {
                    spyOn(mockUtils._, "each").andCallThrough();

                    formView.$el.html(mockTemplate);
                    formView.formatRequiredFields();
                });

                afterEach(function () {
                    formView.$el.html("");
                });

                it("is defined", function () {
                    expect(formView.formatRequiredFields).toBeDefined();
                });

                it("is a function", function () {
                    expect(formView.formatRequiredFields).toEqual(jasmine.any(Function));
                });

                it("should call utils._.each on the model's validation object", function () {
                    expect(mockUtils._.each).toHaveBeenCalled();
                    expect(mockUtils._.each.mostRecentCall.args.length).toEqual(3);
                    expect(mockUtils._.each.mostRecentCall.args[0]).toEqual(formView.model.validation);
                    expect(mockUtils._.each.mostRecentCall.args[1]).toEqual(jasmine.any(Function));
                    expect(mockUtils._.each.mostRecentCall.args[2]).toEqual(formView);
                });

                it("should add an asterisk to the label of any fields that have a validation rule of required:true",
                    function () {
                        expect(formView.$el.find("label[for='field1']")[0]).toContainText("*");
                        expect(formView.$el.find("label[for='field4']")[0]).toContainText("*");
                        expect(formView.$el.find("label[for='field5']")[0]).toContainText("*");
                    });

                it("should NOT add an asterisk to label of fields that do not have a validation rule of required:true",
                    function () {
                        expect(formView.$el.find("label[for='field2']")[0]).not.toContainText("*");
                    });

                it("should NOT add an asterisk to the label of any fields that do not have any validation rules",
                    function () {
                        expect(formView.$el.find("label[for='field3']")[0]).not.toContainText("*");
                    });
            });

            describe("has a convertErrorsToUnorderedList function that", function () {
                var mockErrors = {
                    field1: "Error Message 1",
                    field2: "Error Message 2",
                    field5: "Error Message 5"
                };

                beforeEach(function () {
                    formView.convertErrorsToUnorderedList(mockErrors);
                });

                it("is defined", function () {
                    expect(formView.convertErrorsToUnorderedList).toBeDefined();
                });

                it("is a function", function () {
                    expect(formView.convertErrorsToUnorderedList).toEqual(jasmine.any(Function));
                });

                it("should return expected result", function () {
                    var expectedValue = "<ul><li>Error Message 1</li>" +
                                        "<li>Error Message 2</li>" +
                                        "<li>Error Message 5</li></ul>",
                        actualValue = formView.convertErrorsToUnorderedList(mockErrors);
                    expect(actualValue).toEqual(expectedValue);
                });
            });

            describe("has a resetForm function that", function () {
                beforeEach(function () {
                    formView.$el.html(mockTemplate);
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
                    spyOn(formView.$el.find("form")[0], "reset").andCallFake(function () { });
                    formView.resetForm();

                    expect(formView.$el.find("form")[0].reset).toHaveBeenCalledWith();
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

                    spyOn(formView, "updateAttribute").andCallThrough();
                    formView.handleInputChanged(mockEvent);

                    expect(formView.updateAttribute).toHaveBeenCalled();
                    expect(formView.updateAttribute.mostRecentCall.args.length).toEqual(2);
                    expect(formView.updateAttribute.mostRecentCall.args[0]).toEqual(mockEvent.target.name);
                    expect(formView.updateAttribute.mostRecentCall.args[1]).toEqual(mockEvent.target.value);
                });
            });

            describe("has a handleValidationError function that", function () {
                var mockConvertedErrors = "",
                    mockErrors = {
                        field1: "Error Message 1",
                        field2: "Error Message 2",
                        field5: "Error Message 5"
                    };

                beforeEach(function () {
                    spyOn(mockFacade, "publish").andCallThrough();
                    spyOn(formView, "convertErrorsToUnorderedList").andCallFake(
                        function () {
                            return mockConvertedErrors;
                        }
                    );

                    formView.handleValidationError(formModel, mockErrors);
                });

                it("is defined", function () {
                    expect(formView.handleValidationError).toBeDefined();
                });

                it("is a function", function () {
                    expect(formView.handleValidationError).toEqual(jasmine.any(Function));
                });

                it("should call convertErrorsToUnorderedList", function () {
                    expect(formView.convertErrorsToUnorderedList).toHaveBeenCalledWith(mockErrors);
                });

                it("should call publish on the facade", function () {
                    var appALertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.mostRecentCall.args.length).toEqual(3);
                    expect(mockFacade.publish.mostRecentCall.args[0]).toEqual("app");
                    expect(mockFacade.publish.mostRecentCall.args[1]).toEqual("alert");

                    appALertOptions = mockFacade.publish.mostRecentCall.args[2];
                    expect(appALertOptions.title).toEqual(globals.VALIDATION_ERRORS.TITLE);
                    expect(appALertOptions.message).toEqual(globals.VALIDATION_ERRORS.HEADER + mockConvertedErrors);
                    expect(appALertOptions.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                });
            });

            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").andCallThrough();
                    spyOn(formModel, "save").andCallFake(function () { });
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
