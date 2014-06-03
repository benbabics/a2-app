define(["Squire", "globals", "utils", "backbone", "mustache", "models/UserModel", "views/FormView",
        "text!tmpl/card/search.html", "text!tmpl/card/searchHeader.html", "jasmine-jquery"],
    function (Squire, globals, utils, Backbone, Mustache, UserModel, FormView, pageTemplate, searchHeaderTemplate) {

        "use strict";

        var squire = new Squire(),
            mockBackbone = Backbone,
            mockMustache = Mustache,
            mockUtils = utils,
            mockCardModel = {},
            cardModel = new Backbone.Model(),
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
                    },
                    permissions: [
                        "PERMISSION_1",
                        "PERMISSION_2",
                        "PERMISSION_3"
                    ]
                 }
            },
            userModel = UserModel.getInstance(),
            CardSearchView,
            cardSearchView;

        squire.mock("backbone", mockBackbone);
        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("views/FormView", FormView);
        squire.mock("models/UserModel", UserModel);

        describe("A Card Search View", function () {
            beforeEach(function (done) {
                squire.require(["views/CardSearchView"], function (JasmineCardSearchView) {
                    loadFixtures("../../../index.html");

                    CardSearchView = JasmineCardSearchView;

                    cardModel.set(mockCardModel);
                    userModel.parse(mockUserModel);

                    spyOn(UserModel, "getInstance").and.returnValue(userModel);

                    cardSearchView =  new CardSearchView({
                        model: cardModel,
                        userModel: userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(cardSearchView).toBeDefined();
            });

            it("looks like a FormView", function () {
                expect(cardSearchView instanceof FormView).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call submitForm when submitCardSearch-btn is clicked", function () {
                    expect(cardSearchView.events["click #submitCardSearch-btn"]).toEqual("submitForm");
                });

                it("should call submitForm when cardSearchForm is submitted", function () {
                    expect(cardSearchView.events["submit #cardSearchForm"]).toEqual("submitForm");
                });
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(cardSearchView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardSearchView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(cardSearchView.el).toEqual("#cardSearch");
                });

                it("should set el nodeName", function () {
                    expect(cardSearchView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(cardSearchView.template).toEqual(pageTemplate);
                });

                it("should set the headerTemplate", function () {
                    expect(cardSearchView.headerTemplate).toEqual(searchHeaderTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(CardSearchView.__super__, "initialize").and.callFake(function () {});
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(cardSearchView.$el, "on").and.callFake(function () {});
                    spyOn(mockUtils._, "bindAll").and.callFake(function () { });
                    cardSearchView.initialize();
                });

                it("is defined", function () {
                    expect(cardSearchView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardSearchView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(CardSearchView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should call utils._.bindAll", function () {
                    expect(mockUtils._.bindAll).toHaveBeenCalledWith(cardSearchView, "handlePageBeforeShow");
                });

                it("should parse the headerTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(cardSearchView.headerTemplate);
                });

                it("should call on() on $el", function () {
                    expect(cardSearchView.$el.on)
                        .toHaveBeenCalledWith("pagebeforeshow", cardSearchView.handlePageBeforeShow);
                });
            });

            describe("has a render function that", function () {
                beforeEach(function () {
                    spyOn(cardSearchView, "renderHeader").and.callFake(function () { });
                    spyOn(cardSearchView, "renderContent").and.callFake(function () { });

                    cardSearchView.render();
                });

                it("is defined", function () {
                    expect(cardSearchView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardSearchView.render).toEqual(jasmine.any(Function));
                });

                it("should call renderHeader", function () {
                    expect(cardSearchView.renderHeader).toHaveBeenCalledWith();
                });

                it("should call renderContent", function () {
                    expect(cardSearchView.renderContent).toHaveBeenCalledWith();
                });
            });

            describe("has a renderHeader function that", function () {
                var actualHeader;

                beforeEach(function () {
                    actualHeader = cardSearchView.$el.find(":jqmData(role=header)");
                    spyOn(cardSearchView.$el, "find").and.returnValue(actualHeader);
                    spyOn(actualHeader, "html").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(actualHeader, "trigger").and.callThrough();

                    cardSearchView.renderHeader();

                });

                it("is defined", function () {
                    expect(cardSearchView.renderHeader).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardSearchView.renderHeader).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the headerTemplate", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(cardSearchView.headerTemplate,
                        {
                            "permissions"   : userModel.get("selectedCompany").get("permissions")
                        });
                });

                it("should call the html function on the header", function () {
                    var expectedContent = Mustache.render(searchHeaderTemplate,
                        {
                            "permissions": userModel.get("selectedCompany").get("permissions")
                        });
                    expect(actualHeader.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call the trigger function on the header", function () {
                    expect(actualHeader.trigger).toHaveBeenCalledWith("create");
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    it("should include a link to the Card Add page if the user has the MOBILE_CARD_ADD permission",
                        function () {
                            cardSearchView.userModel.get("selectedCompany")
                                .set("permissions", {"MOBILE_CARD_ADD": true});
                            cardSearchView.renderHeader();

                            expect(actualHeader[0]).toContainElement("a[href='#cardAdd']");
                        });

                    it("should NOT include a link to the Card Add page if the user does NOT have the MOBILE_CARD_ADD permission",
                        function () {
                            cardSearchView.userModel.get("selectedCompany")
                                .set("permissions", {"MOBILE_CARD_ADD": false});
                            cardSearchView.renderHeader();

                            expect(actualHeader[0]).not.toContainElement("a[href='#cardAdd']");
                        });
                });
            });

            describe("has a renderContent function that", function () {
                var actualContent,
                    mockConfiguration = globals.cardSearch.configuration;

                beforeEach(function () {
                    actualContent = cardSearchView.$el.find(":jqmData(role=content)");

                    spyOn(cardSearchView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(cardSearchView, "getConfiguration").and.returnValue(mockConfiguration);
                    spyOn(actualContent, "trigger").and.callThrough();

                    cardSearchView.renderContent();
                });

                it("is defined", function () {
                    expect(cardSearchView.renderContent).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardSearchView.renderContent).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(cardSearchView.template, mockConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, mockConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(cardSearchView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardSearchView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when utils.size returns 1", function () {
                    beforeEach(function () {
                        spyOn(mockUtils._, "size").and.callFake(function () { return 1; });
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration,
                            departmentListValues = [],
                            actualConfiguration;

                        expectedConfiguration = utils._.extend({}, utils.deepClone(globals.cardSearch.configuration));

                        utils._.each(mockUserModel.selectedCompany.departments, function (department) {
                            departmentListValues.push({
                                "id"  : department.id,
                                "name": department.name
                            });
                        });

                        expectedConfiguration.departmentId.enabled = false;
                        expectedConfiguration.departmentId.values = departmentListValues;

                        actualConfiguration = cardSearchView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when utils.size returns > 1", function () {
                    beforeEach(function () {
                        spyOn(mockUtils._, "size").and.callFake(function () { return 2; });
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration,
                            departmentListValues = [],
                            actualConfiguration;

                        expectedConfiguration = utils._.extend({}, utils.deepClone(globals.cardSearch.configuration));
                        departmentListValues.push(globals.cardSearch.constants.ALL);

                        utils._.each(mockUserModel.selectedCompany.departments, function (department) {
                            departmentListValues.push({
                                "id"  : department.id,
                                "name": department.name
                            });
                        });

                        expectedConfiguration.departmentId.enabled = true;
                        expectedConfiguration.departmentId.values = departmentListValues;

                        actualConfiguration = cardSearchView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });

            describe("has a findDepartment function that", function () {
                var mockDepartmentId = "25621354",
                    mockDepartment = {
                        id: "134613456",
                        name: "UNASSIGNED",
                        visible: true
                    },
                    departments;

                beforeEach(function () {
                    departments = userModel.get("selectedCompany").get("departments");
                    spyOn(departments, "findWhere").and.returnValue(mockDepartment);
                });

                it("is defined", function () {
                    expect(cardSearchView.findDepartment).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardSearchView.findDepartment).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the departments collection", function () {
                    cardSearchView.findDepartment(mockDepartmentId);

                    expect(departments.findWhere).toHaveBeenCalledWith({"id": mockDepartmentId});
                });

                it("should return the expected value", function () {
                    var actualValue = cardSearchView.findDepartment(mockDepartmentId);

                    expect(actualValue).toEqual(mockDepartment);
                });
            });

            describe("has a pageBeforeShow function that", function () {
                beforeEach(function () {
                    spyOn(cardSearchView, "resetForm").and.callFake(function () { });

                    cardSearchView.pageBeforeShow();
                });

                it("is defined", function () {
                    expect(cardSearchView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardSearchView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call resetForm", function () {
                    expect(cardSearchView.resetForm).toHaveBeenCalledWith();
                });
            });

            describe("has a handlePageBeforeShow function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(cardSearchView, "pageBeforeShow").and.callFake(function () { });

                    cardSearchView.handlePageBeforeShow(mockEvent);
                });

                it("is defined", function () {
                    expect(cardSearchView.handlePageBeforeShow).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardSearchView.handlePageBeforeShow).toEqual(jasmine.any(Function));
                });

                it("should call pageBeforeShow", function () {
                    expect(cardSearchView.pageBeforeShow).toHaveBeenCalledWith();
                });
            });

            describe("has a handleInputChanged function that", function () {
                it("is defined", function () {
                    expect(cardSearchView.handleInputChanged).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardSearchView.handleInputChanged).toEqual(jasmine.any(Function));
                });

                describe("when the target name is departmentId", function () {
                    var mockEvent = {
                            "target"    : {
                                "name"  : "departmentId",
                                "value" : "mock department id"
                            }
                        },
                        mockDepartment = {
                            id: "134613456",
                            name: "UNASSIGNED",
                            visible: true
                        };

                    beforeEach(function () {
                        spyOn(cardSearchView, "findDepartment").and.returnValue(mockDepartment);
                        spyOn(cardSearchView, "updateAttribute").and.callFake(function () {});

                        cardSearchView.handleInputChanged(mockEvent);
                    });

                    it("should call findDepartment", function () {
                        expect(cardSearchView.findDepartment).toHaveBeenCalledWith(mockEvent.target.value);
                    });

                    it("should call updateAttribute", function () {
                        expect(cardSearchView.updateAttribute).toHaveBeenCalledWith("department", mockDepartment);
                    });
                });

                describe("when the target name is NOT departmentId", function () {
                    it("should call updateAttribute on super", function () {
                        var mockEvent = {
                            "target"            : {
                                "name"  : "target_name",
                                "value" : "target_value"
                            }
                        };

                        spyOn(CardSearchView.__super__, "handleInputChanged").and.callFake(function () {});
                        cardSearchView.handleInputChanged(mockEvent);

                        expect(CardSearchView.__super__.handleInputChanged).toHaveBeenCalledWith(mockEvent);
                    });
                });
            });

            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(cardSearchView, "trigger").and.callFake(function () { });

                    cardSearchView.submitForm(mockEvent);
                });

                it("is defined", function () {
                    expect(cardSearchView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardSearchView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                it("should trigger searchSubmitted", function () {
                    expect(cardSearchView.trigger).toHaveBeenCalledWith("searchSubmitted");
                });
            });
        });
    });
