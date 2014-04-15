define(["facade", "controllers/CardController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("card", controller);

        subscribe("navigateCardDetails", "navigateCardDetails");
        subscribe("navigateSearch", "navigateSearch");

        return {
            init: function () {
                controller.init();
            }
        };
    });
