define(["Squire", "backbone", "mustache", "text!tmpl/driver/search.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockBackbone = Backbone,
            mockMustache = Mustache,
            mockDriverSearchModel = {
                "filterFirstName"   : "Curly",
                "filterLastName"    : "Howard",
                "filterDriverId"    : null,
                "filterStatus"      : null,
                "filterDepartmentId": null
            },
            driverSearchModel = new Backbone.Model(),
            driverSearchView;

        squire.mock("backbone", mockBackbone);
        squire.mock("mustache", mockMustache);

        describe("A Driver Search View", function () {
            var jasmineAsync = new AsyncSpec(this);

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/DriverSearchView"],
                    function (DriverSearchView) {
                        loadFixtures("index.html");

                        driverSearchModel.set(mockDriverSearchModel);

                        driverSearchView =  new DriverSearchView({
                            model: driverSearchModel
                        });

                        done();
                    });
            });

            it("is defined", function () {
                expect(driverSearchView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(driverSearchView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(driverSearchView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(driverSearchView.el).toBe("#driverSearch");
                });

                it("should set el nodeName", function () {
                    expect(driverSearchView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(driverSearchView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").andCallThrough();
                    driverSearchView.initialize();
                });

                it("is defined", function () {
                    expect(driverSearchView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.initialize).toEqual(jasmine.any(Function));
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(driverSearchView.template);
                });
            });

            describe("has a render function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "render").andCallThrough();
                    driverSearchView.render();
                });

                it("is defined", function () {
                    expect(driverSearchView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(driverSearchView.template, driverSearchView.model.toJSON());
                });

                it("sets content", function () {
                    var expectedContent = Mustache.render(pageTemplate, driverSearchModel.toJSON()),
                        $content = driverSearchView.$el.find(":jqmData(role=content)");

                    expect($content[0]).toContainHtml(expectedContent);
                });
            });
        });
    });
