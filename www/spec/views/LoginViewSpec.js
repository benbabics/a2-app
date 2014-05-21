define(["Squire", "backbone", "mustache", "globals", "text!tmpl/login/page.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function () { }
            },
            mockMustache = Mustache,
            mockLoginModel = {
                "userName": "JoeUser",
                "password": "p@S$w0rd1"
            },
            loginModel = new Backbone.Model(),
            loginView,
            LoginView;

        squire.mock("mustache", mockMustache);
        squire.mock("backbone", Backbone);
        squire.mock("facade", mockFacade);

        describe("A Login View", function () {
            beforeEach(function (done) {
                squire.require(["views/LoginView"], function (JasmineLoginView) {
                    loadFixtures("../../../index.html");

                    loginModel.set(mockLoginModel);

                    LoginView = JasmineLoginView;
                    loginView = new LoginView({
                        model: loginModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(loginView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(loginView instanceof Backbone.View).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call submitForm when submitLogin-btn is clicked", function () {
                    expect(loginView.events["click #submitLogin-btn"]).toEqual("submitForm");
                });

                it("should call submitForm when loginForm is submitted", function () {
                    expect(loginView.events["submit #loginForm"]).toEqual("submitForm");
                });
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(loginView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(loginView.el).toEqual("#login");
                });

                it("should set el nodeName", function () {
                    expect(loginView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(loginView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(LoginView.__super__, "initialize").and.callFake(function () {});

                    loginView.initialize();
                });

                it("is defined", function () {
                    expect(loginView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(LoginView.__super__.initialize).toHaveBeenCalledWith();
                });
            });

            describe("has a pageCreate function that", function () {
                var actualContent;

                beforeEach(function () {
                    actualContent = loginView.$el.find(":jqmData(role=content)");

                    spyOn(loginView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(loginView.$el, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(loginView, "formatRequiredFields").and.callThrough();
                    loginView.initialize();
                });

                it("is defined", function () {
                    expect(loginView.pageCreate).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.pageCreate).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalled();
                    expect(mockMustache.render.calls.mostRecent().args.length).toEqual(2);
                    expect(mockMustache.render.calls.mostRecent().args[0]).toEqual(loginView.template);
                    expect(mockMustache.render.calls.mostRecent().args[1]).toEqual(globals.login.configuration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, globals.login.configuration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call formatRequiredFields()", function () {
                    expect(loginView.formatRequiredFields).toHaveBeenCalledWith();
                });

                it("should call the trigger function on the $el", function () {
                    expect(loginView.$el.trigger).toHaveBeenCalledWith("create");
                });
            });

            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(loginModel, "save").and.callFake(function () { });
                    loginView.submitForm(mockEvent);
                });

                it("is defined", function () {
                    expect(loginView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                describe("when calling save() on the model", function () {
                    it("should send the model as the first argument", function () {
                        expect(loginModel.save).toHaveBeenCalled();
                        expect(loginModel.save.calls.mostRecent().args.length).toEqual(2);
                        expect(loginModel.save.calls.mostRecent().args[0]).toEqual(loginModel.toJSON());
                    });

                    describe("sends as the second argument the options object with a success callback that",
                        function () {
                            var model = {},
                                response = {},
                                options;

                            beforeEach(function () {
                                options = loginModel.save.calls.mostRecent().args[1];

                                spyOn(loginView, "trigger").and.callFake(function () { });
                                spyOn(loginModel, "clear").and.callFake(function () { });
                                spyOn(loginModel, "set").and.callFake(function () { });
                                spyOn(loginView, "resetForm").and.callFake(function () { });

                                options.success.call(loginView, model, response);
                            });

                            it("should trigger loginSuccess", function () {
                                expect(loginView.trigger).toHaveBeenCalled();
                                expect(loginView.trigger.calls.mostRecent().args.length).toEqual(2);
                                expect(loginView.trigger.calls.mostRecent().args[0]).toEqual("loginSuccess");
                                expect(loginView.trigger.calls.mostRecent().args[1]).toEqual(response);
                            });

                            it ("should clear the model", function () {
                                expect(loginModel.clear).toHaveBeenCalledWith();
                            });

                            it ("should reset the model with defaults", function () {
                                expect(loginModel.set).toHaveBeenCalledWith(loginModel.defaults);
                            });

                            it ("should reset the form", function () {
                                expect(loginView.resetForm).toHaveBeenCalledWith();
                            });

                        }
                    );

                    describe("sends as the second argument the options object with a error callback that", function () {
                        var options;

                        beforeEach(function () {
                            options = loginModel.save.calls.mostRecent().args[1];

                            spyOn(loginView, "trigger").and.callFake(function () { });

                            options.error.call(loginView);
                        });

                        it("should trigger loginFailure", function () {
                            expect(loginView.trigger).toHaveBeenCalled();
                            expect(loginView.trigger.calls.mostRecent().args.length).toEqual(1);
                            expect(loginView.trigger.calls.mostRecent().args[0]).toEqual("loginFailure");
                        });

                    });
                });
            });
        });
    });
