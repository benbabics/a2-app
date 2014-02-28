define(["facade", "controllers/HomeController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("home", controller);


        return {
            init: function () {
                controller.init();
            }
        };
    });
