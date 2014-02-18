define(["facade", "controllers/AppController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("app", controller);

        subscribe("ready", "ready");


        return {
            init: function () {
                controller.init();
            }
        };
    });
