define(["facade", "controllers/HierarchyController"],
    function (facade, controller) {

        "use strict";


        var subscribe = facade.subscribeTo("hierarchy", controller);


        return {
            init: function () {
                controller.init();
            }
        };
    });
