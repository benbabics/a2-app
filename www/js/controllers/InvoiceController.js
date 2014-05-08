define(["jclass", "utils",
        "models/InvoiceSummaryModel", "models/MakePaymentAvailabilityModel", "models/UserModel",
        "views/InvoiceSummaryView"],
    function (JClass, utils, InvoiceSummaryModel, MakePaymentAvailabilityModel, UserModel, InvoiceSummaryView) {

        "use strict";


        var InvoiceController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        InvoiceController = JClass.extend({
            invoiceSummaryView: null,
            makePaymentAvailabilityModel: null,
            userModel: null,

            construct: function () {
            },

            init: function () {
                this.userModel = UserModel.getInstance();
                this.makePaymentAvailabilityModel = new MakePaymentAvailabilityModel();

                // create invoice summary view
                this.invoiceSummaryView = new InvoiceSummaryView({
                    model   : new InvoiceSummaryModel(),
                    userModel: this.userModel
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