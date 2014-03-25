define(["Squire", "backbone", "mustache", "globals", "utils", "text!tmpl/driver/driverAdd.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockUserModel = {
                "authenticated": "true",
                "email": "mobiledevelopment@wexinc.com"
            },
            mockDriverAddModel = {
                driverId     : "13465134561",
                firstName    : "First Name",
                middleInitial: "X",
                lastName     : "Last Name",
                departmentId : "52v4612345"
            },
            driverAddModel = new Backbone.Model(),
            userModel = new Backbone.Model(),
            driverAddView,
            DriverAddView;

        squire.mock("mustache", mockMustache);
        squire.mock("backbone", Backbone);

        describe("A Driver Add View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/DriverAddView"], function (JasmineDriverAddView) {
                    loadFixtures("index.html");

                    driverAddModel.set(mockDriverAddModel);
                    userModel.set(mockUserModel);

                    DriverAddView = JasmineDriverAddView;
                    driverAddView = new DriverAddView({
                        model: driverAddModel,
                        userModel: userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(driverAddView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(driverAddView instanceof Backbone.View).toBeTruthy();
            });

            describe("has events that", function () {
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(driverAddView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(driverAddView.el).toEqual("#driverAdd");
                });

                it("should set el nodeName", function () {
                    expect(driverAddView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(driverAddView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(DriverAddView.__super__, "initialize").and.callFake(function () {});

                    driverAddView.initialize();
                });

                it("is defined", function () {
                    expect(driverAddView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(DriverAddView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(driverAddView.template);
                });

                it("should set userModel", function () {
                    expect(driverAddView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                var actualContent,
                    expectedConfiguration;

                beforeEach(function () {
                    expectedConfiguration = utils._.extend({}, utils.deepClone(globals.driverAdd.configuration));

                    actualContent = driverAddView.$el.find(":jqmData(role=content)");
                    spyOn(driverAddView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(driverAddView, "getConfiguration").and.callFake(function() { return expectedConfiguration; });
                    spyOn(driverAddView, "formatRequiredFields").and.callThrough();

                    driverAddView.render();
                });

                it("is defined", function () {
                    expect(driverAddView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.render).toEqual(jasmine.any(Function));
                });

                it("should call getConfiguration", function () {
                    expect(driverAddView.getConfiguration).toHaveBeenCalledWith();
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalled();
                    expect(mockMustache.render.calls.mostRecent().args.length).toEqual(2);
                    expect(mockMustache.render.calls.mostRecent().args[0]).toEqual(driverAddView.template);
                    expect(mockMustache.render.calls.mostRecent().args[1]).toEqual(expectedConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, expectedConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call formatRequiredFields()", function () {
                    expect(driverAddView.formatRequiredFields).toHaveBeenCalledWith();
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(driverAddView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.getConfiguration).toEqual(jasmine.any(Function));
                });

                it("should return the expected result", function () {
                    var expectedConfiguration,
                        actualConfiguration;

                    expectedConfiguration = utils._.extend({}, utils.deepClone(globals.driverAdd.configuration));

                    actualConfiguration = driverAddView.getConfiguration();

                    expect(actualConfiguration).toEqual(expectedConfiguration);
                });
            });

            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(driverAddModel, "save").and.callFake(function () { });
                    driverAddView.submitForm(mockEvent);
                });

                it("is defined", function () {
                    expect(driverAddView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                describe("when calling save() on the model", function () {
                    it("should send the model as the first argument", function () {
                        expect(driverAddModel.save).toHaveBeenCalled();
                        expect(driverAddModel.save.calls.mostRecent().args.length).toEqual(2);
                        expect(driverAddModel.save.calls.mostRecent().args[0]).toEqual(driverAddModel.toJSON());
                    });

                    describe("sends as the second argument the options object with a success callback that",
                        function () {
                            var response = {},
                                model,
                                options;

                            beforeEach(function () {
                                spyOn(driverAddView, "trigger").and.callFake(function () { });

                                options = driverAddModel.save.calls.mostRecent().args[1];
                                options.success.call(driverAddView, model, response);
                            });

                            it("should trigger driverAddSuccess", function () {
                                expect(driverAddView.trigger).toHaveBeenCalled();
                                expect(driverAddView.trigger.calls.mostRecent().args.length).toEqual(2);
                                expect(driverAddView.trigger.calls.mostRecent().args[0]).toEqual("driverAddSuccess");
                                expect(driverAddView.trigger.calls.mostRecent().args[1]).toEqual(response);
                            });
                        }
                    );
                });
            });
        });
    });
