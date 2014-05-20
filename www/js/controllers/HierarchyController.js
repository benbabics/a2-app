define(["jclass"],
    function (JClass) {

        "use strict";


        var HierarchyController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        HierarchyController = JClass.extend({
            construct: function () {
            },

            init: function () {
            }
        }, classOptions);


        return new HierarchyController();
    });