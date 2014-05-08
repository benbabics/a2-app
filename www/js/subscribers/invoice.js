define(["facade", "controllers/InvoiceController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("invoice", controller);

        subscribe("navigateSummary", "navigateSummary");


        return {
            init: function () {
                controller.init();
            }
        };
    });
