define(["Squire", "mustache", "text!tmpl/login/page.html", "jasmine-jquery"],
    function (Squire, Mustache, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
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

                    loginView = new LoginView();

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
                    expect(mockMustache.render).toHaveBeenCalledWith(loginView.template);
                });

                it("sets content", function () {
                    var expectedContent = Mustache.render(pageTemplate),
                        $content = loginView.$el.find(":jqmData(role=content)");

                    expect($content[0]).toContainHtml(expectedContent);
                });
            });
        });
    });
