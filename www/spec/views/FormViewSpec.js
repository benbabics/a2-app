define(["Squire", "mustache", "utils", "jasmine-jquery", "backbone-validation"],
    function (Squire, Mustache, utils) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockUtils = utils,
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
                "</form>",
            MockModel = Backbone.Model.extend({
                validation: {
                    "field1": {
                        required: true
                    },
                    "field2": {
                        max: 100
                    }
                }
            }),
            formModel = new MockModel(),
            formView;

        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);

        describe("A Form View", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/FormView"], function (FormView) {

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

                it("should register a function as the handler for the invalid event", function () {
                    expect(formModel.on).toHaveBeenCalled();
                    expect(formModel.on.calls[0].args.length).toEqual(2);
                    expect(formModel.on.calls[0].args[0]).toEqual("invalid");
                    expect(formModel.on.calls[0].args[1]).toEqual(formView.handleValidationError);
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(formView.template);
                });

                it("should call pageCreate()", function () {
                    expect(formView.pageCreate).toHaveBeenCalledWith();
                });
            });

            describe("has a pageCreate function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "render").andCallThrough();
                    formView.initialize();
                });

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
                    });

                it("should NOT add an asterisk to the label of any fields that have a validation rule of required:true",
                    function () {
                        expect(formView.$el.find("label[for='field2']")[0]).not.toContainText("*");
                    });

                it("should NOT add an asterisk to the label of any fields that do not have any validation rules",
                    function () {
                        expect(formView.$el.find("label[for='field3']")[0]).not.toContainText("*");
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
