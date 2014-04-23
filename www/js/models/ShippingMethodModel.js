define(["backbone", "utils"],
    function (Backbone, utils) {

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

                this.formatAttributes();
            },

            formatAttributes: function () {
                var self = this;

                // set formatted attributes
                this.set("formattedName", function () {
                    var formmattedName = self.get("name"),
                        cost = self.get("cost");

                    if (formmattedName && cost) {
                        if (formmattedName.length > 0) {
                            formmattedName += " - ";
                        }
                        formmattedName += utils.formatCurrency(cost);
                    }

                    return formmattedName;
                });
            }
        });

        return ShippingMethodModel;
    });
