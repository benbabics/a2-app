define(["jclass"],
    function (JClass) {

        "use strict";


        var CardController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        CardController = JClass.extend({
            construct: function () {
            },

            init: function () {
            }
        }, classOptions);


        return new CardController();
    });