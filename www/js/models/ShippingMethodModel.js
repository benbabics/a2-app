define(["backbone"],
    function (Backbone) {

        "use strict";


        var ShippingMethodModel = Backbone.Model.extend({
            defaults: {
                "id"          : null,
                "name"        : null,
                "cost"        : null,
                "poBoxAllowed": false
            },

            initialize: function (options) {
                if (options) {
                    if (options.id) { this.set("id", options.id); }
                    if (options.name) { this.set("name", options.name); }
                    if (options.cost) { this.set("cost", options.cost); }
                    if (options.poBoxAllowed) { this.set("poBoxAllowed", options.poBoxAllowed); }
                }
            }
        });

        return ShippingMethodModel;
    });
