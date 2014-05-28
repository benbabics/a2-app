define(["facade", "controllers/HomeController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("home", controller);

        subscribe("navigate", "navigate", controller.beforeNavigateCondition);


        return {
            init: function () {
                controller.init();
            }
        };
    });
