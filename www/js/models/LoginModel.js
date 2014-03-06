define(["backbone", "globals", "utils", "models/AjaxModel"],
    function (Backbone, globals, utils, AjaxModel) {

        "use strict";


        var LoginModel = AjaxModel.extend({

            defaults: utils._.extend({}, AjaxModel.prototype.defaults, {
                "userName": null,
                "password": null
            }),

            urlRoot: globals.login.constants.WEBSERVICE,

            validation: utils._.extend({}, AjaxModel.prototype.validation, {
                "userName": {
                    required: true,
                    msg: globals.login.constants.ERROR_USERNAME_REQUIRED_FIELD
                },
                "password": {
                    required: true,
                    msg: globals.login.constants.ERROR_PASSWORD_REQUIRED_FIELD
                }
            }),

            initialize: function () {
            }

        });


        return LoginModel;
    });
