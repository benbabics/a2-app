define(["backbone"],
    function (Backbone) {

        "use strict";


        var AppModel = Backbone.Model.extend({
            defaults: {
                "buildVersion"   : "Unknown",
                "platform"       : "Unknown",
                "platformVersion": "Unknown"
            },

            initialize: function () {
                var self = this;

                this.set("platform", device.platform);
                this.set("platformVersion", device.version);

                // Set the build version
                ApplicationInfo.getBuildVersion(function (version) {
                    self.set("buildVersion", version);
                });
            },

            sync: function (method, model, options) {
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
