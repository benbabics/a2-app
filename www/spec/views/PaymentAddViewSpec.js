define(["Squire", "backbone", "mustache", "globals", "utils", "models/UserModel",
        "text!tmpl/payment/paymentAdd.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils,  UserModel, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockUtils = utils,
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
            mockPaymentModel = {},
            paymentModel = new Backbone.Model(),
            userModel = UserModel.getInstance(),
            paymentAddView,
            PaymentAddView;

        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("backbone", Backbone);

        describe("A Payment Add View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "./";

            beforeEach(function (done) {
                squire.require(["views/PaymentAddView"], function (JasminePaymentAddView) {
                    loadFixtures("index.html");

                    paymentModel.initialize(mockPaymentModel);
                    userModel.initialize(mockUserModel);

                    PaymentAddView = JasminePaymentAddView;
                    paymentAddView = new PaymentAddView({
                        model    : paymentModel,
                        userModel: userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(paymentAddView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(paymentAddView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(paymentAddView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(paymentAddView.el).toEqual("#paymentAdd");
                });

                it("should set el nodeName", function () {
                    expect(paymentAddView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(paymentAddView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(paymentAddView.$el, "on").and.callFake(function () {});
                    spyOn(PaymentAddView.__super__, "initialize").and.callFake(function () {});
                    spyOn(mockUtils._, "bindAll").and.callFake(function () { });

                    paymentAddView.initialize();
                });

                it("is defined", function () {
                    expect(paymentAddView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(PaymentAddView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should call utils._.bindAll", function () {
                    expect(mockUtils._.bindAll).toHaveBeenCalledWith(paymentAddView, "handlePageBeforeShow");
                });

                it("should set userModel", function () {
                    expect(paymentAddView.userModel).toEqual(userModel);
                });

                it("should call on() on $el", function () {
                    expect(paymentAddView.$el.on)
                        .toHaveBeenCalledWith("pagebeforeshow", paymentAddView.handlePageBeforeShow);
                });
            });

            describe("has a render function that", function () {
                var actualContent;

                beforeEach(function () {
                    actualContent = paymentAddView.$el.find(":jqmData(role=content)");
                    spyOn(paymentAddView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(paymentAddView, "resetModel").and.callFake(function () { });
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(paymentAddView, "formatRequiredFields").and.callThrough();

                    paymentAddView.render();
                });

                it("is defined", function () {
                    expect(paymentAddView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.render).toEqual(jasmine.any(Function));
                });

                it("should call resetModel", function () {
                    expect(paymentAddView.resetModel).toHaveBeenCalledWith();
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(paymentAddView.template);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call formatRequiredFields()", function () {
                    expect(paymentAddView.formatRequiredFields).toHaveBeenCalledWith();
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });

            describe("has a pageBeforeShow function that", function () {
                beforeEach(function () {
                    spyOn(paymentAddView, "resetForm").and.callFake(function () { });

                    paymentAddView.pageBeforeShow();
                });

                it("is defined", function () {
                    expect(paymentAddView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call resetForm", function () {
                    expect(paymentAddView.resetForm).toHaveBeenCalledWith();
                });
            });

            describe("has a handlePageBeforeShow function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(paymentAddView, "pageBeforeShow").and.callFake(function () { });

                    paymentAddView.handlePageBeforeShow(mockEvent);
                });

                it("is defined", function () {
                    expect(paymentAddView.handlePageBeforeShow).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.handlePageBeforeShow).toEqual(jasmine.any(Function));
                });

                it("should call pageBeforeShow", function () {
                    expect(paymentAddView.pageBeforeShow).toHaveBeenCalledWith();
                });
            });
        });
    });
