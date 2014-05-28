define(["backbone", "globals", "utils", "collections/HierarchyCollection", "models/CompanyModel",
        "models/HierarchyModel"],
    function (Backbone, globals, utils, HierarchyCollection, CompanyModel, HierarchyModel) {

        "use strict";


        var UserModel = Backbone.Model.extend({
            defaults: {
                "authenticated"      : false,
                "firstName"          : null,
                "email"              : null,
                "selectedCompany"    : null,
                "hasMultipleAccounts": false,
                "hierarchies"        : null
            },

            parse: function (options) {
                var selectedCompany;

                if (options) {
                    if (options.authenticated) { this.set("authenticated", options.authenticated); }
                    if (options.firstName) { this.set("firstName", options.firstName); }
                    if (options.email) { this.set("email", options.email); }
                    if (options.selectedCompany) {
                        selectedCompany = new CompanyModel();
                        selectedCompany.parse(options.selectedCompany);
                        this.set("selectedCompany", selectedCompany);
                    }
                    if (options.hasMultipleAccounts) { this.set("hasMultipleAccounts", options.hasMultipleAccounts); }
                    if (options.hierarchyDetails) { this.setHierarchies(options.hierarchyDetails); }
                }
            },

            setHierarchies: function (hierarchiesList) {
                var hierarchies = new HierarchyCollection(),
                    hierarchy;

                utils._.each(hierarchiesList, function (hierarchyOptions) {
                    hierarchy = new HierarchyModel();
                    hierarchy.parse(hierarchyOptions);
                    hierarchies.add(hierarchy);
                });

                this.set("hierarchies", hierarchies);
            },

            reset: function () {
                this.set(this.defaults);
            },

            toJSON: function () {
                var json = UserModel.__super__.toJSON.apply(this, arguments);

                if (json.selectedCompany) {
                    json.selectedCompany = json.selectedCompany.toJSON();
                }
                if (json.hierarchies) {
                    json.hierarchies = json.hierarchies.toJSON();
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
