define([ "backbone", "models/PaymentModel" ],
    function (Backbone, PaymentModel) {

        "use strict";

        var PaymentCollection = Backbone.Collection.extend({
            model: PaymentModel,

            toJSON: function () {
                var json = null,
                    index = 0;

                if (this.length > 0) {
                    json = [];
                    this.each(function (payment) {
                        json[index] = payment.toJSON();
                        index++;
                    }, this);
                }

                return json;
            }
        });

        return PaymentCollection;
    });
