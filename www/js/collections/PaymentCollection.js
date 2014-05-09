define([ "backbone", "globals", "models/PaymentModel", "models/UserModel", "collections/AjaxSearchCollection" ],
    function (Backbone, globals, PaymentModel, UserModel, AjaxSearchCollection) {

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
            },

            toJSON: function () {
                var json = null,
                    index = 0;

                if (this.length > 0) {
                    json = [];
                    this.each(function (payment) {
                        json[index] = payment.toJSON();
                        index++;
                    }, this);
                }

                return json;
            }
        });

        return PaymentCollection;
    });
