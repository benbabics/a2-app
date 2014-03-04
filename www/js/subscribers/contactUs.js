define(["facade", "controllers/ContactUsController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("contactUs", controller);

        subscribe("navigate", "navigate");


        return {
            init: function () {
                controller.init();
            }
        };
    });
