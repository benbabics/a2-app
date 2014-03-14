define(["backbone", "globals", "models/CompanyModel"],
    function (Backbone, globals, CompanyModel) {

        "use strict";


        var UserModel = Backbone.Model.extend({
            defaults: {
                "authenticated"  : false,
                "firstName"      : null,
                "email"          : null,
                "selectedCompany": null,
                "permissions"    : globals.userData.permissions
            },

            initialize: function (options) {
                if (options) {
                    if (options.authenticated) { this.set("authenticated", options.authenticated); }
                    if (options.firstName) { this.set("firstName", options.firstName); }
                    if (options.email) { this.set("email", options.email); }
                    if (options.selectedCompany) {
                        this.set("selectedCompany", new CompanyModel(options.selectedCompany));
                    }
                    if (options.permissions) { this.setPermissions(options.permissions); }
                }
            },

            reset: function () {
                this.set(this.defaults);
            },

            setPermissions: function (permsList) {
                var newPerms = this.defaults.permissions; // start with the permission defaults

                // Set only the permissions from the list to true
                for (var i = 0; i < permsList.length; i++) {
                    newPerms[permsList[i]] = true;
                }

                this.set("permissions", newPerms);
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
