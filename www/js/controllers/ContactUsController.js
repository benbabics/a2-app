define(["jclass"],
    function (JClass) {

        "use strict";


        var ContactUsController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        ContactUsController = JClass.extend({
            construct: function () {
            },

            init: function () {
            }
        }, classOptions);


        return new ContactUsController();
    });