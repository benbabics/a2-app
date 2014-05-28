define(["facade", "controllers/HierarchyController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("hierarchy", controller);

        subscribe("navigate", "navigate");


        return {
            init: function () {
                controller.init();
            }
        };
    });
