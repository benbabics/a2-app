define(["backbone", "Squire", "mustache", "globals", "utils", "text!tmpl/home/page.html", "jasmine-jquery"],
    function (Backbone, Squire, Mustache, globals, utils, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockUserModel = {
                "authenticated"      : true,
                "firstName"          : "Bob",
                "email"              : "bobsmith@someplace.com",
                "hasMultipleAccounts": true,
                "selectedCompany"    : {
                    "name"            : "Bob's Company",
                    "wexAccountNumber": "1234567890"
                },
                "permissions"        : { }
            },
            userModel = new Backbone.Model(),
            homeView,
            HomeView;

        squire.mock("backbone", Backbone);
        squire.mock("mustache", mockMustache);

        describe("A Home View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/HomeView"], function (JasmineHomeView) {
                    loadFixtures("index.html");

                    userModel.set(mockUserModel);

                    HomeView = JasmineHomeView;
                    homeView = new HomeView({
                        model: userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(homeView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(homeView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(homeView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(homeView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(homeView.el).toEqual("#home");
                });

                it("should set el nodeName", function () {
                    expect(homeView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(homeView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();

                    homeView.initialize();
                });

                it("is defined", function () {
                    expect(homeView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(homeView.initialize).toEqual(jasmine.any(Function));
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(homeView.template);
                });
            });

            describe("has a render function that", function () {
                var actualContent;

                beforeEach(function () {
                    spyOn(mockMustache, "render").and.callThrough();

                    homeView.initialize();
                    homeView.render();

                    actualContent = homeView.$el.find(":jqmData(role=content)");
                });

                it("is defined", function () {
                    expect(homeView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(homeView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalled();
                    expect(mockMustache.render.calls.mostRecent().args.length).toEqual(2);
                    expect(mockMustache.render.calls.mostRecent().args[0]).toEqual(homeView.template);
                    expect(mockMustache.render.calls.mostRecent().args[1]).toEqual(userModel.toJSON());
                });

                it("sets content", function () {
                    var expectedContent;

                    expectedContent = Mustache.render(pageTemplate);

                    expect(actualContent[0]).toContainHtml(expectedContent);
                });

                describe("when dynamically rending the template based on the model data", function () {
                    it("should contain content if the user is authenticated", function () {
                        homeView.model.set("authenticated", true);
                        homeView.render();

                        expect(actualContent[0]).not.toBeEmpty();
                    });

                    it("should NOT contain any content if the user is not authenticated", function () {
                        homeView.model.set("authenticated", false);
                        homeView.render();

                        expect(actualContent[0]).toBeEmpty();
                    });

                    it("should include a link to the hierarchyManager if the user has multiple accounts", function () {
                        homeView.model.set("hasMultipleAccounts", true);
                        homeView.render();

                        expect(actualContent[0]).toContainElement("a[href='#hierarchyManager']");
                    });

                    it("should NOT include a link to the hierarchyManager if the user has multiple accounts", function () {
                        homeView.model.set("hasMultipleAccounts", false);
                        homeView.render();

                        expect(actualContent[0]).not.toContainElement("a[href='#hierarchyManager']");
                    });

                    it("should include a link to the Invoice page if the user has the MOBILE_PAYMENT_VIEW permission", function () {
                        homeView.model.set("permissions", {"MOBILE_PAYMENT_VIEW": true});
                        homeView.render();

                        expect(actualContent[0]).toContainElement("a[href='#invoices']");
                    });

                    it("should NOT include a link to the Invoice page if the user does NOT have the MOBILE_PAYMENT_VIEW permission", function () {
                        homeView.model.set("permissions", {"MOBILE_PAYMENT_VIEW": false});
                        homeView.render();

                        expect(actualContent[0]).not.toContainElement("a[href='#invoices']");
                    });

                    it("should include a link to the Cards page if the user has the MOBILE_CARD_VIEW permission", function () {
                        homeView.model.set("permissions", {"MOBILE_CARD_VIEW": true});
                        homeView.render();

                        expect(actualContent[0]).toContainElement("a[href='#cards']");
                    });

                    it("should NOT include a link to the Cards page if the user does NOT have the MOBILE_CARD_VIEW permission", function () {
                        homeView.model.set("permissions", {"MOBILE_CARD_VIEW": false});
                        homeView.render();

                        expect(actualContent[0]).not.toContainElement("a[href='#cards']");
                    });

                    it("should include a link to the Driver Search page if the user has the MOBILE_DRIVER_FULL_VIEW permission", function () {
                        homeView.model.set("permissions", {"MOBILE_DRIVER_FULL_VIEW": true});
                        homeView.render();

                        expect(actualContent[0]).toContainElement("a[href='#driverSearch']");
                    });

                    it("should NOT include a link to the Driver Search page if the user does NOT have the MOBILE_DRIVER_FULL_VIEW permission", function () {
                        homeView.model.set("permissions", {"MOBILE_DRIVER_FULL_VIEW": false});
                        homeView.render();

                        expect(actualContent[0]).not.toContainElement("a[href='#driverSearch']");
                    });
                });
            });
        });
    });
