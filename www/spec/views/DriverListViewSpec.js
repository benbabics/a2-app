define(["Squire", "utils", "backbone", "mustache", "models/UserModel", "text!tmpl/driver/searchResults.html",
    "text!tmpl/driver/searchResultsHeader.html", "jasmine-jquery"],
    function (Squire, utils, Backbone, Mustache, UserModel, pageTemplate, searchResultsHeaderTemplate) {

        "use strict";

        var squire = new Squire(),
            mockBackbone = Backbone,
            mockMustache = Mustache,
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    wexAccountNumber: "5764309",
                    driverIdLength: "4",
                    departments: [
                        {
                            id: "134613456",
                            name: "UNASSIGNED",
                            visible: true
                        },
                        {
                            id: "2456724567",
                            name: "Dewey, Cheetum and Howe",
                            visible: false
                        }
                    ]
                },
                permissions: [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ]
            },
            userModel = UserModel.getInstance(),
            driverListView;

        squire.mock("backbone", mockBackbone);
        squire.mock("mustache", mockMustache);

        describe("A Driver List View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/DriverListView"],
                    function (DriverListView) {
                        loadFixtures("index.html");

                        userModel.initialize(mockUserModel);

                        driverListView =  new DriverListView({
                            userModel: userModel
                        });

                        done();
                    });
            });

            it("is defined", function () {
                expect(driverListView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(driverListView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(driverListView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverListView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(driverListView.el).toEqual("#driverSearchResults");
                });

                it("should set el nodeName", function () {
                    expect(driverListView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(driverListView.template).toEqual(pageTemplate);
                });

                it("should set the headerTemplate", function () {
                    expect(driverListView.headerTemplate).toEqual(searchResultsHeaderTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    driverListView.initialize();
                });

                it("is defined", function () {
                    expect(driverListView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverListView.initialize).toEqual(jasmine.any(Function));
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(driverListView.template);
                });

                it("should parse the headerTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(driverListView.headerTemplate);
                });

                it("should set userModel", function () {
                    expect(driverListView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "render").and.callThrough();
                    driverListView.render();
                });

                it("is defined", function () {
                    expect(driverListView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverListView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the headerTemplate", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(driverListView.headerTemplate,
                        {
                            "permissions"   : userModel.get("permissions")
                        });
                });

                it("sets the header content", function () {
                    var expectedContent =
                            Mustache.render(searchResultsHeaderTemplate, {"permissions": userModel.get("permissions")}),
                        $header = driverListView.$el.find(":jqmData(role=header)");

                    expect($header[0]).toContainHtml(expectedContent);
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(driverListView.template);
                });

                it("sets content", function () {
                    var expectedContent = Mustache.render(pageTemplate),
                        $content = driverListView.$el.find(":jqmData(role=content)");

                    expect($content[0]).toContainHtml(expectedContent);
                });
            });
        });
    });
