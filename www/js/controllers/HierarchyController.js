define(["controllers/BaseController"],
    function (BaseController) {

        "use strict";


        var HierarchyController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        HierarchyController = BaseController.extend({
            construct: function () {
            },

            init: function () {
            }
        }, classOptions);


        return new HierarchyController();
    });