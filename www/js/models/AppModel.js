define(["globals", "backbone"],
    function (globals, Backbone) {

        "use strict";


        var AppModel = Backbone.Model.extend({
            defaults: {
                "id"             : 1, // Set the ID so backbone does not think it is new
                "buildVersion"   : "Unknown",
                "platform"       : "Unknown",
                "platformVersion": "Unknown",
                "lastWarnVersion": null
            },

            initialize: function () {
                var self = this;

                this.set("platform", device.platform);
                this.set("platformVersion", device.version);

                // Set the build version
                ApplicationInfo.getBuildVersion(function (version) {
                    self.set("buildVersion", version);
                });

                // Fetch to sync the model with the local database
                this.fetch();
            },

            sync: function (method, model, options) {
                switch (method) {
                case "update":
                    localStorage.setItem(globals.APP.constants.LAST_WARN_VERSION, model.get("lastWarnVersion"));
                    break;

                case "create":
                    localStorage.setItem(globals.APP.constants.LAST_WARN_VERSION, null);
                     // fall through to execute the read case as well
                case "read":
                    model.set("lastWarnVersion", localStorage.getItem(globals.APP.constants.LAST_WARN_VERSION));
                    break;
                }
            }
        });

        // Make singleton
        return (function () {
            var __instance = null;

            return {
                getInstance: function () {
                    if (__instance === null) {
                        __instance = new AppModel();
                    }
                    return __instance;
                }
            };
        }());
    });
