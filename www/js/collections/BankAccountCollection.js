define([ "globals", "models/BankAccountModel", "collections/AjaxCollection" ],
    function (globals, BankAccountModel, AjaxCollection) {

        "use strict";

        var BankAccountCollection = AjaxCollection.extend({
            model: BankAccountModel,

            /**
             * Override a Backbone function in order to set the url
             *
             * @param options - A CompanyModel.toJSON() of the company to get the auth profiles for
             */
            fetch: function (options) {
                this.url = globals.WEBSERVICE.ACCOUNTS.URL + "/" + options.accountId +
                    globals.WEBSERVICE.BANK_ACCOUNTS_PATH;

                BankAccountCollection.__super__.fetch.call(this, {});
            }
        });

        return BankAccountCollection;
    });
