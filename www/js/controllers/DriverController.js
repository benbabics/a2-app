define(["jclass"],
    function (JClass) {

        "use strict";


        var DriverController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        DriverController = JClass.extend({
            construct: function () {
            },

            init: function () {
            }
        }, classOptions);


        return new DriverController();
    });