define(["Squire", "backbone", "mustache", "globals", "text!tmpl/login/page.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function (channel, event) { }
            },
            mockMustache = Mustache,
            mockLoginModel = {
                "username": "JoeUser",
                "password": "p@S$w0rd1"
            },
            loginModel = new Backbone.Model(),
            loginView,
            LoginView;

        squire.mock("mustache", mockMustache);
        squire.mock("backbone", Backbone);
        squire.mock("facade", mockFacade);

        describe("A Login View", function () {
            var jasmineAsync = new AsyncSpec(this);

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/LoginView"], function (JasmineLoginView) {
                    loadFixtures("index.html");

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
                    spyOn(LoginView.__super__, "initialize").andCallFake(function () {});

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
                beforeEach(function () {
                    spyOn(mockMustache, "render").andCallThrough();
                    spyOn(loginView, "formatRequiredFields").andCallThrough();
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

                it("should set the content", function () {
                    var $content = loginView.$el.find(":jqmData(role=content)"),
                        expectedContent = Mustache.render(pageTemplate, globals.login.configuration);

                    expect($content[0]).toContainHtml(expectedContent);
                });

                it("should call formatRequiredFields()", function () {
                    expect(loginView.formatRequiredFields).toHaveBeenCalledWith();
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

            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockFacade, "publish").andCallFake(function () { });
                    spyOn(LoginView.__super__, "submitForm").andCallFake(function () {});

                    loginView.submitForm(mockEvent);
                });

                it("is defined", function () {
                    expect(loginView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(LoginView.__super__.submitForm).toHaveBeenCalledWith(mockEvent);
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.mostRecentCall.args.length).toEqual(2);
                    expect(mockFacade.publish.mostRecentCall.args[0]).toEqual("home");
                    expect(mockFacade.publish.mostRecentCall.args[1]).toEqual("navigate");
                });
            });
        });
    });
