define(["Squire", "mustache", "globals", "utils", "views/FormView", "jasmine-jquery", "backbone-validation"],
    function (Squire, Mustache, globals, utils, FormView) {

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
                    },
                    "field6": [
                        {
                            required: function () { return true; }
                        },
                        {
                            max: 50
                        }
                    ]
                }
            }),
            formModel = new MockModel(),
            ValidationFormView,
            validationFormView;

        squire.mock("facade", mockFacade);
        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("views/FormView", FormView);

        describe("A Validation Form View", function () {
            beforeEach(function (done) {
                squire.require(["views/ValidationFormView"], function (JasmineValidationFormView) {
                    ValidationFormView = JasmineValidationFormView;
                    validationFormView = new ValidationFormView({
                        model: formModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(validationFormView).toBeDefined();
            });

            it("looks like a FormView", function () {
                expect(validationFormView instanceof FormView).toBeTruthy();
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
                    spyOn(ValidationFormView.__super__, "initialize").and.callThrough();
                    spyOn(mockUtils._, "bindAll").and.callFake(function () { });

                    validationFormView.initialize();
                });

                it("is defined", function () {
                    expect(validationFormView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(validationFormView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(ValidationFormView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should call utils._.bindAll", function () {
                    expect(mockUtils._.bindAll).toHaveBeenCalledWith(validationFormView, "handleValidationError");
                });
            });

            describe("has a setModel function that", function () {
                beforeEach(function () {
                    spyOn(ValidationFormView.__super__, "setModel").and.callThrough();
                    spyOn(Backbone.Validation, "bind").and.callThrough();
                    spyOn(validationFormView, "listenTo").and.callFake(function () { });
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(validationFormView, "pageCreate").and.callFake(function () { });
                    spyOn(mockUtils._, "bindAll").and.callFake(function () { });

                    validationFormView.setModel(formModel);
                });

                it("is defined", function () {
                    expect(validationFormView.setModel).toBeDefined();
                });

                it("is a function", function () {
                    expect(validationFormView.setModel).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(ValidationFormView.__super__.setModel).toHaveBeenCalledWith(formModel);
                });

                it("should bind the Backbone.Validation", function () {
                    expect(Backbone.Validation.bind).toHaveBeenCalledWith(validationFormView);
                });

                it("should register a function as the handler for the invalid event", function () {
                    expect(validationFormView.listenTo)
                        .toHaveBeenCalledWith(formModel, "invalid", validationFormView.handleValidationError);
                });
            });

            describe("has a formatRequiredFields function that", function () {
                beforeEach(function () {
                    spyOn(mockUtils._, "each").and.callThrough();
                    spyOn(validationFormView, "isRequired").and.callThrough();
                    spyOn(validationFormView, "formatAsRequired").and.callThrough();

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
                    expect(mockUtils._.each.calls.argsFor(0).length).toEqual(3);
                    expect(mockUtils._.each.calls.argsFor(0)[0]).toEqual(validationFormView.model.validation);
                    expect(mockUtils._.each.calls.argsFor(0)[1]).toEqual(jasmine.any(Function));
                    expect(mockUtils._.each.calls.argsFor(0)[2]).toEqual(validationFormView);
                });

                it("should call utils._.each on the field's validation array", function () {
                    expect(mockUtils._.each).toHaveBeenCalled();
                    expect(mockUtils._.each.calls.argsFor(1).length).toEqual(3);
                    expect(mockUtils._.each.calls.argsFor(1)[0]).toEqual(validationFormView.model.validation.field6);
                    expect(mockUtils._.each.calls.argsFor(1)[1]).toEqual(jasmine.any(Function));
                    expect(mockUtils._.each.calls.argsFor(1)[2]).toEqual(validationFormView);
                });

                it("should call formatAsRequired for all fields that have a validation rule of required:true",
                    function () {
                        expect(validationFormView.formatAsRequired).toHaveBeenCalledWith("field1");
                        expect(validationFormView.formatAsRequired).toHaveBeenCalledWith("field4");
                        expect(validationFormView.formatAsRequired).toHaveBeenCalledWith("field5");
                        expect(validationFormView.formatAsRequired).toHaveBeenCalledWith("field6");
                    });

                it("should NOT call formatAsRequired for fields that do not have a validation rule of required:true",
                    function () {
                        expect(validationFormView.formatAsRequired).not.toHaveBeenCalledWith("field2");
                    });

                it("should NOT call formatAsRequired for fields that do not have validation rules",
                    function () {
                        expect(validationFormView.formatAsRequired).not.toHaveBeenCalledWith("field3");
                    });
            });

            describe("has a isRequired function that", function () {
                it("is defined", function () {
                    expect(validationFormView.isRequired).toBeDefined();
                });

                it("is a function", function () {
                    expect(validationFormView.isRequired).toEqual(jasmine.any(Function));
                });

                describe("when required is a function", function () {
                    var expectedValue = true,
                        validationRule = {
                            required: function () { return expectedValue; }
                        };

                    it("should call the required function", function () {
                        spyOn(validationRule, "required").and.callThrough();

                        validationFormView.isRequired(validationRule);

                        expect(validationRule.required).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        var actualValue = validationFormView.isRequired(validationRule);

                        expect(actualValue).toEqual(expectedValue);
                    });
                });

                describe("when required is NOT a function", function () {
                    var expectedValue = false,
                        validationRule = {
                            required: expectedValue
                        };

                    it("should return the expected value", function () {
                        var actualValue = validationFormView.isRequired(validationRule);

                        expect(actualValue).toEqual(expectedValue);
                    });
                });
            });

            describe("has a formatAsRequired function that", function () {
                beforeEach(function () {
                    validationFormView.$el.html(mockTemplate);
                    validationFormView.formatAsRequired("field1");
                });

                afterEach(function () {
                    validationFormView.$el.html("");
                });

                it("is defined", function () {
                    expect(validationFormView.formatAsRequired).toBeDefined();
                });

                it("is a function", function () {
                    expect(validationFormView.formatAsRequired).toEqual(jasmine.any(Function));
                });

                it("should add an asterisk to the label of field1", function () {
                    expect(validationFormView.$el.find("label[for='field1']")[0]).toContainText("*");
                });

                it("should NOT add an asterisk to label of any other field", function () {
                    expect(validationFormView.$el.find("label[for='field2']")[0]).not.toContainText("*");
                    expect(validationFormView.$el.find("label[for='field3']")[0]).not.toContainText("*");
                    expect(validationFormView.$el.find("label[for='field4']")[0]).not.toContainText("*");
                    expect(validationFormView.$el.find("label[for='field5']")[0]).not.toContainText("*");
                });
            });

            describe("has a convertArrayToUnorderedList function that", function () {
                var mockErrors = {
                    field1: "Error Message 1",
                    field2: "Error Message 2",
                    field5: "Error Message 5"
                };

                beforeEach(function () {
                    validationFormView.convertArrayToUnorderedList(mockErrors);
                });

                it("is defined", function () {
                    expect(validationFormView.convertArrayToUnorderedList).toBeDefined();
                });

                it("is a function", function () {
                    expect(validationFormView.convertArrayToUnorderedList).toEqual(jasmine.any(Function));
                });

                it("should return expected result", function () {
                    var expectedValue = "<ul><li>Error Message 1</li>" +
                            "<li>Error Message 2</li>" +
                            "<li>Error Message 5</li></ul>",
                        actualValue = validationFormView.convertArrayToUnorderedList(mockErrors);
                    expect(actualValue).toEqual(expectedValue);
                });
            });

            describe("has a handleValidationWarning function that", function () {
                var mockConvertedWarnings = "",
                    mockWarnings = {
                        field1: "Warning Message 1",
                        field2: "Warning Message 2"
                    },
                    mockCallback = function () { return true; };

                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();
                    spyOn(validationFormView, "convertArrayToUnorderedList").and.callFake(
                        function () {
                            return mockConvertedWarnings;
                        }
                    );

                    validationFormView.handleValidationWarning(formModel, mockWarnings, mockCallback);
                });

                it("is defined", function () {
                    expect(validationFormView.handleValidationWarning).toBeDefined();
                });

                it("is a function", function () {
                    expect(validationFormView.handleValidationWarning).toEqual(jasmine.any(Function));
                });

                it("should call convertArrayToUnorderedList", function () {
                    expect(validationFormView.convertArrayToUnorderedList).toHaveBeenCalledWith(mockWarnings);
                });

                it("should call publish on the facade", function () {
                    var appAlertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                    appAlertOptions = mockFacade.publish.calls.mostRecent().args[2];
                    expect(appAlertOptions.title).toEqual(globals.VALIDATION_WARNINGS.TITLE);
                    expect(appAlertOptions.message).toEqual(globals.VALIDATION_WARNINGS.HEADER +
                        mockConvertedWarnings + globals.VALIDATION_WARNINGS.FOOTER);
                    expect(appAlertOptions.primaryBtnLabel).toEqual(globals.VALIDATION_WARNINGS.PRIMARY_BUTTON_TEXT);
                    expect(appAlertOptions.primaryBtnHandler).toEqual(mockCallback);
                    expect(appAlertOptions.secondaryBtnLabel).toEqual(globals.VALIDATION_WARNINGS.SECONDARY_BUTTON_TEXT);
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
                    spyOn(validationFormView, "convertArrayToUnorderedList").and.callFake(
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

                it("should call convertArrayToUnorderedList", function () {
                    expect(validationFormView.convertArrayToUnorderedList).toHaveBeenCalledWith(mockErrors);
                });

                it("should call publish on the facade", function () {
                    var appAlertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                    appAlertOptions = mockFacade.publish.calls.mostRecent().args[2];
                    expect(appAlertOptions.title).toEqual(globals.VALIDATION_ERRORS.TITLE);
                    expect(appAlertOptions.message).toEqual(globals.VALIDATION_ERRORS.HEADER + mockConvertedErrors);
                    expect(appAlertOptions.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                });
            });
        });
    });
