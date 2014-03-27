define(["facade", "controllers/DriverController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("driver", controller);

        subscribe("navigateAdd", "navigateAdd");
        subscribe("navigateDriverDetails", "navigateDriverDetails");
        subscribe("navigateSearch", "navigateSearch");


        return {
            init: function () {
                controller.init();
            }
        };
    });
