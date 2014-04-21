define([ "globals", "utils", "backbone", "models/ShippingMethodModel" ],
    function (globals, utils, Backbone, ShippingMethodModel) {

        "use strict";

        var ShippingMethodCollection = Backbone.Collection.extend({
            model: ShippingMethodModel,

            toJSON: function () {
                var json = null,
                    index = 0;

                if (this.length > 0) {
                    json = [];
                    this.each(function (shippingMethod) {
                        json[index] = shippingMethod.toJSON();
                        index++;
                    }, this);
                }

                return json;
            }
        });

        return ShippingMethodCollection;
    });
