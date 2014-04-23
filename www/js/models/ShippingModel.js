define(["backbone", "globals", "models/ShippingMethodModel"],
    function (Backbone, globals, ShippingMethodModel) {

        "use strict";


        var ShippingModel = Backbone.Model.extend({
            defaults: {
                "shippingMethod": null,
                "firstName"     : null,
                "lastName"      : null,
                "companyName"   : null,
                "addressLine1"  : null,
                "addressLine2"  : null,
                "city"          : null,
                "state"         : null,
                "postalCode"    : null,
                "countryCode"   : null,
                "residence"     : false
            },

            validation: {
                "firstName": {
                    required: true,
                    msg: globals.cardShipping.constants.ERROR_FIRST_NAME_REQUIRED_FIELD
                },
                "lastName": {
                    required: true,
                    msg: globals.cardShipping.constants.ERROR_LAST_NAME_REQUIRED_FIELD
                },
                "companyName": {
                    required: true,
                    msg: globals.cardShipping.constants.ERROR_COMPANY_NAME_REQUIRED_FIELD
                },
                "addressLine1": {
                    required: true,
                    msg: globals.cardShipping.constants.ERROR_ADDRESS1_REQUIRED_FIELD
                },
                "city": {
                    required: true,
                    msg: globals.cardShipping.constants.ERROR_CITY_REQUIRED_FIELD
                },
                "state": {
                    required: true,
                    msg: globals.cardShipping.constants.ERROR_STATE_REQUIRED_FIELD
                },
                "postalCode": {
                    required: true,
                    msg: globals.cardShipping.constants.ERROR_POSTAL_CODE_REQUIRED_FIELD
                }
            },

            initialize: function (options) {
                var shippingMethod;

                if (options) {
                    if (options.shippingMethod) {
                        shippingMethod = new ShippingMethodModel();
                        shippingMethod.initialize(options.shippingMethod);
                        this.set("shippingMethod", shippingMethod);
                    }
                    if (options.firstName) { this.set("firstName", options.firstName); }
                    if (options.lastName) { this.set("lastName", options.lastName); }
                    if (options.companyName) { this.set("companyName", options.companyName); }
                    if (options.addressLine1) { this.set("addressLine1", options.addressLine1); }
                    if (options.addressLine2) { this.set("addressLine2", options.addressLine2); }
                    if (options.city) { this.set("city", options.city); }
                    if (options.state) { this.set("state", options.state); }
                    if (options.postalCode) { this.set("postalCode", options.postalCode); }
                    if (options.countryCode) { this.set("countryCode", options.countryCode); }
                    if (options.residence) { this.set("residence", options.residence); }
                }
            },

            toJSON: function () {
                var json = ShippingModel.__super__.toJSON.apply(this, arguments);

                if (json.shippingMethod) {
                    json.shippingMethod = json.shippingMethod.toJSON();
                }

                return json;
            }
        });

        return ShippingModel;
    });
