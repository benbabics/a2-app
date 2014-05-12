define(["utils", "backbone", "Squire", "models/UserModel"],
    function (utils, Backbone, Squire, UserModel) {

        "use strict";

        var squire = new Squire(),
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
                    }
                },
                permissions: [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ]
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
            invoiceController;

        squire.mock("utils", mockUtils);
        squire.mock("collections/PaymentCollection", Squire.Helpers.returns(mockPaymentCollection));
        squire.mock("models/InvoiceSummaryModel", Squire.Helpers.returns(invoiceSummaryModel));
        squire.mock("models/MakePaymentAvailabilityModel", Squire.Helpers.returns(makePaymentAvailabilityModel));
        squire.mock("models/UserModel", UserModel);
        squire.mock("views/InvoiceSummaryView", Squire.Helpers.returns(mockInvoiceSummaryView));
        squire.mock("views/PaymentListView", Squire.Helpers.returns(mockPaymentListView));
        squire.mock("views/PaymentDetailView", Squire.Helpers.returns(mockPaymentDetailView));

        describe("An Invoice Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/InvoiceController"], function (InvoiceController) {
                    bankAccountModel.set(mockBankAccountModel);
                    paymentModel.set(mockPaymentModel);
                    paymentModel.set("bankAccount", bankAccountModel);
                    invoiceSummaryModel.set(mockInvoiceSummaryModel);
                    makePaymentAvailabilityModel.set(mockMakePaymentAvailabilityModel);
                    userModel.initialize(mockUserModel);
                    spyOn(UserModel, "getInstance").and.callThrough();

                    invoiceController = InvoiceController;
                    invoiceController.init();

                    done();
                });
            });

            it("is defined", function () {
                expect(invoiceController).toBeDefined();
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
                    });

                    it("should set the invoiceSummaryView variable to a new InvoiceSummaryView object", function () {
                        expect(invoiceController.invoiceSummaryView).toEqual(mockInvoiceSummaryView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockInvoiceSummaryView.constructor).toHaveBeenCalledWith({
                            model    : invoiceSummaryModel,
                            userModel: userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                describe("when initializing the PaymentListView", function () {
                    beforeEach(function () {
                        spyOn(mockPaymentListView, "constructor").and.callThrough();
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
                        expect(mockInvoiceSummaryView.render).not.toHaveBeenCalledWith();
                    });

                    it("should NOT call the changePage function on utils", function () {
                        expect(utils.changePage).not.toHaveBeenCalledWith(mockInvoiceSummaryView.$el, null, null, true);
                    });

                    it("should call the hideLoadingIndicator function on the Invoice Summary View", function () {
                        expect(mockInvoiceSummaryView.hideLoadingIndicator).toHaveBeenCalledWith();
                    });
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
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.calls.mostRecent().args.length).toEqual(1);
                    expect(mockUtils.changePage.calls.mostRecent().args[0]).toEqual(mockPaymentDetailView.$el);
                });
            });

            describe("has a navigatePaymentHistory function that", function () {
                beforeEach(function () {
                    spyOn(invoiceController, "updatePaymentHistoryCollection").and.callFake(function () {});

                    invoiceController.navigatePaymentHistory();
                });

                it("is defined", function () {
                    expect(invoiceController.navigatePaymentHistory).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.navigatePaymentHistory).toEqual(jasmine.any(Function));
                });

                it("should call updatePaymentHistoryCollection", function () {
                    expect(invoiceController.updatePaymentHistoryCollection).toHaveBeenCalledWith();
                });
            });

            describe("has an updatePaymentHistoryCollection function that", function () {
                it("is defined", function () {
                    expect(invoiceController.updatePaymentHistoryCollection).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.updatePaymentHistoryCollection).toEqual(jasmine.any(Function));
                });

                describe("when the call to fetchCollection finishes successfully", function () {
                    beforeEach(function () {
                        spyOn(utils, "fetchCollection").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.resolve();
                            return deferred.promise();
                        });

                        spyOn(mockPaymentListView, "showLoadingIndicator").and.callFake(function () {});
                        spyOn(mockPaymentCollection, "reset").and.callFake(function () {});
                        spyOn(mockPaymentListView, "render").and.callFake(function () {});
                        spyOn(utils, "changePage").and.callFake(function () {});
                        spyOn(mockPaymentListView, "hideLoadingIndicator").and.callFake(function () {});

                        invoiceController.updatePaymentHistoryCollection();
                    });

                    it("should call the showLoadingIndicator function on the Payment List View", function () {
                        expect(mockPaymentListView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call the reset function on the Payment Collection", function () {
                        expect(mockPaymentCollection.reset).toHaveBeenCalledWith([], { "silent": true });
                    });

                    it("should call fetchCollection on utils", function () {
                        expect(utils.fetchCollection).toHaveBeenCalledWith(mockPaymentCollection, null);
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
                        spyOn(utils, "fetchCollection").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.reject();
                            return deferred.promise();
                        });

                        spyOn(mockPaymentListView, "showLoadingIndicator").and.callFake(function () {});
                        spyOn(mockPaymentCollection, "reset").and.callFake(function () {});
                        spyOn(mockPaymentListView, "render").and.callFake(function () {});
                        spyOn(utils, "changePage").and.callFake(function () {});
                        spyOn(mockPaymentListView, "hideLoadingIndicator").and.callFake(function () {});

                        invoiceController.updatePaymentHistoryCollection();
                    });

                    it("should call the showLoadingIndicator function on the Payment List View", function () {
                        expect(mockPaymentListView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call the reset function on the Payment Collection", function () {
                        expect(mockPaymentCollection.reset).toHaveBeenCalledWith([], { "silent": true });
                    });

                    it("should call fetchCollection", function () {
                        expect(utils.fetchCollection).toHaveBeenCalledWith(mockPaymentCollection, null);
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
                    spyOn(mockUtils, "fetchModel").and.returnValue(expectedReturnValue);

                    actualReturnValue = invoiceController.fetchInvoiceSummary();
                });

                it("is defined", function () {
                    expect(invoiceController.fetchInvoiceSummary).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.fetchInvoiceSummary).toEqual(jasmine.any(Function));
                });

                it("should call fetchModel on utils", function () {
                    expect(mockUtils.fetchModel).toHaveBeenCalledWith(invoiceSummaryModel);
                });

                it("should return the expected value", function () {
                    expect(actualReturnValue).toEqual(expectedReturnValue);
                });
            });

            describe("has a fetchMakePaymentAvailability function that", function () {
                var expectedReturnValue = "Return Value",
                    actualReturnValue;

                beforeEach(function () {
                    spyOn(mockUtils, "fetchModel").and.returnValue(expectedReturnValue);

                    actualReturnValue = invoiceController.fetchMakePaymentAvailability();
                });

                it("is defined", function () {
                    expect(invoiceController.fetchMakePaymentAvailability).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.fetchMakePaymentAvailability).toEqual(jasmine.any(Function));
                });

                it("should call fetchModel on utils", function () {
                    expect(mockUtils.fetchModel).toHaveBeenCalledWith(makePaymentAvailabilityModel);
                });

                it("should return the expected value", function () {
                    expect(actualReturnValue).toEqual(expectedReturnValue);
                });
            });
        });
    });
