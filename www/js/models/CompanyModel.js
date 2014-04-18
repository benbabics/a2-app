define(["backbone", "globals", "utils", "models/AuthorizationProfileModel", "models/CompanySettingsModel",
        "models/DepartmentModel", "collections/AuthorizationProfileCollection", "collections/DepartmentCollection"],
    function (Backbone, globals, utils, AuthorizationProfileModel, CompanySettingsModel, DepartmentModel,
              AuthorizationProfileCollection, DepartmentCollection) {

        "use strict";


        var CompanyModel = Backbone.Model.extend({
            defaults: {
                "name"                 : null,
                "accountId"            : null,
                "wexAccountNumber"     : null,
                "departments"          : null,
                "requiredFields"       : globals.companyData.requiredFields,
                "settings"             : null,
                "authorizationProfiles": null
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

            /**
             * This function is overrode from Backbone and is ONLY used to retrieve a small portion of the companies
             * properties as many of them are set via the initialize function
             *
             * @param method - only a value of read results in properties being fetched
             * @param model
             * @param options
             * @returns {*}
             */
            sync: function (method, model, options) {
                var deferred = utils.Deferred();

                if (method === "read") {
                    utils
                        .when(
                            this.fetchAuthorizationProfiles()
                        )
                        .done(function () {
                            deferred.resolve();
                        })
                        .fail(function () {
                            deferred.reject();
                        });
                }

                return deferred.promise();
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
                var i,
                    newRequiredFields = this.defaults.requiredFields; // start with the defaults

                // Set only the required fields from the list to true
                for (i = 0; i < requiredFieldsList.length; i++) {
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
                if (json.authorizationProfiles) {
                    json.authorizationProfiles = json.authorizationProfiles.toJSON();
                }

                return json;
            },

            fetchAuthorizationProfiles: function () {
                var deferred   = utils.Deferred(),
                    authorizationProfiles = new AuthorizationProfileCollection(),
                    self = this;

                utils
                    .when(
                        utils.fetchCollection(authorizationProfiles, this.toJSON())
                    )
                    .done(function () {
                        deferred.resolve(
                            self.set("authorizationProfiles", authorizationProfiles)
                        );
                    });

                return deferred.promise();
            },

            areFetchedPropertiesEmpty: function () {
                var authorizationProfiles = this.get("authorizationProfiles");

                return (!authorizationProfiles ||
                    utils._.isEmpty(authorizationProfiles) ||
                    utils._.size(authorizationProfiles) === 0);
            }
        });

        return CompanyModel;
    });
