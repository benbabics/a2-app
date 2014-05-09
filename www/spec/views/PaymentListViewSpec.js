define(["Squire", "globals", "utils", "backbone", "mustache", "models/UserModel",
        "text!tmpl/payment/searchResults.html", "jasmine-jquery"],
    function (Squire, globals, utils, Backbone, Mustache, UserModel, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockBackbone = Backbone,
            mockMustache = Mustache,
            paymentModel = new Backbone.Model(),
            paymentCollection = new Backbone.Collection(),
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                hasMultipleAccounts: false,
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "3673683",
                    wexAccountNumber: "5764309",
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
                    ],
                    requiredFields: [
                        "REQUIRED_FIELD_1",
                        "REQUIRED_FIELD_2",
                        "REQUIRED_FIELD_3"
                    ],
                    settings: {
                        cardSettings: {
                            customVehicleIdMaxLength: 17,
                            licensePlateNumberMaxLength: 10,
                            licensePlateStateFixedLength: 2,
                            vehicleDescriptionMaxLength: 17,
                            vinFixedLength: 17
                        },
                        driverSettings: {
                            idFixedLength: 4,
                            firstNameMaxLength: 11,
                            middleNameMaxLength: 1,
                            lastNameMaxLength: 12
                        }
                    }
                },
                permissions: [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ]
            },
            userModel = UserModel.getInstance(),
            mockNode = document.createElement("li"),
            mockPaymentView = {
                el: mockNode,
                constructor: function () { },
                initialize: function () { },
                render: function () { return mockPaymentView; }
            },
            paymentListView;

        squire.mock("backbone", mockBackbone);
        squire.mock("mustache", mockMustache);
        squire.mock("views/PaymentView", Squire.Helpers.returns(mockPaymentView));

        describe("A Payment List View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/PaymentListView"], function (PaymentListView) {
                    //TODO - Fix - Loading fixtures causes phantomjs to hang
                    if (window._phantom === undefined) {
                        loadFixtures("index.html");
                    }

                    userModel.initialize(mockUserModel);
                    paymentCollection.add(paymentModel);

                    paymentListView =  new PaymentListView({
                        collection: paymentCollection,
                        userModel : userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(paymentListView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(paymentListView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(paymentListView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentListView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(paymentListView.el).toEqual("#paymentHistory");
                });

                it("should set el nodeName", function () {
                    expect(paymentListView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(paymentListView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    paymentListView.initialize();
                });

                it("is defined", function () {
                    expect(paymentListView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentListView.initialize).toEqual(jasmine.any(Function));
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(paymentListView.template);
                });

                it("should set userModel", function () {
                    expect(paymentListView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                var actualContent,
                    actualList;

                beforeEach(function () {
                    actualContent = paymentListView.$el.find(":jqmData(role=content)");
                    actualList = actualContent.find("#paymentSearchResultList");

                    spyOn(paymentListView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "find").and.returnValue(actualList);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(paymentCollection, "each").and.callThrough();
                    spyOn(actualList, "empty").and.callFake(function () { });
                    spyOn(actualList, "append").and.callFake(function () { });

                    paymentListView.render();
                });

                it("is defined", function () {
                    expect(paymentListView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentListView.render).toEqual(jasmine.any(Function));
                });

                it("should call empty on the list", function () {
                    expect(actualList.empty).toHaveBeenCalledWith();
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(paymentListView.template);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call each on the collection sending a function", function () {
                    expect(paymentCollection.each).toHaveBeenCalled();
                    expect(paymentCollection.each.calls.argsFor(0).length).toEqual(1);
                    expect(paymentCollection.each.calls.argsFor(0)[0]).toEqual(jasmine.any(Function));
                });

                it("should append a document fragment of all the new PaymentViews to the list", function () {
                    expect(actualList.append).toHaveBeenCalled();
                    expect(actualList.append.calls.argsFor(0).length).toEqual(1);

                    // The argument is a document fragment containing the PaymentView elements
                    expect(actualList.append.calls.argsFor(0)[0].nodeName).toEqual("#document-fragment");
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });
        });
    });
