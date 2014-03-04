define(["backbone", "globals", "models/AppModel"],
    function (Backbone, globals, AppModel) {

        "use strict";


        var ContactUsModel = Backbone.Model.extend({
            defaults: {
                "sender"         : null,
                "subject"        : null,
                "message"        : null,
                "devicePlatform" : null,
                "deviceVersion"  : null,
                "appBuildVersion": null
            },

            urlRoot: globals.contactUs.constants.WEBSERVICE,

            validation: {
                "sender": {
                    required: true,
                    msg: globals.contactUs.constants.ERROR_SENDER_REQUIRED_FIELD
                },
                "subject": {
                    required: true,
                    msg: globals.contactUs.constants.ERROR_SUBJECT_REQUIRED_FIELD
                },
                "message": {
                    required: true,
                    msg: globals.contactUs.constants.ERROR_MESSAGE_REQUIRED_FIELD
                }
            },

            initialize: function () {
                var appModel = AppModel.getInstance();

                this.set("devicePlatform", appModel.get("platform"));
                this.set("deviceVersion", appModel.get("platformVersion"));
                this.set("appBuildVersion", appModel.get("buildVersion"));
            }
        });


        return ContactUsModel;
    });
