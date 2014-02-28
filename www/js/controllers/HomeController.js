define(["jclass"],
    function (JClass) {

        "use strict";


        var HomeController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        HomeController = JClass.extend({
            construct: function () {
            },

            init: function () {
            }
        }, classOptions);


        return new HomeController();
    });