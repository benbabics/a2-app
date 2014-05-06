define(["jclass"],
    function (JClass) {

        "use strict";


        var InvoiceController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        InvoiceController = JClass.extend({
            construct: function () {
            },

            init: function () {
            }
        }, classOptions);


        return new InvoiceController();
    });