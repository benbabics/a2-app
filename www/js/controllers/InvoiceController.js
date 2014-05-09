define(["jclass", "utils", "collections/PaymentCollection",
        "models/InvoiceSummaryModel", "models/MakePaymentAvailabilityModel", "models/UserModel",
        "views/InvoiceSummaryView", "views/PaymentListView"],
    function (JClass, utils, PaymentCollection, InvoiceSummaryModel, MakePaymentAvailabilityModel, UserModel,
              InvoiceSummaryView, PaymentListView) {

        "use strict";


        var InvoiceController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        InvoiceController = JClass.extend({
            invoiceSummaryView: null,
            paymentListView: null,
            makePaymentAvailabilityModel: null,
            userModel: null,
            paymentCollection: null,

            construct: function () {
            },

            init: function () {
                this.userModel = UserModel.getInstance();
                this.makePaymentAvailabilityModel = new MakePaymentAvailabilityModel();
                this.paymentCollection = new PaymentCollection();

                // create invoice summary view
                this.invoiceSummaryView = new InvoiceSummaryView({
                    model   : new InvoiceSummaryModel(),
                    userModel: this.userModel
                });

                // create payment list view
                this.paymentListView = new PaymentListView({
                    collection: this.paymentCollection,
                    userModel : this.userModel
                });
            },

            navigateSummary: function () {
                var self = this;

                this.invoiceSummaryView.showLoadingIndicator();

                utils.when(this.updateSummaryModels())
                    .done(function () {
                        self.invoiceSummaryView.makePaymentAvailabilityModel = self.makePaymentAvailabilityModel;
                        self.invoiceSummaryView.render();
                        utils.changePage(self.invoiceSummaryView.$el, null, null, true);
                    })
                    .always(function () {
                        self.invoiceSummaryView.hideLoadingIndicator();
                    });
            },

            navigatePaymentHistory: function () {
                this.updatePaymentHistoryCollection();
            },

            updatePaymentHistoryCollection: function () {
                var self = this;

                this.paymentListView.showLoadingIndicator();

                // silently reset collection to ensure it always is "updated", even if it's the same models again
                this.paymentCollection.reset([], { "silent": true });

                utils.when(utils.fetchCollection(this.paymentCollection, null))
                    .always(function () {
                        self.paymentListView.render();
                        utils.changePage(self.paymentListView.$el, null, null, true);
                        self.paymentListView.hideLoadingIndicator();
                    });
            },

            updateSummaryModels: function () {
                var deferred = utils.Deferred();
                utils
                    .when(
                        this.fetchInvoiceSummary(),
                        this.fetchMakePaymentAvailability()
                    )
                    .done(function () {
                        deferred.resolve();
                    })
                    .fail(function () {
                        deferred.reject();
                    });

                return deferred.promise();
            },

            fetchInvoiceSummary: function () {
                return utils.fetchModel(this.invoiceSummaryView.model);
            },

            fetchMakePaymentAvailability: function () {
                return utils.fetchModel(this.makePaymentAvailabilityModel);
            }
        }, classOptions);


        return new InvoiceController();
    });