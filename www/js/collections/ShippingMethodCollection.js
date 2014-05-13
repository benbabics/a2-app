define([ "models/ShippingMethodModel", "collections/BaseCollection" ],
    function (ShippingMethodModel, BaseCollection) {

        "use strict";

        var ShippingMethodCollection = BaseCollection.extend({
            model: ShippingMethodModel
        });

        return ShippingMethodCollection;
    });
