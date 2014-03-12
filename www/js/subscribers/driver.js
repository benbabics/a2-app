define(["facade", "controllers/DriverController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("driver", controller);


        return {
            init: function () {
                controller.init();
            }
        };
    });
