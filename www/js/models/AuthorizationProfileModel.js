define(["backbone"],
    function (Backbone) {

        "use strict";


        var AuthorizationProfileModel = Backbone.Model.extend({
            defaults: {
                "id"                : null,
                "name"              : null,
                "productRestriction": null
            },

            initialize: function (options) {
                if (options) {
                    if (options.id) { this.set("id", options.id); }
                    if (options.name) { this.set("name", options.name); }
                    if (options.productRestriction) { this.set("productRestriction", options.productRestriction); }
                }
            }
        });

        return AuthorizationProfileModel;
    });
