define(["facade", "controllers/AboutController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("about", controller);


        return {
            init: function () {
                controller.init();
            }
        };
    });
