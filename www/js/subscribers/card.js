define(["facade", "controllers/CardController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("card", controller);

        subscribe("navigateAdd",         "navigateAdd", controller.beforeNavigateAddCondition);
        subscribe("navigateCardDetails", "navigateCardDetails");
        subscribe("navigateSearch",      "navigateSearch");

        return {
            init: function () {
                controller.init();
            }
        };
    });
