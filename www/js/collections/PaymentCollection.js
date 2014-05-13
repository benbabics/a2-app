define([ "globals", "models/PaymentModel", "models/UserModel", "collections/AjaxSearchCollection" ],
    function (globals, PaymentModel, UserModel, AjaxSearchCollection) {

        "use strict";

        var PaymentCollection = AjaxSearchCollection.extend({
            model: PaymentModel,
            pageNumber: globals.paymentSearch.constants.DEFAULT_PAGE_NUMBER,
            pageSize: globals.paymentSearch.constants.DEFAULT_PAGE_SIZE,

            url: function () {
                return globals.WEBSERVICE.ACCOUNTS.URL + "/"  +
                    UserModel.getInstance().get("selectedCompany").get("accountId") +
                    globals.WEBSERVICE.PAYMENTS_PATH;
            },

            /***
             * Override the Backbone fetch function
             */
            fetch: function () {
                var overrodeOptions = {};

                overrodeOptions.pageSize = this.pageSize;
                overrodeOptions.pageNumber = this.pageNumber;

                PaymentCollection.__super__.fetch.call(this, overrodeOptions);
            }
        });

        return PaymentCollection;
    });
