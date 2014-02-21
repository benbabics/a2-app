define(["facade", "controllers/LoginController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("login", controller);

        subscribe("ready", "ready");


        return {
            init: function () {
                controller.init();
            }
        };
    });
