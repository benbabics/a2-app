define(["Squire", "mustache", "jasmine-jquery", "backbone-validation"],
    function (Squire, Mustache) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            formModel = new Backbone.Model(),
            formView;

        squire.mock("mustache", mockMustache);

        describe("A Form View", function () {
            var jasmineAsync = new AsyncSpec(this);

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/FormView"], function (FormView) {
                    loadFixtures("index.html");

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
