define(["backbone", "globals"],
    function (Backbone, globals) {

        "use strict";


        var LoginModel = Backbone.Model.extend({

            defaults: {
                "username": null,
                "password": null
            },

            validation: {
                "username": {
                    required: true,
                    msg: globals.login.constants.ERROR_USERNAME_REQUIRED_FIELD
                },
                "password": {
                    required: true,
                    msg: globals.login.constants.ERROR_PASSWORD_REQUIRED_FIELD
                }
            },

            initialize: function () {
            }

        });


        return LoginModel;
    });
