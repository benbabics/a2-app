define(["facade", "controllers/DriverController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("driver", controller);

        subscribe("navigateSearch", "navigateSearch");
        subscribe("navigateDriverDetails", "navigateDriverDetails");


        return {
            init: function () {
                controller.init();
            }
        };
    });
