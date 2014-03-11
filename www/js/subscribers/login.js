define(["facade", "controllers/LoginController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("login", controller);

        subscribe("navigate", "navigate");
        subscribe("userLogout", "logout");


        return {
            init: function () {
                controller.init();
            }
        };
    });
