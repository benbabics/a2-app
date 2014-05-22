define(["backbone", "globals", "models/CompanyModel"],
    function (Backbone, globals, CompanyModel) {

        "use strict";


        var UserModel = Backbone.Model.extend({
            defaults: {
                "authenticated"      : false,
                "firstName"          : null,
                "email"              : null,
                "selectedCompany"    : null,
                "hasMultipleAccounts": false
            },

            initialize: function (options) {
                var selectedCompany;

                if (options) {
                    if (options.authenticated) { this.set("authenticated", options.authenticated); }
                    if (options.firstName) { this.set("firstName", options.firstName); }
                    if (options.email) { this.set("email", options.email); }
                    if (options.selectedCompany) {
                        selectedCompany = new CompanyModel();
                        selectedCompany.initialize(options.selectedCompany);
                        this.set("selectedCompany", selectedCompany);
                    }
                    if (options.hasMultipleAccounts) { this.set("hasMultipleAccounts", options.hasMultipleAccounts);}
                }
            },

            reset: function () {
                this.set(this.defaults);
            },

            toJSON: function () {
                var json = UserModel.__super__.toJSON.apply(this, arguments);

                if (json.selectedCompany) {
                    json.selectedCompany = json.selectedCompany.toJSON();
                }

                return json;
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
