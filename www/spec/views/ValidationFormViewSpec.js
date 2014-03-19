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
            validationFormView;

        squire.mock("facade", mockFacade);
        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);

        describe("A Validation Form View", function () {
            beforeEach(function (done) {
                squire.require(["views/ValidationFormView"], function (ValidationFormView) {
                    validationFormView = new ValidationFormView({
                        model: formModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(validationFormView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(validationFormView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(validationFormView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(validationFormView.constructor).toEqual(jasmine.any(Function));
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(Backbone.Validation, "bind").and.callThrough();
                    spyOn(formModel, "on").and.callFake(function () { });
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(validationFormView, "pageCreate").and.callFake(function () { });
                    spyOn(mockUtils._, "bindAll").and.callFake(function () { });

                    validationFormView.initialize();
                });

                it("is defined", function () {
                    expect(validationFormView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(validationFormView.initialize).toEqual(jasmine.any(Function));
                });

                it("should bind the Backbone.Validation", function () {
                    expect(Backbone.Validation.bind).toHaveBeenCalledWith(validationFormView);
                });

                it("should call utils._.bindAll", function () {
                    expect(mockUtils._.bindAll).toHaveBeenCalled();

                    expect(mockUtils._.bindAll.calls.mostRecent().args.length).toEqual(2);
                    expect(mockUtils._.bindAll.calls.mostRecent().args[0]).toEqual(validationFormView);
                    expect(mockUtils._.bindAll.calls.mostRecent().args[1]).toEqual("handleValidationError");
                });

                it("should register a function as the handler for the invalid event", function () {
                    expect(formModel.on).toHaveBeenCalled();
                    expect(formModel.on.calls.mostRecent().args.length).toEqual(2);
                    expect(formModel.on.calls.mostRecent().args[0]).toEqual("invalid");
                    expect(formModel.on.calls.mostRecent().args[1]).toEqual(validationFormView.handleValidationError);
                });
            });

            describe("has a formatRequiredFields function that", function () {
                beforeEach(function () {
                    spyOn(mockUtils._, "each").and.callThrough();

                    validationFormView.$el.html(mockTemplate);
                    validationFormView.formatRequiredFields();
                });

                afterEach(function () {
                    validationFormView.$el.html("");
                });

                it("is defined", function () {
                    expect(validationFormView.formatRequiredFields).toBeDefined();
                });

                it("is a function", function () {
                    expect(validationFormView.formatRequiredFields).toEqual(jasmine.any(Function));
                });

                it("should call utils._.each on the model's validation object", function () {
                    expect(mockUtils._.each).toHaveBeenCalled();
                    expect(mockUtils._.each.calls.mostRecent().args.length).toEqual(3);
                    expect(mockUtils._.each.calls.mostRecent().args[0]).toEqual(validationFormView.model.validation);
                    expect(mockUtils._.each.calls.mostRecent().args[1]).toEqual(jasmine.any(Function));
                    expect(mockUtils._.each.calls.mostRecent().args[2]).toEqual(validationFormView);
                });

                it("should add an asterisk to the label of any fields that have a validation rule of required:true",
                    function () {
                        expect(validationFormView.$el.find("label[for='field1']")[0]).toContainText("*");
                        expect(validationFormView.$el.find("label[for='field4']")[0]).toContainText("*");
                        expect(validationFormView.$el.find("label[for='field5']")[0]).toContainText("*");
                    });

                it("should NOT add an asterisk to label of fields that do not have a validation rule of required:true",
                    function () {
                        expect(validationFormView.$el.find("label[for='field2']")[0]).not.toContainText("*");
                    });

                it("should NOT add an asterisk to the label of any fields that do not have any validation rules",
                    function () {
                        expect(validationFormView.$el.find("label[for='field3']")[0]).not.toContainText("*");
                    });
            });

            describe("has a convertErrorsToUnorderedList function that", function () {
                var mockErrors = {
                    field1: "Error Message 1",
                    field2: "Error Message 2",
                    field5: "Error Message 5"
                };

                beforeEach(function () {
                    validationFormView.convertErrorsToUnorderedList(mockErrors);
                });

                it("is defined", function () {
                    expect(validationFormView.convertErrorsToUnorderedList).toBeDefined();
                });

                it("is a function", function () {
                    expect(validationFormView.convertErrorsToUnorderedList).toEqual(jasmine.any(Function));
                });

                it("should return expected result", function () {
                    var expectedValue = "<ul><li>Error Message 1</li>" +
                            "<li>Error Message 2</li>" +
                            "<li>Error Message 5</li></ul>",
                        actualValue = validationFormView.convertErrorsToUnorderedList(mockErrors);
                    expect(actualValue).toEqual(expectedValue);
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
                    spyOn(mockFacade, "publish").and.callThrough();
                    spyOn(validationFormView, "convertErrorsToUnorderedList").and.callFake(
                        function () {
                            return mockConvertedErrors;
                        }
                    );

                    validationFormView.handleValidationError(formModel, mockErrors);
                });

                it("is defined", function () {
                    expect(validationFormView.handleValidationError).toBeDefined();
                });

                it("is a function", function () {
                    expect(validationFormView.handleValidationError).toEqual(jasmine.any(Function));
                });

                it("should call convertErrorsToUnorderedList", function () {
                    expect(validationFormView.convertErrorsToUnorderedList).toHaveBeenCalledWith(mockErrors);
                });

                it("should call publish on the facade", function () {
                    var appALertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                    appALertOptions = mockFacade.publish.calls.mostRecent().args[2];
                    expect(appALertOptions.title).toEqual(globals.VALIDATION_ERRORS.TITLE);
                    expect(appALertOptions.message).toEqual(globals.VALIDATION_ERRORS.HEADER + mockConvertedErrors);
                    expect(appALertOptions.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                });
            });
        });
    });
