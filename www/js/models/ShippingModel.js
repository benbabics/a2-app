define(["backbone"],
    function (Backbone) {

        "use strict";


        var ShippingModel = Backbone.Model.extend({
            defaults: {
                "deliveryMethod": null,
                "firstName"     : null,
                "lastName"      : null,
                "companyName"   : null,
                "addressLine1"  : null,
                "addressLine2"  : null,
                "city"          : null,
                "state"         : null,
                "postalCode"    : null,
                "residence"     : false
            },

            initialize: function (options) {
                if (options) {
                    if (options.deliveryMethod) { this.set("deliveryMethod", options.deliveryMethod); }
                    if (options.firstName) { this.set("firstName", options.firstName); }
                    if (options.lastName) { this.set("lastName", options.lastName); }
                    if (options.companyName) { this.set("companyName", options.companyName); }
                    if (options.addressLine1) { this.set("addressLine1", options.addressLine1); }
                    if (options.addressLine2) { this.set("addressLine2", options.addressLine2); }
                    if (options.city) { this.set("city", options.city); }
                    if (options.state) { this.set("state", options.state); }
                    if (options.postalCode) { this.set("postalCode", options.postalCode); }
                    if (options.residence) { this.set("residence", options.residence); }
                }
            }
        });

        return ShippingModel;
    });
