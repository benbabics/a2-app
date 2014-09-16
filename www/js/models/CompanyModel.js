define(["backbone", "globals", "utils", "models/AddressModel", "models/AjaxModel", "models/AuthorizationProfileModel",
        "models/CompanySettingsModel", "models/DepartmentModel", "models/ShippingMethodModel",
        "collections/AuthorizationProfileCollection", "collections/BankAccountCollection",
        "collections/DepartmentCollection", "collections/ShippingMethodCollection"],
    function (Backbone, globals, utils, AddressModel, AjaxModel, AuthorizationProfileModel, CompanySettingsModel,
              DepartmentModel, ShippingMethodModel, AuthorizationProfileCollection, BankAccountCollection,
              DepartmentCollection, ShippingMethodCollection) {

        "use strict";


        var CompanyModel = AjaxModel.extend({
            defaults: function () {
                return utils._.extend({}, utils.deepClone(AjaxModel.prototype.defaults), {
                    "name"                  : null,
                    "accountId"             : null,
                    "wexAccountNumber"      : null,
                    "departments"           : null,
                    "requiredFields"        : globals.companyData.requiredFields,
                    "settings"              : null,
                    "authorizationProfiles" : null,
                    "bankAccounts"          : null,
                    "defaultShippingAddress": null,
                    "shippingMethods"       : null,
                    "permissions"           : globals.companyData.permissions
                });
            },

            urlRoot: function () {
                return globals.WEBSERVICE.ACCOUNTS.URL + "/"  + this.get("accountId");
            },

            parse: function (options) {
                var settings,
                    defaultShippingAddress;

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
                    if (options.defaultShippingAddress) {
                        defaultShippingAddress = new AddressModel();
                        defaultShippingAddress.initialize(options.defaultShippingAddress);
                        this.set("defaultShippingAddress", defaultShippingAddress);
                    }
                    if (options.shippingMethods) { this.setShippingMethods(options.shippingMethods); }
                    if (options.permissions) { this.setPermissions(options.permissions); }
                }
            },

            sync: function (method, model, options) {
                if (method === "patch") {
                    options.type = "POST";
                }

                CompanyModel.__super__.sync.call(this, method, model, options);
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

            setPermissions: function (permsList) {
                // start with the permission defaults
                var newPerms = utils._.extend({}, utils.deepClone(this.defaults().permissions));

                // Set only the permissions from the list to true
                for (var i = 0; i < permsList.length; i++) {
                    newPerms[permsList[i]] = true;
                }

                this.set("permissions", newPerms);
            },

            setRequiredFields: function (requiredFieldsList) {
                var index,
                    // start with the defaults
                    newRequiredFields = utils._.extend({}, utils.deepClone(this.defaults().requiredFields));

                // Set only the required fields from the list to true
                for (index = 0; index < requiredFieldsList.length; index++) {
                    newRequiredFields[requiredFieldsList[index]] = true;
                }

                this.set("requiredFields", newRequiredFields);
            },

            setShippingMethods: function (shippingMethodsList) {
                var shippingMethods = new ShippingMethodCollection(),
                    shippingMethod;

                shippingMethods.reset([]);
                utils._.each(shippingMethodsList, function (shippingMethodOptions) {
                    shippingMethod = new ShippingMethodModel();
                    shippingMethod.initialize(shippingMethodOptions);
                    shippingMethods.add(shippingMethod);
                });

                this.set("shippingMethods", shippingMethods);
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
                if (json.bankAccounts) {
                    json.bankAccounts = json.bankAccounts.toJSON();
                }
                if (json.defaultShippingAddress) {
                    json.defaultShippingAddress = json.defaultShippingAddress.toJSON();
                }
                if (json.shippingMethods) {
                    json.shippingMethods = json.shippingMethods.toJSON();
                }

                return json;
            },

            fetchAuthorizationProfiles: function () {
                var deferred   = utils.Deferred(),
                    authorizationProfiles = new AuthorizationProfileCollection(),
                    self = this;

                utils
                    .when(
                        this.fetchCollection(authorizationProfiles, this.toJSON())
                    )
                    .done(function () {
                        deferred.resolve(
                            self.set("authorizationProfiles", authorizationProfiles)
                        );
                    })
                    .fail(function () {
                        deferred.reject();
                    });

                return deferred.promise();
            },

            fetchBankAccounts: function () {
                var deferred   = utils.Deferred(),
                    bankAccounts = new BankAccountCollection(),
                    self = this;

                utils
                    .when(
                        this.fetchCollection(bankAccounts, this.toJSON())
                    )
                    .done(function () {
                        deferred.resolve(
                            self.set("bankAccounts", bankAccounts)
                        );
                    })
                    .fail(function () {
                        deferred.reject();
                    });

                return deferred.promise();
            },

            fetchCollection: function (collection, data) {
                var deferred = utils.Deferred();

                collection
                    .once("sync",
                        function () {
                            deferred.resolve();
                        },
                        this)
                    .once("error",
                        function () {
                            deferred.reject();
                        },
                        this)
                    .fetch(data); // fetch new data with supplied params

                return deferred.promise();
            },

            areFetchedPropertiesEmpty: function () {
                var authorizationProfiles = this.get("authorizationProfiles"),
                    bankAccounts = this.get("bankAccounts");

                return (!authorizationProfiles ||
                    utils._.isEmpty(authorizationProfiles) ||
                    utils._.size(authorizationProfiles) === 0 ||
                    !bankAccounts ||
                    utils._.isEmpty(bankAccounts) ||
                    utils._.size(bankAccounts) === 0);
            }
        });

        return CompanyModel;
    });
