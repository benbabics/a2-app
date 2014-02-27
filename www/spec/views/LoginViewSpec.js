define(["Squire", "mustache", "globals", "utils", "text!tmpl/login/page.html", "jasmine-jquery", "backbone-validation"],
    function (Squire, Mustache, globals, utils, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockLoginModel = {
                "username": "JoeUser",
                "password": "p@S$w0rd1"
            },
            loginModel = new Backbone.Model(),
            loginView;

        squire.mock("mustache", mockMustache);

        describe("A Login View", function () {
            var jasmineAsync = new AsyncSpec(this);

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/LoginView"], function (LoginView) {
                    loadFixtures("index.html");

                    loginModel.set(mockLoginModel);

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
                it("should call handleInputChanged when an input is changed", function () {
                    expect(loginView.events["change :input"]).toEqual("handleInputChanged");
                });

                it("should call submitLogin when submitLogin-btn is clicked", function () {
                    expect(loginView.events["click #submitLogin-btn"]).toEqual("submitLogin");
                });

                it("should call submitLogin when loginForm is submitted", function () {
                    expect(loginView.events["submit #loginForm"]).toEqual("submitLogin");
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
                    expect(loginView.el).toBe("#login");
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
                    spyOn(Backbone.Validation, "bind").andCallThrough();
                    spyOn(loginModel, "on").andCallFake(function () { });
                    spyOn(mockMustache, "parse").andCallThrough();
                    spyOn(loginView, "pageCreate").andCallFake(function () { });
                    loginView.initialize();
                });

                it("is defined", function () {
                    expect(loginView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.initialize).toEqual(jasmine.any(Function));
                });

                it("should bind the Backbone.Validation", function () {
                    expect(Backbone.Validation.bind).toHaveBeenCalledWith(loginView);
                });

                it("should register a function as the handler for the invalid event", function () {
                    expect(loginModel.on).toHaveBeenCalled();
                    expect(loginModel.on.calls[0].args.length).toEqual(2);
                    expect(loginModel.on.calls[0].args[0]).toEqual("invalid");
                    expect(loginModel.on.calls[0].args[1]).toEqual(loginView.handleValidationError);
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(loginView.template);
                });

                it("should call pageCreate()", function () {
                    expect(loginView.pageCreate).toHaveBeenCalledWith();
                });
            });

            describe("has a pageCreate function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "render").andCallThrough();
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
                    expect(mockMustache.render.mostRecentCall.args.length).toEqual(2);
                    expect(mockMustache.render.mostRecentCall.args[0]).toEqual(loginView.template);
                    expect(mockMustache.render.mostRecentCall.args[1]).toEqual(globals.login.configuration);
                });

                it("sets content", function () {
                    var expectedContent,
                        configuration,
                        $content = loginView.$el.find(":jqmData(role=content)");

                    configuration = utils.$.extend(true, globals.login.configuration, loginView.model.validation);
                    expectedContent = Mustache.render(pageTemplate, configuration);

                    expect($content[0]).toContainHtml(expectedContent);
                });
            });

            describe("has a updateAttribute function that", function () {
                it("is defined", function () {
                    expect(loginView.updateAttribute).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.updateAttribute).toEqual(jasmine.any(Function));
                });

                it("should set the attribute on the model with the new value", function () {
                    var key = "fakeKey",
                        value = "fakeValue";

                    spyOn(loginModel, "set");
                    loginView.updateAttribute(key, value);

                    expect(loginModel.set).toHaveBeenCalled();
                    expect(loginModel.set.mostRecentCall.args.length).toEqual(2);
                    expect(loginModel.set.mostRecentCall.args[0]).toEqual(key);
                    expect(loginModel.set.mostRecentCall.args[1]).toEqual(value);
                });
            });

            describe("has a handleInputChanged function that", function () {
                it("is defined", function () {
                    expect(loginView.handleInputChanged).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.handleInputChanged).toEqual(jasmine.any(Function));
                });

                it("should call updateAttribute", function () {
                    var mockEvent = {
                        "target"            : {
                            "name"  : "target_name",
                            "value" : "target_value"
                        }
                    };

                    spyOn(loginView, "updateAttribute").andCallThrough();
                    loginView.handleInputChanged(mockEvent);

                    expect(loginView.updateAttribute).toHaveBeenCalled();
                    expect(loginView.updateAttribute.mostRecentCall.args.length).toEqual(2);
                    expect(loginView.updateAttribute.mostRecentCall.args[0]).toEqual(mockEvent.target.name);
                    expect(loginView.updateAttribute.mostRecentCall.args[1]).toEqual(mockEvent.target.value);
                });
            });

            describe("has a handleValidationError function that", function () {
                it("is defined", function () {
                    expect(loginView.handleValidationError).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.handleValidationError).toEqual(jasmine.any(Function));
                });

                // TODO: finish once this function has been finalized
            });

            describe("has a submitLogin function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").andCallThrough();
                    spyOn(loginModel, "save").andCallFake(function () { });
                    loginView.submitLogin(mockEvent);
                });

                it("is defined", function () {
                    expect(loginView.submitLogin).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.submitLogin).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                it("should call save() on the model", function () {
                    expect(loginModel.save).toHaveBeenCalledWith();
                });
            });
        });
    });
