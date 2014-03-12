define(["backbone", "models/CompanyModel"],
    function (Backbone, CompanyModel) {

        "use strict";


        var UserModel = Backbone.Model.extend({
            defaults: {
                "authenticated"  : false,
                "firstName"      : null,
                "email"          : null,
                "selectedCompany": null
            },

            initialize: function (options) {
                if (options) {
                    if (options.authenticated) { this.set("authenticated", options.authenticated); }
                    if (options.firstName) { this.set("firstName", options.firstName); }
                    if (options.email) { this.set("email", options.email); }
                    if (options.selectedCompany) {
                        this.set("selectedCompany", new CompanyModel(options.selectedCompany));
                    }
                }
            },

            reset: function () {
                this.set(this.defaults);
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
