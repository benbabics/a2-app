define(["backbone"],
    function (Backbone) {

        "use strict";


        var CompanyModel = Backbone.Model.extend({
            defaults: {
                "name"            : null,
                "wexAccountNumber": null
            },

            initialize: function (options) {
                if (options) {
                    if (options.name) { this.set("name", options.name); }
                    if (options.wexAccountNumber) { this.set("wexAccountNumber", options.wexAccountNumber); }
                }
            }
        });

        return CompanyModel;
    });
