define(["Squire", "mustache", "globals", "utils", "jasmine-jquery"],
    function (Squire, Mustache, globals, utils) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockUtils = utils,
            mockTemplate =
                "<div>" +
                "<label for='field1'>Field1:</label>" +
                "<input type='text' name='field1' id='field1' />" +
                "</div>" +
                "<div>" +
                "<label for='field2'>Field2:</label>" +
                "<input type='text' name='field2' id='field2' />" +
                "</div>" +
                "<div>" +
                "<label for='field3'>Field3:</label>" +
                "<input type='text' name='field3' id='field3' />" +
                "</div>" +
                "<div>" +
                "<label for='field4'>Field4:</label>" +
                "<select name='field4' id='field4' />" +
                "<option value=''>- - Select - -</option>" +
                "</select>" +
                "</div>" +
                "<div>" +
                "<label for='field5'>Field5:</label>" +
                "<textarea name='field5' id='field5' /></textarea>" +
                "</div>",
            authorizationProfiles = new Backbone.Collection(),
            bankAccounts = new Backbone.Collection(),
            departments = new Backbone.Collection(),
            shippingMethods = new Backbone.Collection(),
            mockCompanyModel = {
                "name"                  : "Company Name",
                "accountId"             : "Account Id",
                "wexAccountNumber"      : "WEX Account Number",
                "requiredFields"        : globals.companyData.requiredFields,
                "settings"              : null,
                "defaultShippingAddress": null,
                "permissions"           : globals.companyData.permissions
            },
            companyModel = new Backbone.Model(),
            mockUserModel = {
                "authenticated"      : true,
                "firstName"          : "First Name",
                "email"              : "Last.First@wexinc.com",
                "hasMultipleAccounts": false
            },
            userModel = new Backbone.Model(),
            formModel = new Backbone.Model(),
            BaseView,
            baseView;

        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);

        describe("A Base View", function () {

            beforeEach(function (done) {
                squire.require(["views/BaseView", "views/AppView"], function (JasmineBaseView, AppView) {
                    var appView = new AppView();
                    appView.initialize();

                    companyModel.set(mockCompanyModel);
                    companyModel.set("authorizationProfiles", authorizationProfiles);
                    companyModel.set("bankAccounts", bankAccounts);
                    companyModel.set("departments", departments);
                    companyModel.set("shippingMethods", shippingMethods);

                    userModel.set(mockUserModel);
                    userModel.set("selectedCompany", companyModel);

                    BaseView = JasmineBaseView;
                    baseView = new BaseView({
                        model   : formModel,
                        userModel: userModel
                    });

                    baseView.template = mockTemplate;

                    done();
                });
            });

            it("is defined", function () {
                expect(baseView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(baseView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(baseView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.constructor).toEqual(jasmine.any(Function));
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(BaseView.__super__, "initialize").and.callFake(function () {});
                    spyOn(baseView, "setModel").and.callFake(function () { });
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(baseView, "pageCreate").and.callFake(function () { });

                    baseView.initialize();
                });

                it("is defined", function () {
                    expect(baseView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(BaseView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should call setModel()", function () {
                    expect(baseView.setModel).toHaveBeenCalledWith(formModel);
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(mockTemplate);
                });

                it("should set userModel", function () {
                    expect(baseView.userModel).toEqual(userModel);
                });

                it("should call pageCreate()", function () {
                    expect(baseView.pageCreate).toHaveBeenCalledWith();
                });
            });

            describe("has a setModel function that", function () {
                beforeEach(function () {
                    spyOn(baseView, "setupLoadingIndicatorOnModel").and.callFake(function () { });

                    baseView.setModel(formModel);
                });

                it("is defined", function () {
                    expect(baseView.setModel).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.setModel).toEqual(jasmine.any(Function));
                });

                it("should call setupLoadingIndicatorOnModel", function () {
                    expect(baseView.setupLoadingIndicatorOnModel).toHaveBeenCalledWith(formModel);
                });
            });

            describe("has a setupLoadingIndicatorOnModel function that", function () {
                beforeEach(function () {
                    spyOn(baseView, "listenTo").and.callFake(function () { });

                    baseView.setupLoadingIndicatorOnModel(formModel);
                });

                it("is defined", function () {
                    expect(baseView.setupLoadingIndicatorOnModel).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.setupLoadingIndicatorOnModel).toEqual(jasmine.any(Function));
                });

                it("should register a function as the handler for the request event", function () {
                    var eventHandler;

                    expect(baseView.listenTo).toHaveBeenCalledWith(formModel, "request", jasmine.any(Function));

                    eventHandler = baseView.listenTo.calls.argsFor(0)[2];
                    spyOn(baseView, "showLoadingIndicator").and.callFake(function () { });

                    eventHandler.apply(baseView);

                    expect(baseView.showLoadingIndicator).toHaveBeenCalledWith(true);
                });

                it("should register a function as the handler for the sync and error events", function () {
                    var eventHandler;

                    expect(baseView.listenTo).toHaveBeenCalledWith(formModel, "sync error", jasmine.any(Function));

                    eventHandler = baseView.listenTo.calls.argsFor(1)[2];
                    spyOn(baseView, "hideLoadingIndicator").and.callFake(function () { });

                    eventHandler.apply(baseView);

                    expect(baseView.hideLoadingIndicator).toHaveBeenCalledWith(true);
                });
            });

            describe("has a pageCreate function that", function () {
                it("is defined", function () {
                    expect(baseView.pageCreate).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.pageCreate).toEqual(jasmine.any(Function));
                });
            });

            describe("has a resetModel function that", function () {
                beforeEach(function () {
                    spyOn(formModel, "clear");
                    spyOn(formModel, "set");

                    baseView.resetModel();
                });

                it("is defined", function () {
                    expect(baseView.resetModel).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.resetModel).toEqual(jasmine.any(Function));
                });

                it("should call clear on the Model", function () {
                    expect(formModel.clear).toHaveBeenCalledWith();
                });

                describe("when model.defaults is NOT a function", function () {
                    it("should call set on the Model", function () {
                        formModel.defaults = {
                            "field1": null,
                            "field2": null
                        };

                        baseView.resetModel();

                        expect(formModel.set).toHaveBeenCalledWith(formModel.defaults);
                    });
                });

                describe("when model.defaults is a function", function () {
                    var mockDefaults = {
                        "field1": "asdfasdf",
                        "field2": null,
                        "field3": null
                    };

                    beforeEach(function () {
                        formModel.defaults = function () {
                            return mockDefaults;
                        };

                        spyOn(formModel, "defaults").and.callThrough();

                        baseView.resetModel();
                    });

                    it("should call defaults on the model", function () {
                        expect(formModel.defaults).toHaveBeenCalledWith();
                    });

                    it("should call set on the Model", function () {
                        expect(formModel.set).toHaveBeenCalledWith(mockDefaults);
                    });
                });
            });

            describe("has a findDefaultAuthorizationProfile function that", function () {
                var mockAuthorizationProfileModel = {
                        id     : 2457624567,
                        name   : "Mock Name",
                        productRestriction: 2134
                    },
                    authorizationProfiles;

                beforeEach(function () {
                    authorizationProfiles = userModel.get("selectedCompany").get("authorizationProfiles");
                    spyOn(authorizationProfiles, "at").and.returnValue(mockAuthorizationProfileModel);
                });

                it("is defined", function () {
                    expect(baseView.findDefaultAuthorizationProfile).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.findDefaultAuthorizationProfile).toEqual(jasmine.any(Function));
                });

                it("should call at on the departments collection", function () {
                    baseView.findDefaultAuthorizationProfile();

                    expect(authorizationProfiles.at).toHaveBeenCalledWith(0);
                });

                it("should return the expected value", function () {
                    var actualValue = baseView.findDefaultAuthorizationProfile();

                    expect(actualValue).toEqual(mockAuthorizationProfileModel);
                });
            });

            describe("has a findDefaultBankAccount function that", function () {
                var mockBankAccount = {
                        id: "134613456",
                        name: "UNASSIGNED",
                        defaultBank: true
                    },
                    bankAccounts,
                    actualValue;

                it("is defined", function () {
                    expect(baseView.findDefaultBankAccount).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.findDefaultBankAccount).toEqual(jasmine.any(Function));
                });

                describe("when findWhere on the bankAccounts collection returns a value", function () {
                    beforeEach(function () {
                        bankAccounts = userModel.get("selectedCompany").get("bankAccounts");
                        spyOn(bankAccounts, "findWhere").and.returnValue(mockBankAccount);
                        spyOn(bankAccounts, "at").and.returnValue(null);

                        actualValue = baseView.findDefaultBankAccount();
                    });

                    it("should call findWhere on the bankAccounts collection", function () {
                        expect(bankAccounts.findWhere).toHaveBeenCalledWith({"defaultBank": true});
                    });

                    it("should NOT call at on the bankAccounts collection", function () {
                        expect(bankAccounts.at).not.toHaveBeenCalled();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockBankAccount);
                    });
                });

                describe("when findWhere on the bankAccounts collection does NOT return a value", function () {
                    beforeEach(function () {
                        bankAccounts = userModel.get("selectedCompany").get("bankAccounts");
                        spyOn(bankAccounts, "findWhere").and.returnValue(null);
                        spyOn(bankAccounts, "at").and.returnValue(mockBankAccount);

                        actualValue = baseView.findDefaultBankAccount();
                    });

                    it("should call findWhere on the bankAccounts collection", function () {
                        expect(bankAccounts.findWhere).toHaveBeenCalledWith({"defaultBank": true});
                    });

                    it("should call at on the bankAccounts collection", function () {
                        expect(bankAccounts.at).toHaveBeenCalledWith(0);
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockBankAccount);
                    });
                });
            });

            describe("has a findDefaultDepartment function that", function () {
                var mockDepartment = {
                        id: "134613456",
                        name: "UNASSIGNED",
                        visible: true
                    },
                    departments,
                    actualValue;

                it("is defined", function () {
                    expect(baseView.findDefaultDepartment).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.findDefaultDepartment).toEqual(jasmine.any(Function));
                });

                describe("when findWhere on the departments collection returns a value", function () {
                    beforeEach(function () {
                        departments = userModel.get("selectedCompany").get("departments");
                        spyOn(departments, "findWhere").and.returnValue(mockDepartment);
                        spyOn(departments, "at").and.returnValue(null);

                        actualValue = baseView.findDefaultDepartment();
                    });

                    it("should call findWhere on the departments collection", function () {
                        expect(departments.findWhere).toHaveBeenCalledWith(
                            {
                                "visible": true,
                                "name"   : globals.APP.constants.DEFAULT_DEPARTMENT_NAME
                            }
                        );
                    });

                    it("should NOT call at on the departments collection", function () {
                        expect(departments.at).not.toHaveBeenCalled();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockDepartment);
                    });
                });

                describe("when findWhere on the departments collection does NOT returns a value", function () {
                    beforeEach(function () {
                        departments = userModel.get("selectedCompany").get("departments");
                        spyOn(departments, "findWhere").and.returnValue(null);
                        spyOn(departments, "at").and.returnValue(mockDepartment);

                        actualValue = baseView.findDefaultDepartment();
                    });

                    it("should call findWhere on the departments collection", function () {
                        expect(departments.findWhere).toHaveBeenCalledWith(
                            {
                                "visible": true,
                                "name"   : globals.APP.constants.DEFAULT_DEPARTMENT_NAME
                            }
                        );
                    });

                    it("should call at on the departments collection", function () {
                        expect(departments.at).toHaveBeenCalledWith(0);
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockDepartment);
                    });
                });
            });

            describe("has a findDefaultShippingMethod function that", function () {
                var mockShippingMethod = {
                        id: "134613456",
                        name: "UNASSIGNED",
                        visible: true
                    },
                    shippingMethods,
                    actualValue;

                it("is defined", function () {
                    expect(baseView.findDefaultShippingMethod).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.findDefaultShippingMethod).toEqual(jasmine.any(Function));
                });

                describe("when findWhere on the shippingMethods collection returns a value", function () {
                    beforeEach(function () {
                        shippingMethods = userModel.get("selectedCompany").get("shippingMethods");
                        spyOn(shippingMethods, "findWhere").and.returnValue(mockShippingMethod);
                        spyOn(shippingMethods, "at").and.returnValue(null);

                        actualValue = baseView.findDefaultShippingMethod();
                    });

                    it("should call findWhere on the shippingMethods collection", function () {
                        baseView.findDefaultShippingMethod();

                        expect(shippingMethods.findWhere).toHaveBeenCalledWith(
                            {
                                "id": globals.APP.constants.DEFAULT_SHIPPING_METHOD_NAME
                            }
                        );
                    });

                    it("should NOT call at on the shippingMethods collection", function () {
                        expect(shippingMethods.at).not.toHaveBeenCalled();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockShippingMethod);
                    });
                });

                describe("when findWhere on the shippingMethods collection does NOT return a value", function () {
                    beforeEach(function () {
                        shippingMethods = userModel.get("selectedCompany").get("shippingMethods");
                        spyOn(shippingMethods, "findWhere").and.returnValue(null);
                        spyOn(shippingMethods, "at").and.returnValue(mockShippingMethod);

                        actualValue = baseView.findDefaultShippingMethod();
                    });

                    it("should call findWhere on the shippingMethods collection", function () {
                        baseView.findDefaultShippingMethod();

                        expect(shippingMethods.findWhere).toHaveBeenCalledWith(
                            {
                                "id": globals.APP.constants.DEFAULT_SHIPPING_METHOD_NAME
                            }
                        );
                    });

                    it("should call at on the shippingMethods collection", function () {
                        expect(shippingMethods.at).toHaveBeenCalledWith(0);
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockShippingMethod);
                    });
                });
            });

            describe("has a findBankAccount function that", function () {
                var mockBankAccountId = "25621354",
                    mockBankAccount = {
                        id: "134613456",
                        name: "UNASSIGNED",
                        defaultBank: true
                    },
                    bankAccounts,
                    actualValue;

                beforeEach(function () {
                    bankAccounts = userModel.get("selectedCompany").get("bankAccounts");
                    spyOn(bankAccounts, "findWhere").and.returnValue(mockBankAccount);

                    actualValue = baseView.findBankAccount(mockBankAccountId);
                });

                it("is defined", function () {
                    expect(baseView.findBankAccount).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.findBankAccount).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the bankAccounts collection", function () {
                    expect(bankAccounts.findWhere).toHaveBeenCalledWith({"id": mockBankAccountId});
                });

                it("should return the expected value", function () {
                    expect(actualValue).toEqual(mockBankAccount);
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
                    expect(baseView.findDepartment).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.findDepartment).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the departments collection", function () {
                    baseView.findDepartment(mockDepartmentId);

                    expect(departments.findWhere).toHaveBeenCalledWith(
                        {
                            "visible": true,
                            "id": mockDepartmentId
                        }
                    );
                });

                it("should return the expected value", function () {
                    var actualValue = baseView.findDepartment(mockDepartmentId);

                    expect(actualValue).toEqual(mockDepartment);
                });
            });

            describe("has a findShippingMethod function that", function () {
                var mockShippingMethodId = "25621354",
                    mockShippingMethod = {
                        id: "134613456",
                        name: "UNASSIGNED",
                        visible: true
                    },
                    shippingMethods;

                beforeEach(function () {
                    shippingMethods = userModel.get("selectedCompany").get("shippingMethods");
                    spyOn(shippingMethods, "findWhere").and.returnValue(mockShippingMethod);
                });

                it("is defined", function () {
                    expect(baseView.findShippingMethod).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.findShippingMethod).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the shippingMethods collection", function () {
                    baseView.findShippingMethod(mockShippingMethodId);

                    expect(shippingMethods.findWhere).toHaveBeenCalledWith(
                        {
                            "id": mockShippingMethodId
                        }
                    );
                });

                it("should return the expected value", function () {
                    var actualValue = baseView.findShippingMethod(mockShippingMethodId);

                    expect(actualValue).toEqual(mockShippingMethod);
                });
            });

            describe("has a getEarlistPaymentDate function that", function () {
                var mockMomentAfterAdd = {},
                    mockMoment = {
                        format: function () { return ""; },
                        add   : function () { return mockMomentAfterAdd; }
                    };

                it("is defined", function () {
                    expect(baseView.getEarlistPaymentDate).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseView.getEarlistPaymentDate).toEqual(jasmine.any(Function));
                });

                describe("when the day is Sunday", function () {
                    var actualValue;

                    beforeEach(function () {
                        spyOn(mockUtils, "moment").and.returnValue(mockMoment);
                        spyOn(mockMoment, "add").and.callThrough();
                        spyOn(mockMoment, "format").and.returnValue("Sun");

                        actualValue = baseView.getEarlistPaymentDate();
                    });

                    it("should call add on moment", function () {
                        expect(mockMoment.add).toHaveBeenCalledWith("days", 1);
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockMomentAfterAdd);
                    });
                });

                describe("when the day is Monday - Friday", function () {
                    var actualValue;

                    beforeEach(function () {
                        spyOn(mockUtils, "moment").and.returnValue(mockMoment);
                        spyOn(mockMoment, "add").and.callThrough();
                        spyOn(mockMoment, "format").and.returnValue(false);

                        actualValue = baseView.getEarlistPaymentDate();
                    });

                    it("should NOT call add on moment", function () {
                        expect(mockMoment.add).not.toHaveBeenCalled();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockMoment);
                    });
                });

                describe("when the day is Saturday", function () {
                    var actualValue;

                    beforeEach(function () {
                        spyOn(mockUtils, "moment").and.returnValue(mockMoment);
                        spyOn(mockMoment, "add").and.callThrough();
                        spyOn(mockMoment, "format").and.returnValue("Sat");

                        actualValue = baseView.getEarlistPaymentDate();
                    });

                    it("should call add on moment", function () {
                        expect(mockMoment.add).toHaveBeenCalledWith("days", 2);
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockMomentAfterAdd);
                    });
                });
            });
        });
    });
