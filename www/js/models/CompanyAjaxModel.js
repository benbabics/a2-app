define(["globals", "models/AjaxModel"],
    function (globals, AjaxModel) {

        "use strict";


        var CompanyAjaxModel = AjaxModel.extend({
            defaults: {
                "accountId" : null
            },

            initialize: function (options) {
                CompanyAjaxModel.__super__.initialize.apply(this, arguments);

                if (options) {
                    if (options.accountId) { this.set("accountId", options.accountId); }
                }
            }
        });


        return CompanyAjaxModel;
    });
