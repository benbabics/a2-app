define(["facade", "controllers/CardController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("card", controller);

        subscribe("navigateSearch", "navigateSearch");

        return {
            init: function () {
                controller.init();
            }
        };
    });
