define(["backbone", "mustache", "globals", "utils", "models/UserModel", "models/DepartmentModel",
        "models/AjaxModel"],
    function (Backbone, Mustache, globals, utils, UserModel, DepartmentModel, AjaxModel) {

        "use strict";


        var DriverModel = AjaxModel.extend({
            defaults: function () {
                return utils._.extend({}, utils.deepClone(AjaxModel.prototype.defaults), {
                    "id"           : null,
                    "firstName"    : null,
                    "middleName"   : null,
                    "lastName"     : null,
                    "status"       : null,
                    "statusDate"   : null,
                    "department"   : null,
                    "formattedName": null
                });
            },

            urlRoot: function () {
                return globals.WEBSERVICE.ACCOUNTS.URL + "/"  +
                    UserModel.getInstance().get("selectedCompany").get("accountId") +
                    globals.WEBSERVICE.DRIVER_PATH;
            },

            //TODO: Add the custom patterns to Backbone.Validation.patterns for reuse
            validation: {
                "id": [
                    {
                        required: function(value, attr, computedState) {
                            return UserModel.getInstance().get("selectedCompany").get("requiredFields").DRIVER_ID;
                        },
                        msg     : globals.driver.constants.ERROR_DRIVER_ID_REQUIRED_FIELD
                    },
                    {
                        fn: function(value, attr, computedState) {
                            var user = UserModel.getInstance().toJSON(),
                                expectedLength = user.selectedCompany.settings.driverSettings.idFixedLength;
                            if (utils._.isString(value) && value.length !== expectedLength) {
                                return Mustache.render(globals.driver.constants.ERROR_DRIVER_ID_INVALID_LENGTH, {
                                    "idFixedLength": expectedLength
                                });
                            }
                        }
                    },
                    {
                        pattern : "digits",
                        msg     : globals.driver.constants.ERROR_DRIVER_ID_INVALID_FORMAT
                    }
                ],
                "firstName": [
                    {
                        required: true,
                        msg: globals.driver.constants.ERROR_FIRST_NAME_REQUIRED_FIELD
                    },
                    {
                        fn: function(value, attr, computedState) {
                            var user = UserModel.getInstance().toJSON(),
                                expectedLength = user.selectedCompany.settings.driverSettings.firstNameMaxLength;
                            if (utils._.isString(value) && value.length > expectedLength) {
                                return Mustache.render(globals.driver.constants.ERROR_FIRST_NAME_INVALID_LENGTH, {
                                    "firstNameMaxLength": expectedLength
                                });
                            }
                        }
                    },
                    {
                        pattern: /^[A-Z\d`~&_\-+{}|:',.\/]+$/i,
                        msg: globals.driver.constants.ERROR_FIRST_NAME_INVALID_CHARACTERS
                    }
                ],
                "middleName": [
                    {
                        fn: function(value, attr, computedState) {
                            var user = UserModel.getInstance().toJSON(),
                                expectedLength = user.selectedCompany.settings.driverSettings.middleNameMaxLength;
                            if (utils._.isString(value) && value.length > expectedLength) {
                                return Mustache.render(globals.driver.constants.ERROR_MIDDLE_NAME_INVALID_LENGTH, {
                                    "middleNameMaxLength": expectedLength
                                });
                            }
                        }
                    },
                    {
                        required: false,
                        pattern: /^[A-Z]+$/i,
                        msg: globals.driver.constants.ERROR_MIDDLE_NAME_INVALID_CHARACTERS
                    }
                ],
                "lastName": [
                    {
                        required: true,
                        msg: globals.driver.constants.ERROR_LAST_NAME_REQUIRED_FIELD
                    },
                    {
                        fn: function(value, attr, computedState) {
                            var user = UserModel.getInstance().toJSON(),
                                expectedLength = user.selectedCompany.settings.driverSettings.lastNameMaxLength;
                            if (utils._.isString(value) && value.length > expectedLength) {
                                return Mustache.render(globals.driver.constants.ERROR_LAST_NAME_INVALID_LENGTH, {
                                    "lastNameMaxLength": expectedLength
                                });
                            }
                        }
                    },
                    {
                        pattern: /^[A-Z\d`~&_\-+{}|:',.\/]+$/i,
                        msg: globals.driver.constants.ERROR_LAST_NAME_INVALID_CHARACTERS
                    }
                ]
            },

            initialize: function (options) {
                var department;

                DriverModel.__super__.initialize.apply(this, arguments);

                if (options) {
                    if (options.id) { this.set("id", options.id); }
                    if (options.firstName) { this.set("firstName", options.firstName); }
                    if (options.middleName) { this.set("middleName", options.middleName); }
                    if (options.lastName) { this.set("lastName", options.lastName); }
                    if (options.status) { this.set("status", options.status); }
                    if (options.statusDate) { this.set("statusDate", options.statusDate); }
                    if (options.department) {
                        department = new DepartmentModel();
                        department.initialize(options.department);
                        this.set("department", department);
                    }
                }

                this.formatAttributes();
            },

            formatAttributes: function () {
                var self = this;


                // set formatted attributes
                this.set("formattedName", function () {
                    var formmattedName = "";

                    if (self.get("lastName")) {
                        formmattedName += self.get("lastName");
                    }

                    if (self.get("firstName")) {
                        if (formmattedName.length > 0) {
                            formmattedName += ", ";
                        }
                        formmattedName += self.get("firstName");

                        if (self.get("middleName")) {
                            if (formmattedName.length > 0) {
                                formmattedName += " ";
                            }
                            formmattedName += self.get("middleName");
                        }
                    }

                    return formmattedName;
                });
            },

            sync: function (method, model, options) {
                if (method === "patch") {
                    options.type = "POST";
                }

                DriverModel.__super__.sync.call(this, method, model, options);
            },

            add: function (options) {
                var attributes = {
                    "id"          : this.get("id"),
                    "firstName"   : this.get("firstName"),
                    "middleName"  : this.get("middleName"),
                    "lastName"    : this.get("lastName"),
                    "departmentId": this.get("department").get("id")
                };

                options.patch = true;
                // Override default url as backbone will try to POST to urlRoot()/{{id}} when an id is known
                this.url = this.urlRoot();
                this.save(attributes, options);
            },

            changeStatus: function (updatedStatus, options) {
                options.patch = true;
                this.save("status", updatedStatus, options);
            },

            toJSON: function () {
                var json = DriverModel.__super__.toJSON.apply(this, arguments);

                if (json.department) {
                    json.department = json.department.toJSON();
                }

                return json;
            }
        });

        return DriverModel;
    });
