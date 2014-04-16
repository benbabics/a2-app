define(["backbone", "globals", "utils", "models/CompanySettingsModel", "models/DepartmentModel",
        "collections/DepartmentCollection"],
    function (Backbone, globals, utils, CompanySettingsModel, DepartmentModel, DepartmentCollection) {

        "use strict";


        var CompanyModel = Backbone.Model.extend({
            defaults: {
                "name"            : null,
                "accountId"       : null,
                "wexAccountNumber": null,
                "departments"     : null,
                "requiredFields"  : globals.companyData.requiredFields,
                "settings"        : null
            },

            initialize: function (options) {
                var settings;

                if (options) {
                    if (options.name) { this.set("name", options.name); }
                    if (options.accountId) { this.set("accountId", options.accountId); }
                    if (options.wexAccountNumber) { this.set("wexAccountNumber", options.wexAccountNumber); }
                    if (options.departments) { this.setDepartments(options.departments); }
                    if (options.requiredFields) { this.setRequiredFields(options.requiredFields); }
                    if (options.settings) {
                        settings = new CompanySettingsModel();
                        settings.initialize(options.settings);
                        this.set("settings", settings);
                    }
                }
            },

            setDepartments: function (departmentsList) {
                var departments = new DepartmentCollection(),
                    department;

                departments.reset([]);
                utils._.each(departmentsList, function (departmentOptions) {
                    department = new DepartmentModel();
                    department.initialize(departmentOptions);
                    departments.add(department);
                });

                this.set("departments", departments);
            },

            setRequiredFields: function (requiredFieldsList) {
                var newRequiredFields = this.defaults.requiredFields; // start with the defaults

                // Set only the required fields from the list to true
                for (var i = 0; i < requiredFieldsList.length; i++) {
                    newRequiredFields[requiredFieldsList[i]] = true;
                }

                this.set("requiredFields", newRequiredFields);
            },

            toJSON: function () {
                var json = CompanyModel.__super__.toJSON.apply(this, arguments);

                if (json.departments) {
                    json.departments = json.departments.toJSON();
                }
                if (json.settings) {
                    json.settings = json.settings.toJSON();
                }

                return json;
            }
        });

        return CompanyModel;
    });
