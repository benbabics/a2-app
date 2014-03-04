define(["backbone"],
    function (Backbone) {

        "use strict";


        var UserModel = Backbone.Model.extend({
            defaults: {
                "authenticated": false,
                "email"        : null
            },

            initialize: function (options) {
                if (options && options.email) { this.set("email", options.email); }
            }
        });

        // Make singleton
        return (function () {
            var __instance = null;

            return {
                getInstance: function () {
                    if (__instance === null) {
                        __instance = new UserModel();
                    }
                    return __instance;
                }
            };
        }());
    });
