define(["backbone"],
    function (Backbone) {

        "use strict";


        var ContactUsModel = Backbone.Model.extend({
            defaults: {
                "email": null,
                "subject": null,
                "message": null
            },

            validation: {
            },

            initialize: function () {
            }
        });


        return ContactUsModel;
    });
