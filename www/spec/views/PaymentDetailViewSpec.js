define(["Squire", "backbone", "mustache", "globals", "utils", "models/UserModel",
        "text!tmpl/payment/paymentDetail.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, UserModel, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function () { }
            },
            mockMustache = Mustache,
            mockBankAccountModel = {
                "id"            : "3465",
                "name"          : "Bank Name",
                "defaultBank"   : false
            },
            bankAccountModel = new Backbone.Model(),
            mockPaymentModel = {
                "id"                : "13451345",
                "scheduledDate"     : "5/8/2014",
                "amount"            : 24356.56,
                "status"            : "Status",
                "confirmationNumber": "13451dvfgwdrfg23456"
            },
            paymentModel = new Backbone.Model(),
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
            paymentDetailView,
            PaymentDetailView;

        squire.mock("mustache", mockMustache);
        squire.mock("backbone", Backbone);
        squire.mock("facade", mockFacade);

        describe("A Payment Detail View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "./";

            beforeEach(function (done) {
                squire.require(["views/PaymentDetailView"], function (JasminePaymentDetailView) {
                    loadFixtures("index.html");

                    bankAccountModel.set(mockBankAccountModel);
                    paymentModel.set(mockPaymentModel);
                    paymentModel.set("bankAccount", bankAccountModel);
                    userModel.initialize(mockUserModel);

                    PaymentDetailView = JasminePaymentDetailView;
                    paymentDetailView = new PaymentDetailView({
                        model    : paymentModel,
                        userModel: userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(paymentDetailView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(paymentDetailView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(paymentDetailView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentDetailView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(paymentDetailView.el).toEqual("#paymentDetails");
                });

                it("should set el nodeName", function () {
                    expect(paymentDetailView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(paymentDetailView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(PaymentDetailView.__super__, "initialize").and.callFake(function () {});

                    paymentDetailView.initialize();
                });

                it("is defined", function () {
                    expect(paymentDetailView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentDetailView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(PaymentDetailView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(paymentDetailView.template);
                });

                it("should set userModel", function () {
                    expect(paymentDetailView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                var actualContent;

                beforeEach(function () {
                    actualContent = paymentDetailView.$el.find(":jqmData(role=content)");

                    spyOn(paymentDetailView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();

                    paymentDetailView.render();
                });

                it("is defined", function () {
                    expect(paymentDetailView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentDetailView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(paymentDetailView.template);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });
        });
    });
