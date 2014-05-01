define(["backbone", "mustache", "globals", "utils", "models/UserModel", "models/DepartmentModel",
        "models/AjaxModel"],
    function (Backbone, Mustache, globals, utils, UserModel, DepartmentModel, AjaxModel) {

        "use strict";


        var CardModel = AjaxModel.extend({
            defaults: function () {
                return utils._.extend({}, utils.deepClone(AjaxModel.prototype.defaults), {
                    "idAttribute"             : "number",
                    "id"                      : null,
                    "authorizationProfileName": null,
                    "status"                  : null,
                    "department"              : null,
                    "customVehicleId"         : null,
                    "vehicleDescription"      : null,
                    "licensePlateNumber"      : null,
                    "licensePlateState"       : null,
                    "vin"                     : null
                });
            },

            urlRoot: function () {
                return globals.WEBSERVICE.ACCOUNTS.URL + "/"  +
                    UserModel.getInstance().get("selectedCompany").get("accountId") +
                    globals.WEBSERVICE.CARD_PATH;
            },

            validation: {
                "customVehicleId": [
                    {
                        required: function (value, attr, computedState) {
                            return UserModel.getInstance().get("selectedCompany")
                                .get("requiredFields").COMPANY_VEHICLE_NUMBER;
                        },
                        msg: globals.card.constants.ERROR_CUSTOMER_VEHICLE_ID_REQUIRED_FIELD
                    },
                    {
                        fn: function (value, attr, computedState) {
                            var user = UserModel.getInstance().toJSON(),
                                maxLength = user.selectedCompany.settings.cardSettings.customVehicleIdMaxLength;
                            if (utils._.isString(value) && value.length > maxLength) {
                                return Mustache.render(globals.card.constants.ERROR_CUSTOMER_VEHICLE_ID_INVALID_LENGTH,
                                    {
                                        "maxLength": maxLength
                                    });
                            }
                        }
                    },
                    {
                        pattern: globals.APP.ALPHANUMERIC_WITH_SPACE_PATTERN,
                        msg    : globals.card.constants.ERROR_CUSTOMER_VEHICLE_ID_INVALID_CHARACTERS
                    }
                ],
                "vehicleDescription": [
                    {
                        required: function (value, attr, computedState) {
                            return UserModel.getInstance().get("selectedCompany")
                                .get("requiredFields").VEHICLE_DESCRIPTION;
                        },
                        msg: globals.card.constants.ERROR_VEHICLE_DESCRIPTION_REQUIRED_FIELD
                    },
                    {
                        fn: function (value, attr, computedState) {
                            var user = UserModel.getInstance().toJSON(),
                                maxLength = user.selectedCompany.settings.cardSettings.vehicleDescriptionMaxLength;
                            if (utils._.isString(value) && value.length > maxLength) {
                                return Mustache.render(globals.card.constants.ERROR_VEHICLE_DESCRIPTION_INVALID_LENGTH,
                                    {
                                        "maxLength": maxLength
                                    });
                            }
                        }
                    },
                    {
                        pattern: globals.APP.ALPHANUMERIC_WITH_SPACE_PATTERN,
                        msg    : globals.card.constants.ERROR_VEHICLE_DESCRIPTION_INVALID_CHARACTERS
                    }
                ],
                "vin": [
                    {
                        required: function (value, attr, computedState) {
                            return UserModel.getInstance().get("selectedCompany").get("requiredFields").VIN_NUMBER;
                        },
                        msg: globals.card.constants.ERROR_VIN_REQUIRED_FIELD
                    },
                    {
                        fn: function (value, attr, computedState) {
                            var user = UserModel.getInstance().toJSON(),
                                fixedLength = user.selectedCompany.settings.cardSettings.vinFixedLength;
                            if (utils._.isString(value) && value.length !== fixedLength) {
                                return Mustache.render(globals.card.constants.ERROR_VIN_INVALID_LENGTH,
                                    {
                                        "fixedLength": fixedLength
                                    });
                            }
                        }
                    },
                    {
                        pattern: globals.APP.ALPHANUMERIC_PATTERN,
                        msg    : globals.card.constants.ERROR_VIN_INVALID_CHARACTERS
                    }
                ],
                "licensePlateNumber": [
                    {
                        required: function (value, attr, computedState) {
                            return UserModel.getInstance().get("selectedCompany")
                                .get("requiredFields").LICENSE_PLATE_NUMBER;
                        },
                        msg: globals.card.constants.ERROR_LICENSE_PLATE_NUMBER_REQUIRED_FIELD
                    },
                    {
                        fn: function (value, attr, computedState) {
                            var user = UserModel.getInstance().toJSON(),
                                maxLength = user.selectedCompany.settings.cardSettings.licensePlateNumberMaxLength;
                            if (utils._.isString(value) && value.length > maxLength) {
                                return Mustache.render(globals.card.constants.ERROR_LICENSE_PLATE_NUMBER_INVALID_LENGTH,
                                    {
                                        "maxLength": maxLength
                                    });
                            }
                        }
                    },
                    {
                        pattern: globals.APP.ALPHANUMERIC_WITH_SPACE_PATTERN,
                        msg    : globals.card.constants.ERROR_LICENSE_PLATE_NUMBER_INVALID_CHARACTERS
                    }
                ]
            },

            initialize: function (options) {
                var department;

                CardModel.__super__.initialize.apply(this, arguments);

                if (options) {
                    if (options.number) { this.set("id", options.number); }
                    if (options.authorizationProfileName) {
                        this.set("authorizationProfileName", options.authorizationProfileName);
                    }
                    if (options.status) { this.set("status", options.status); }
                    if (options.department) {
                        department = new DepartmentModel();
                        department.initialize(options.department);
                        this.set("department", department);
                    }
                    if (options.customVehicleId) { this.set("customVehicleId", options.customVehicleId); }
                    if (options.vehicleDescription) { this.set("vehicleDescription", options.vehicleDescription); }
                    if (options.licensePlateNumber) { this.set("licensePlateNumber", options.licensePlateNumber); }
                    if (options.licensePlateState) { this.set("licensePlateState", options.licensePlateState); }
                    if (options.vin) { this.set("vin", options.vin); }
                }
            },

            sync: function (method, model, options) {
                if (method === "patch") {
                    options.type = "POST";
                }

                CardModel.__super__.sync.call(this, method, model, options);
            },

            add: function (shippingOptions, options) {
                var attributes = {
                    "customVehicleId"         : this.get("customVehicleId"),
                    "vehicleDescription"      : this.get("vehicleDescription"),
                    "vin"                     : this.get("vin"),
                    "licensePlateNumber"      : this.get("licensePlateNumber"),
                    "licensePlateState"       : this.get("licensePlateState"),
                    "authorizationProfileName": this.get("authorizationProfileName"),
                    "departmentId"            : this.get("department").get("id"),
                    "shippingMethod"          : shippingOptions.shippingMethod.id,
                    "firstName"               : shippingOptions.firstName,
                    "lastName"                : shippingOptions.lastName,
                    "companyName"             : shippingOptions.companyName,
                    "address1"                : shippingOptions.addressLine1,
                    "address2"                : shippingOptions.addressLine2,
                    "city"                    : shippingOptions.city,
                    "state"                   : shippingOptions.state,
                    "postalCode"              : shippingOptions.postalCode,
                    "countryCode"             : shippingOptions.countryCode,
                    "residence"               : shippingOptions.residence
                };

                options.patch = true;
                // Set the ID to fake backbone into thinking the model is NOT new, so it will not try to create it
                this.set("id", 1);
                // Override default url as backbone will try to POST to urlRoot()/{{id}} when an id is known
                this.url = this.urlRoot();
                this.save(attributes, options);
            },

            edit: function (shippingOptions, options) {
                var attributes = {
                    "customVehicleId"         : this.get("customVehicleId"),
                    "vehicleDescription"      : this.get("vehicleDescription"),
                    "vin"                     : this.get("vin"),
                    "licensePlateNumber"      : this.get("licensePlateNumber"),
                    "licensePlateState"       : this.get("licensePlateState"),
                    "authorizationProfileName": this.get("authorizationProfileName"),
                    "departmentId"            : this.get("department").get("id")
                };

                if (shippingOptions) {
                    attributes.shippingMethod = shippingOptions.shippingMethod.id;
                    attributes.firstName = shippingOptions.firstName;
                    attributes.lastName = shippingOptions.lastName;
                    attributes.companyName = shippingOptions.companyName;
                    attributes.address1 = shippingOptions.addressLine1;
                    attributes.address2 = shippingOptions.addressLine2;
                    attributes.city = shippingOptions.city;
                    attributes.state = shippingOptions.state;
                    attributes.postalCode = shippingOptions.postalCode;
                    attributes.countryCode = shippingOptions.countryCode;
                    attributes.residence = shippingOptions.residence;
                }

                options.patch = true;
                this.save(attributes, options);
            },

            terminate: function (options) {
                var attributes = {},
                    originalUrl = this.url();

                options.patch = true;
                // Override default url as backbone will try to POST to urlRoot()/{{id}} when an id is known
                this.url = originalUrl + globals.WEBSERVICE.CARDS.TERMINATE_PATH;
                this.save(attributes, options);
            },

            toJSON: function () {
                var json = CardModel.__super__.toJSON.apply(this, arguments);

                if (json.department) {
                    json.department = json.department.toJSON();
                }

                return json;
            }
        });

        return CardModel;
    });
