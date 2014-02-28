define(["facade", "controllers/ContactUsController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("contactUs", controller);


        return {
            init: function () {
                controller.init();
            }
        };
    });
