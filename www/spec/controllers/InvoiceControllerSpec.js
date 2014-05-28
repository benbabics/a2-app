define(["utils", "backbone", "globals", "Squire", "controllers/BaseController", "models/UserModel"],
    function (utils, Backbone, globals, Squire, BaseController, UserModel) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function () { }
            },
            mockUtils = utils,
            mockPaymentCollection = {
                reset: function () { },
                findWhere: function () { }
            },
            mockBankAccountModel = {
                "id"            : "3465",
                "name"          : "Bank Name",
                "defaultBank"   : false
            },
            bankAccountModel = new Backbone.Model(),
            mockInvoiceSummaryModel = {
                "invoiceId"         : "Invoice Id",
                "accountNumber"     : "Account Number",
                "availableCredit"   : 3245.56,
                "currentBalance"    : 357367.56,
                "currentBalanceAsOf": "Current Balance As Of Date",
                "paymentDueDate"    : "Payment Due Date",
                "minimumPaymentDue" : 234.45,
                "invoiceNumber"     : "Invoice Number",
                "closingDate"       : "Closing Date"
            },
            invoiceSummaryModel = new Backbone.Model(),
            mockMakePaymentAvailabilityModel = {
                "shouldDisplayDirectDebitEnabledMessage": false,
                "shouldDisplayBankAccountSetupMessage"  : false,
                "shouldDisplayOutstandingPaymentMessage": false,
                "makePaymentAllowed"                    : false
            },
            makePaymentAvailabilityModel = new Backbone.Model(),
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
                    },
                    permissions: [
                        "PERMISSION_1",
                        "PERMISSION_2",
                        "PERMISSION_3"
                    ]
                }
            },
            userModel = UserModel.getInstance(),
            mockInvoiceSummaryView = {
                $el: "",
                model: invoiceSummaryModel,
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                showLoadingIndicator: function () { },
                hideLoadingIndicator: function () { }
            },
            mockPaymentDetailView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { },
                showLoadingIndicator: function () { },
                hideLoadingIndicator: function () { },
                setModel: function () { }
            },
            mockPaymentListView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                showLoadingIndicator: function () { },
                hideLoadingIndicator: function () { }
            },
            mockPaymentAddView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { },
                showLoadingIndicator: function () { },
                hideLoadingIndicator: function () { }
            },
            mockPaymentEditView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { },
                showLoadingIndicator: function () { },
                hideLoadingIndicator: function () { },
                setModel: function () { }
            },
            invoiceController;

        squire.mock("facade", mockFacade);
        squire.mock("utils", mockUtils);
        squire.mock("controllers/BaseController", BaseController);
        squire.mock("models/UserModel", UserModel);
        squire.mock("collections/PaymentCollection", Squire.Helpers.returns(mockPaymentCollection));
        squire.mock("models/InvoiceSummaryModel", Squire.Helpers.returns(invoiceSummaryModel));
        squire.mock("models/MakePaymentAvailabilityModel", Squire.Helpers.returns(makePaymentAvailabilityModel));
        squire.mock("models/UserModel", UserModel);
        squire.mock("views/InvoiceSummaryView", Squire.Helpers.returns(mockInvoiceSummaryView));
        squire.mock("views/PaymentListView", Squire.Helpers.returns(mockPaymentListView));
        squire.mock("views/PaymentAddView", Squire.Helpers.returns(mockPaymentAddView));
        squire.mock("views/PaymentDetailView", Squire.Helpers.returns(mockPaymentDetailView));
        squire.mock("views/PaymentEditView", Squire.Helpers.returns(mockPaymentEditView));

        describe("An Invoice Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/InvoiceController"], function (InvoiceController) {
                    bankAccountModel.set(mockBankAccountModel);
                    paymentModel.set(mockPaymentModel);
                    paymentModel.set("bankAccount", bankAccountModel);
                    invoiceSummaryModel.set(mockInvoiceSummaryModel);
                    makePaymentAvailabilityModel.set(mockMakePaymentAvailabilityModel);
                    userModel.parse(mockUserModel);
                    spyOn(UserModel, "getInstance").and.callThrough();

                    invoiceController = InvoiceController;
                    invoiceController.init();

                    done();
                });
            });

            it("is defined", function () {
                expect(invoiceController).toBeDefined();
            });

            it("looks like a BaseController", function () {
                expect(invoiceController instanceof BaseController).toBeTruthy();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(invoiceController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                it("is defined", function () {
                    expect(invoiceController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.init).toEqual(jasmine.any(Function));
                });

                it("should set the userModel variable to a UserModel object", function () {
                    expect(invoiceController.userModel).toEqual(userModel);
                });

                it("should set the invoiceSummaryModel variable to a InvoiceSummaryModel object", function () {
                    expect(invoiceController.invoiceSummaryModel).toEqual(invoiceSummaryModel);
                });

                it("should set the makePaymentAvailabilityModel variable to a MakePaymentAvailabilityModel object",
                    function () {
                        expect(invoiceController.makePaymentAvailabilityModel).toEqual(makePaymentAvailabilityModel);
                    });

                it("should set the paymentCollection variable to a PaymentCollection object", function () {
                    expect(invoiceController.paymentCollection).toEqual(mockPaymentCollection);
                });

                describe("when initializing the InvoiceSummaryView", function () {
                    beforeEach(function () {
                        spyOn(mockInvoiceSummaryView, "constructor").and.callThrough();

                        invoiceController.init();
                    });

                    it("should set the invoiceSummaryView variable to a new InvoiceSummaryView object", function () {
                        expect(invoiceController.invoiceSummaryView).toEqual(mockInvoiceSummaryView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockInvoiceSummaryView.constructor).toHaveBeenCalledWith({
                            model                       : invoiceSummaryModel,
                            makePaymentAvailabilityModel: makePaymentAvailabilityModel,
                            userModel                   : userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                describe("when initializing the PaymentAddView", function () {
                    beforeEach(function () {
                        spyOn(mockPaymentListView, "constructor").and.callThrough();

                        invoiceController.init();
                    });

                    it("should set the paymentAddView variable to a new PaymentAddView object", function () {
                        expect(invoiceController.paymentAddView).toEqual(mockPaymentAddView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockPaymentAddView.constructor).toHaveBeenCalledWith({
                            model              : paymentModel,
                            invoiceSummaryModel: invoiceSummaryModel,
                            userModel          : userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                describe("when initializing the PaymentEditView", function () {
                    beforeEach(function () {
                        spyOn(mockPaymentListView, "constructor").and.callThrough();

                        invoiceController.init();
                    });

                    it("should set the paymentEditView variable to a new PaymentEditView object", function () {
                        expect(invoiceController.paymentEditView).toEqual(mockPaymentEditView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockPaymentEditView.constructor).toHaveBeenCalledWith({
                            invoiceSummaryModel: invoiceSummaryModel,
                            userModel          : userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                describe("when initializing the PaymentListView", function () {
                    beforeEach(function () {
                        spyOn(mockPaymentListView, "constructor").and.callThrough();

                        invoiceController.init();
                    });

                    it("should set the paymentListView variable to a new PaymentListView object", function () {
                        expect(invoiceController.paymentListView).toEqual(mockPaymentListView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockPaymentListView.constructor).toHaveBeenCalledWith({
                            collection: mockPaymentCollection,
                            userModel: userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                describe("when initializing the PaymentListView", function () {
                    beforeEach(function () {
                        spyOn(mockPaymentDetailView, "constructor").and.callThrough();

                        invoiceController.init();
                    });

                    it("should set the paymentDetailView variable to a new PaymentDetailView object", function () {
                        expect(invoiceController.paymentDetailView).toEqual(mockPaymentDetailView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockPaymentDetailView.constructor).toHaveBeenCalledWith({
                            userModel: userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                it("should register a function as the handler for the payment detail view cancelPaymentSuccess event",
                    function () {
                        spyOn(mockPaymentDetailView, "on").and.callFake(function () { });

                        invoiceController.init();

                        expect(mockPaymentDetailView.on).toHaveBeenCalledWith("cancelPaymentSuccess",
                            invoiceController.showCancelPaymentDetails,
                            invoiceController);
                    });

                it("should register a function as the handler for the payment add view paymentAddSuccess event",
                    function () {
                        spyOn(mockPaymentAddView, "on").and.callFake(function () { });

                        invoiceController.init();

                        expect(mockPaymentAddView.on).toHaveBeenCalledWith("paymentAddSuccess",
                            invoiceController.showPaymentAddDetails,
                            invoiceController);
                    });

                it("should register a function as the handler for the payment edit view paymentEditSuccess event",
                    function () {
                        spyOn(mockPaymentEditView, "on").and.callFake(function () { });

                        invoiceController.init();

                        expect(mockPaymentEditView.on).toHaveBeenCalledWith("paymentEditSuccess",
                            invoiceController.showPaymentEditDetails,
                            invoiceController);
                    });
            });

            describe("has a fetchPaymentProperties function that", function () {
                it("is defined", function () {
                    expect(invoiceController.fetchPaymentProperties).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.fetchPaymentProperties).toEqual(jasmine.any(Function));
                });

                describe("when the user does not have a selectedCompany", function () {
                    it("should return true", function () {
                        userModel.set("selectedCompany", null);

                        expect(invoiceController.fetchPaymentProperties()).toBeTruthy();
                    });
                });

                describe("when the fetched attributes are available", function () {
                    it("should return true", function () {
                        var selectedCompany = userModel.get("selectedCompany");
                        spyOn(selectedCompany, "areFetchedPropertiesEmpty").and.returnValue(false);

                        expect(invoiceController.fetchPaymentProperties()).toBeTruthy();
                    });
                });

                describe("when the fetched attributes are NOT available", function () {
                    var selectedCompany,
                        mockView,
                        callback;

                    beforeEach(function () {
                        mockView = {
                            showLoadingIndicator: jasmine.createSpy("callback spy"),
                            hideLoadingIndicator: jasmine.createSpy("callback spy")
                        };
                        callback = jasmine.createSpy("callback spy");
                        selectedCompany = userModel.get("selectedCompany");
                        spyOn(selectedCompany, "areFetchedPropertiesEmpty").and.returnValue(true);
                    });

                    it("should call showLoadingIndicator on the View", function () {
                        spyOn(selectedCompany, "fetch").and.returnValue(true);

                        invoiceController.fetchPaymentProperties(mockView, callback);
                        expect(mockView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call fetch on the Company", function () {
                        spyOn(selectedCompany, "fetch").and.returnValue(true);

                        invoiceController.fetchPaymentProperties(mockView, callback);
                        expect(selectedCompany.fetch).toHaveBeenCalledWith();
                    });

                    describe("when the call to fetch on the Company finishes successfully", function () {
                        beforeEach(function () {
                            spyOn(selectedCompany, "fetch").and.callFake(function () {
                                var deferred = utils.Deferred();

                                deferred.resolve();
                                return deferred.promise();
                            });

                            invoiceController.fetchPaymentProperties(mockView, callback);
                        });

                        it("should call the callback", function () {
                            expect(callback).toHaveBeenCalledWith();
                        });

                        it("should call hideLoadingIndicator on the View", function () {
                            expect(mockView.hideLoadingIndicator).toHaveBeenCalledWith();
                        });
                    });

                    describe("when the call to fetch on the Company finishes in failure", function () {
                        beforeEach(function () {
                            spyOn(selectedCompany, "fetch").and.callFake(function () {
                                var deferred = utils.Deferred();

                                deferred.reject();
                                return deferred.promise();
                            });

                            invoiceController.fetchPaymentProperties(mockView, callback);
                        });

                        it("should NOT call the callback", function () {
                            expect(callback).not.toHaveBeenCalled();
                        });

                        it("should call hideLoadingIndicator on the View", function () {
                            expect(mockView.hideLoadingIndicator).toHaveBeenCalledWith();
                        });
                    });

                    it("should return false", function () {
                        spyOn(selectedCompany, "fetch").and.returnValue(true);

                        expect(invoiceController.fetchPaymentProperties(mockView, callback)).toBeFalsy();
                    });
                });
            });

            describe("has a beforeNavigatePaymentAddCondition function that", function () {
                var mockReturnValue = false,
                    actualResponse;

                beforeEach(function () {
                    spyOn(invoiceController, "fetchPaymentProperties").and.returnValue(mockReturnValue);

                    actualResponse = invoiceController.beforeNavigatePaymentAddCondition();
                });

                it("is defined", function () {
                    expect(invoiceController.beforeNavigatePaymentAddCondition).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.beforeNavigatePaymentAddCondition).toEqual(jasmine.any(Function));
                });

                it("should call fetchPaymentProperties", function () {
                    expect(invoiceController.fetchPaymentProperties)
                        .toHaveBeenCalledWith(mockPaymentAddView, jasmine.any(Function));
                });

                describe("sends to fetchPaymentProperties a callback that", function () {
                    beforeEach(function () {
                        var callback = invoiceController.fetchPaymentProperties.calls.mostRecent().args[1];

                        spyOn(invoiceController, "navigatePaymentAdd").and.callFake(function () { });

                        callback.call();
                    });

                    it("should call navigatePaymentAdd", function () {
                        expect(invoiceController.navigatePaymentAdd).toHaveBeenCalledWith();
                    });
                });

                it("should return the expected response", function () {
                    expect(actualResponse).toEqual(mockReturnValue);
                });
            });

            describe("has a beforeNavigatePaymentEditCondition function that", function () {
                var mockPaymentId = 235621,
                    mockReturnValue = false,
                    actualResponse;

                beforeEach(function () {
                    spyOn(invoiceController, "fetchPaymentProperties").and.returnValue(mockReturnValue);

                    actualResponse = invoiceController.beforeNavigatePaymentEditCondition(mockPaymentId);
                });

                it("is defined", function () {
                    expect(invoiceController.beforeNavigatePaymentEditCondition).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.beforeNavigatePaymentEditCondition).toEqual(jasmine.any(Function));
                });

                it("should call fetchPaymentProperties", function () {
                    expect(invoiceController.fetchPaymentProperties)
                        .toHaveBeenCalledWith(mockPaymentEditView, jasmine.any(Function));
                });

                describe("sends to fetchPaymentProperties a callback that", function () {
                    beforeEach(function () {
                        var callback = invoiceController.fetchPaymentProperties.calls.mostRecent().args[1];

                        spyOn(invoiceController, "navigatePaymentEdit").and.callFake(function () { });

                        callback.call();
                    });

                    it("should call navigatePaymentEdit", function () {
                        expect(invoiceController.navigatePaymentEdit).toHaveBeenCalledWith(mockPaymentId);
                    });
                });

                it("should return the expected response", function () {
                    expect(actualResponse).toEqual(mockReturnValue);
                });
            });

            describe("has a navigateSummary function that", function () {
                it("is defined", function () {
                    expect(invoiceController.navigateSummary).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.navigateSummary).toEqual(jasmine.any(Function));
                });

                describe("when the call to updateSummaryModels finishes successfully", function () {
                    beforeEach(function () {
                        spyOn(invoiceController, "updateSummaryModels").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.resolve();
                            return deferred.promise();
                        });

                        spyOn(mockInvoiceSummaryView, "showLoadingIndicator").and.callFake(function () {});
                        spyOn(mockInvoiceSummaryView, "render").and.callFake(function () {});
                        spyOn(mockUtils, "changePage").and.callFake(function () {});
                        spyOn(mockInvoiceSummaryView, "hideLoadingIndicator").and.callFake(function () {});

                        invoiceController.navigateSummary();
                    });

                    it("should call the showLoadingIndicator function on the Invoice Summary View", function () {
                        expect(mockInvoiceSummaryView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call updateSummaryModels", function () {
                        expect(invoiceController.updateSummaryModels).toHaveBeenCalledWith();
                    });

                    it("should call the render function on Invoice Summary View", function () {
                        expect(mockInvoiceSummaryView.render).toHaveBeenCalledWith();
                    });

                    it("should call the changePage function on utils", function () {
                        expect(utils.changePage).toHaveBeenCalledWith(mockInvoiceSummaryView.$el, null, null, true);
                    });

                    it("should call the hideLoadingIndicator function on the Invoice Summary View", function () {
                        expect(mockInvoiceSummaryView.hideLoadingIndicator).toHaveBeenCalledWith();
                    });
                });

                describe("when the call to updateSummaryModels finishes with a failure", function () {
                    beforeEach(function () {
                        spyOn(invoiceController, "updateSummaryModels").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.reject();
                            return deferred.promise();
                        });

                        spyOn(mockInvoiceSummaryView, "showLoadingIndicator").and.callFake(function () {});
                        spyOn(mockInvoiceSummaryView, "render").and.callFake(function () {});
                        spyOn(mockUtils, "changePage").and.callFake(function () {});
                        spyOn(mockInvoiceSummaryView, "hideLoadingIndicator").and.callFake(function () {});

                        invoiceController.navigateSummary();
                    });

                    it("should call the showLoadingIndicator function on the Invoice Summary View", function () {
                        expect(mockInvoiceSummaryView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call updateSummaryModels", function () {
                        expect(invoiceController.updateSummaryModels).toHaveBeenCalledWith();
                    });

                    it("should NOT call the render function on Invoice Summary View", function () {
                        expect(mockInvoiceSummaryView.render).not.toHaveBeenCalled();
                    });

                    it("should NOT call the changePage function on utils", function () {
                        expect(utils.changePage).not.toHaveBeenCalled();
                    });

                    it("should call the hideLoadingIndicator function on the Invoice Summary View", function () {
                        expect(mockInvoiceSummaryView.hideLoadingIndicator).toHaveBeenCalledWith();
                    });
                });
            });

            describe("has a navigatePaymentAdd function that", function () {
                beforeEach(function () {
                    spyOn(mockPaymentAddView, "render").and.callThrough();
                    spyOn(mockUtils, "changePage").and.callThrough();

                    invoiceController.navigatePaymentAdd();
                });

                it("is defined", function () {
                    expect(invoiceController.navigatePaymentAdd).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.navigatePaymentAdd).toEqual(jasmine.any(Function));
                });

                it("should call render on the Payment Add View Page", function () {
                    expect(mockPaymentAddView.render).toHaveBeenCalledWith();
                });

                it("should change the page to the Payment Add View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalledWith(mockPaymentAddView.$el);
                });
            });

            describe("has a navigatePaymentDetails function that", function () {
                var mockCardNumber = 1234;

                beforeEach(function () {
                    mockPaymentDetailView.model = null;
                    spyOn(mockPaymentCollection, "findWhere").and.callFake(function () { return paymentModel; });
                    spyOn(mockPaymentDetailView, "setModel").and.callFake(function () { });
                    spyOn(mockPaymentDetailView, "render").and.callThrough();
                    spyOn(mockUtils, "changePage").and.callThrough();

                    invoiceController.navigatePaymentDetails(mockCardNumber);
                });

                it("is defined", function () {
                    expect(invoiceController.navigatePaymentDetails).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.navigatePaymentDetails).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the Payment Collection", function () {
                    expect(mockPaymentCollection.findWhere).toHaveBeenCalledWith({"id": mockCardNumber});
                });

                it("should call setModel on the Payment Detail View Page", function () {
                    expect(mockPaymentDetailView.setModel).toHaveBeenCalledWith(paymentModel);
                });

                it("should call render on the Payment Detail View Page", function () {
                    expect(mockPaymentDetailView.render).toHaveBeenCalledWith();
                });

                it("should change the page to the Payment Detail View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalledWith(mockPaymentDetailView.$el);
                });
            });

            describe("has a navigatePaymentEdit function that", function () {
                var mockPaymentId = 1234;

                beforeEach(function () {
                    spyOn(mockPaymentCollection, "findWhere").and.callFake(function () { return paymentModel; });
                    spyOn(mockPaymentEditView, "setModel").and.callFake(function () { });
                    spyOn(mockPaymentEditView, "render").and.callThrough();
                    spyOn(mockUtils, "changePage").and.callThrough();

                    invoiceController.navigatePaymentEdit(mockPaymentId);
                });

                it("is defined", function () {
                    expect(invoiceController.navigatePaymentEdit).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.navigatePaymentEdit).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the Payment Collection", function () {
                    expect(mockPaymentCollection.findWhere).toHaveBeenCalledWith({"id": mockPaymentId});
                });

                it("should call setModel on the Payment Edit View Page", function () {
                    expect(mockPaymentEditView.setModel).toHaveBeenCalledWith(paymentModel);
                });

                it("should call render on the Payment Edit View Page", function () {
                    expect(mockPaymentEditView.render).toHaveBeenCalledWith();
                });

                it("should change the page to the Payment Edit View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalledWith(mockPaymentEditView.$el);
                });
            });

            describe("has a navigatePaymentHistory function that", function () {
                it("is defined", function () {
                    expect(invoiceController.navigatePaymentHistory).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.navigatePaymentHistory).toEqual(jasmine.any(Function));
                });

                describe("when the call to fetchCollection finishes successfully", function () {
                    beforeEach(function () {
                        spyOn(invoiceController, "fetchCollection").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.resolve();
                            return deferred.promise();
                        });

                        spyOn(mockPaymentListView, "showLoadingIndicator").and.callFake(function () {});
                        spyOn(mockPaymentCollection, "reset").and.callFake(function () {});
                        spyOn(mockPaymentListView, "render").and.callFake(function () {});
                        spyOn(utils, "changePage").and.callFake(function () {});
                        spyOn(mockPaymentListView, "hideLoadingIndicator").and.callFake(function () {});

                        invoiceController.navigatePaymentHistory();
                    });

                    it("should call the showLoadingIndicator function on the Payment List View", function () {
                        expect(mockPaymentListView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call the reset function on the Payment Collection", function () {
                        expect(mockPaymentCollection.reset).toHaveBeenCalledWith([], { "silent": true });
                    });

                    it("should call fetchCollection on utils", function () {
                        expect(invoiceController.fetchCollection).toHaveBeenCalledWith(mockPaymentCollection, null);
                    });

                    it("should call the render function on Payment List View", function () {
                        expect(mockPaymentListView.render).toHaveBeenCalledWith();
                    });

                    it("should call the changePage function on utils", function () {
                        expect(utils.changePage).toHaveBeenCalledWith(mockPaymentListView.$el, null, null, true);
                    });

                    it("should call the hideLoadingIndicator function on the Payment List View", function () {
                        expect(mockPaymentListView.hideLoadingIndicator).toHaveBeenCalledWith();
                    });
                });

                describe("when the call to fetchCollection finishes with a failure", function () {
                    beforeEach(function () {
                        spyOn(invoiceController, "fetchCollection").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.reject();
                            return deferred.promise();
                        });

                        spyOn(mockPaymentListView, "showLoadingIndicator").and.callFake(function () {});
                        spyOn(mockPaymentCollection, "reset").and.callFake(function () {});
                        spyOn(mockPaymentListView, "render").and.callFake(function () {});
                        spyOn(utils, "changePage").and.callFake(function () {});
                        spyOn(mockPaymentListView, "hideLoadingIndicator").and.callFake(function () {});

                        invoiceController.navigatePaymentHistory();
                    });

                    it("should call the showLoadingIndicator function on the Payment List View", function () {
                        expect(mockPaymentListView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call the reset function on the Payment Collection", function () {
                        expect(mockPaymentCollection.reset).toHaveBeenCalledWith([], { "silent": true });
                    });

                    it("should call fetchCollection", function () {
                        expect(invoiceController.fetchCollection).toHaveBeenCalledWith(mockPaymentCollection, null);
                    });

                    it("should call the render function on Payment List View", function () {
                        expect(mockPaymentListView.render).toHaveBeenCalledWith();
                    });

                    it("should call the changePage function on utils", function () {
                        expect(utils.changePage).toHaveBeenCalledWith(mockPaymentListView.$el, null, null, true);
                    });

                    it("should call the hideLoadingIndicator function on the Payment List View", function () {
                        expect(mockPaymentListView.hideLoadingIndicator).toHaveBeenCalledWith();
                    });
                });
            });

            describe("has a showCancelPaymentDetails function that", function () {
                var response = "Response message";

                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callFake(function () { });

                    invoiceController.showCancelPaymentDetails(response);
                });

                it("is defined", function () {
                    expect(invoiceController.showCancelPaymentDetails).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.showCancelPaymentDetails).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    var appAlertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                    appAlertOptions = mockFacade.publish.calls.mostRecent().args[2];
                    expect(appAlertOptions.title).toEqual(globals.paymentDetails.constants.CANCEL_PAYMENT_SUCCESS_TITLE);
                    expect(appAlertOptions.message).toEqual(response);
                    expect(appAlertOptions.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                    expect(appAlertOptions.popupafterclose).toEqual(jasmine.any(Function));
                });

                describe("sends as the popupafterclose argument a callback that", function () {
                    var options;

                    beforeEach(function () {
                        options = mockFacade.publish.calls.mostRecent().args[2];

                        spyOn(invoiceController, "navigatePaymentHistory").and.callFake(function () { });

                        options.popupafterclose.call(invoiceController);
                    });

                    it("should call navigatePaymentHistory", function () {
                        expect(invoiceController.navigatePaymentHistory).toHaveBeenCalledWith();
                    });
                });
            });

            describe("has a showPaymentAddDetails function that", function () {
                var response = "Response message";

                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callFake(function () { });

                    invoiceController.showPaymentAddDetails(response);
                });

                it("is defined", function () {
                    expect(invoiceController.showPaymentAddDetails).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.showPaymentAddDetails).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    var appAlertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                    appAlertOptions = mockFacade.publish.calls.mostRecent().args[2];
                    expect(appAlertOptions.title).toEqual(globals.paymentChangedDetails.constants.SUCCESS_TITLE);
                    expect(appAlertOptions.message).toEqual(response);
                    expect(appAlertOptions.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                    expect(appAlertOptions.popupafterclose).toEqual(jasmine.any(Function));
                });

                describe("sends as the popupafterclose argument a callback that", function () {
                    var options;

                    beforeEach(function () {
                        options = mockFacade.publish.calls.mostRecent().args[2];

                        spyOn(invoiceController, "navigateSummary").and.callFake(function () { });

                        options.popupafterclose.call(invoiceController);
                    });

                    it("should call navigateSummary", function () {
                        expect(invoiceController.navigateSummary).toHaveBeenCalledWith();
                    });
                });
            });

            describe("has a showPaymentEditDetails function that", function () {
                var response = "Response message";

                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callFake(function () { });

                    invoiceController.showPaymentEditDetails(response);
                });

                it("is defined", function () {
                    expect(invoiceController.showPaymentEditDetails).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.showPaymentEditDetails).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    var appAlertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                    appAlertOptions = mockFacade.publish.calls.mostRecent().args[2];
                    expect(appAlertOptions.title).toEqual(globals.paymentChangedDetails.constants.SUCCESS_TITLE);
                    expect(appAlertOptions.message).toEqual(response);
                    expect(appAlertOptions.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                    expect(appAlertOptions.popupafterclose).toEqual(jasmine.any(Function));
                });

                describe("sends as the popupafterclose argument a callback that", function () {
                    var options;

                    beforeEach(function () {
                        options = mockFacade.publish.calls.mostRecent().args[2];

                        spyOn(invoiceController, "navigatePaymentHistory").and.callFake(function () { });

                        options.popupafterclose.call(invoiceController);
                    });

                    it("should call navigatePaymentHistory", function () {
                        expect(invoiceController.navigatePaymentHistory).toHaveBeenCalledWith();
                    });
                });
            });

            describe("has an updateSummaryModels function that", function () {
                it("is defined", function () {
                    expect(invoiceController.updateSummaryModels).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.updateSummaryModels).toEqual(jasmine.any(Function));
                });

                describe("when the call to fetchInvoiceSummary finishes successfully", function () {
                    var mockPromiseReturnValue = "Promise Return Value",
                        mockDeferred = {
                            promise: function () { return mockPromiseReturnValue; },
                            reject: function () {},
                            resolve: function () {}
                        },
                        actualReturnValue,
                        mockFetchInvoiceSummaryDeferred = utils.Deferred();

                    beforeEach(function () {
                        spyOn(invoiceController, "fetchInvoiceSummary").and.callFake(function () {
                            mockFetchInvoiceSummaryDeferred.resolve();
                            return mockFetchInvoiceSummaryDeferred.promise();
                        });
                    });

                    describe("when the call to fetchMakePaymentAvailability finishes successfully", function () {
                        var mockFetchMakePaymentAvailabilityDeferred = utils.Deferred();

                        beforeEach(function () {
                            spyOn(invoiceController, "fetchMakePaymentAvailability").and.callFake(function () {
                                mockFetchMakePaymentAvailabilityDeferred.resolve();
                                return mockFetchMakePaymentAvailabilityDeferred.promise();
                            });

                            spyOn(mockUtils, "Deferred").and.returnValue(mockDeferred);
                            spyOn(mockDeferred, "reject").and.callThrough();
                            spyOn(mockDeferred, "resolve").and.callThrough();

                            actualReturnValue = invoiceController.updateSummaryModels();
                        });

                        it("should call resolve on the Deferred object", function () {
                            expect(mockDeferred.resolve).toHaveBeenCalledWith();
                        });

                        it("should NOT call reject on the Deferred object", function () {
                            expect(mockDeferred.reject).not.toHaveBeenCalled();
                        });

                        it("should return the expected value", function () {
                            expect(actualReturnValue).toEqual(mockPromiseReturnValue);
                        });
                    });

                    describe("when the call to fetchMakePaymentAvailability finishes with a failure", function () {
                        var mockFetchMakePaymentAvailabilityDeferred = utils.Deferred();

                        beforeEach(function () {
                            spyOn(invoiceController, "fetchMakePaymentAvailability").and.callFake(function () {
                                mockFetchMakePaymentAvailabilityDeferred.reject();
                                return mockFetchMakePaymentAvailabilityDeferred.promise();
                            });

                            spyOn(mockUtils, "Deferred").and.returnValue(mockDeferred);
                            spyOn(mockDeferred, "reject").and.callThrough();
                            spyOn(mockDeferred, "resolve").and.callThrough();

                            actualReturnValue = invoiceController.updateSummaryModels();
                        });

                        it("should NOT call resolve on the Deferred object", function () {
                            expect(mockDeferred.resolve).not.toHaveBeenCalled();
                        });

                        it("should call reject on the Deferred object", function () {
                            expect(mockDeferred.reject).toHaveBeenCalledWith();
                        });

                        it("should return the expected value", function () {
                            expect(actualReturnValue).toEqual(mockPromiseReturnValue);
                        });
                    });
                });

                describe("when the call to fetchInvoiceSummary finishes with a failure", function () {
                    var mockPromiseReturnValue = "Promise Return Value",
                        mockDeferred = {
                            promise: function () { return mockPromiseReturnValue; },
                            reject: function () {},
                            resolve: function () {}
                        },
                        actualReturnValue,
                        mockFetchInvoiceSummaryDeferred = utils.Deferred();

                    beforeEach(function () {
                        spyOn(invoiceController, "fetchInvoiceSummary").and.callFake(function () {
                            mockFetchInvoiceSummaryDeferred.reject();
                            return mockFetchInvoiceSummaryDeferred.promise();
                        });
                    });

                    describe("when the call to fetchMakePaymentAvailability finishes successfully", function () {
                        var mockFetchMakePaymentAvailabilityDeferred = utils.Deferred();

                        beforeEach(function () {
                            spyOn(invoiceController, "fetchMakePaymentAvailability").and.callFake(function () {
                                mockFetchMakePaymentAvailabilityDeferred.resolve();
                                return mockFetchMakePaymentAvailabilityDeferred.promise();
                            });

                            spyOn(mockUtils, "Deferred").and.returnValue(mockDeferred);
                            spyOn(mockDeferred, "reject").and.callThrough();
                            spyOn(mockDeferred, "resolve").and.callThrough();

                            actualReturnValue = invoiceController.updateSummaryModels();
                        });

                        it("should NOT call resolve on the Deferred object", function () {
                            expect(mockDeferred.resolve).not.toHaveBeenCalled();
                        });

                        it("should call reject on the Deferred object", function () {
                            expect(mockDeferred.reject).toHaveBeenCalledWith();
                        });

                        it("should return the expected value", function () {
                            expect(actualReturnValue).toEqual(mockPromiseReturnValue);
                        });
                    });

                    describe("when the call to fetchMakePaymentAvailability finishes with a failure", function () {
                        var mockFetchMakePaymentAvailabilityDeferred = utils.Deferred();

                        beforeEach(function () {
                            spyOn(invoiceController, "fetchMakePaymentAvailability").and.callFake(function () {
                                mockFetchMakePaymentAvailabilityDeferred.reject();
                                return mockFetchMakePaymentAvailabilityDeferred.promise();
                            });

                            spyOn(mockUtils, "Deferred").and.returnValue(mockDeferred);
                            spyOn(mockDeferred, "reject").and.callThrough();
                            spyOn(mockDeferred, "resolve").and.callThrough();

                            actualReturnValue = invoiceController.updateSummaryModels();
                        });

                        it("should NOT call resolve on the Deferred object", function () {
                            expect(mockDeferred.resolve).not.toHaveBeenCalled();
                        });

                        it("should call reject on the Deferred object", function () {
                            expect(mockDeferred.reject).toHaveBeenCalledWith();
                        });

                        it("should return the expected value", function () {
                            expect(actualReturnValue).toEqual(mockPromiseReturnValue);
                        });
                    });
                });
            });

            describe("has a fetchInvoiceSummary function that", function () {
                var expectedReturnValue = "Return Value",
                    actualReturnValue;

                beforeEach(function () {
                    spyOn(invoiceController, "fetchModel").and.returnValue(expectedReturnValue);

                    actualReturnValue = invoiceController.fetchInvoiceSummary();
                });

                it("is defined", function () {
                    expect(invoiceController.fetchInvoiceSummary).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.fetchInvoiceSummary).toEqual(jasmine.any(Function));
                });

                it("should call fetchModel", function () {
                    expect(invoiceController.fetchModel).toHaveBeenCalledWith(invoiceSummaryModel);
                });

                it("should return the expected value", function () {
                    expect(actualReturnValue).toEqual(expectedReturnValue);
                });
            });

            describe("has a fetchMakePaymentAvailability function that", function () {
                var expectedReturnValue = "Return Value",
                    actualReturnValue;

                beforeEach(function () {
                    spyOn(invoiceController, "fetchModel").and.returnValue(expectedReturnValue);

                    actualReturnValue = invoiceController.fetchMakePaymentAvailability();
                });

                it("is defined", function () {
                    expect(invoiceController.fetchMakePaymentAvailability).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.fetchMakePaymentAvailability).toEqual(jasmine.any(Function));
                });

                it("should call fetchModel", function () {
                    expect(invoiceController.fetchModel).toHaveBeenCalledWith(makePaymentAvailabilityModel);
                });

                it("should return the expected value", function () {
                    expect(actualReturnValue).toEqual(expectedReturnValue);
                });
            });
        });
    });
