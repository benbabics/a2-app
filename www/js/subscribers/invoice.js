define(["facade", "controllers/InvoiceController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("invoice", controller);

        subscribe("navigateSummary",        "navigateSummary");
        subscribe("navigatePaymentAdd",     "navigatePaymentAdd", controller.beforeNavigatePaymentAddCondition);
        subscribe("navigatePaymentDetails", "navigatePaymentDetails");
        subscribe("navigatePaymentHistory", "navigatePaymentHistory");


        return {
            init: function () {
                controller.init();
            }
        };
    });
