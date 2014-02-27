define(["Squire", "mustache", "globals", "utils", "text!tmpl/login/page.html", "jasmine-jquery"],
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
                it("should call super()", function () {
                    // TODO: how do we test this again?
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

            describe("has a handleValidationError function that", function () {
                it("is defined", function () {
                    expect(loginView.handleValidationError).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.handleValidationError).toEqual(jasmine.any(Function));
                });

                // TODO: finish once this function has been finalized
            });
        });
    });
