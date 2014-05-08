define(["backbone"],
    function (Backbone) {

        "use strict";


        var BankAccountModel = Backbone.Model.extend({
            defaults: {
                "id"         : null,
                "name"       : null,
                "defaultBank": false
            },

            initialize: function (options) {
                if (options) {
                    if (options.id) { this.set("id", options.id); }
                    if (options.name) { this.set("name", options.name); }
                    if (options.defaultBank) { this.set("defaultBank", options.defaultBank); }
                }
            }
        });

        return BankAccountModel;
    });
