define(["globals", "utils", "models/CompanyAjaxModel"],
    function (globals, utils, CompanyAjaxModel) {

        "use strict";


        var DriverAddModel = CompanyAjaxModel.extend({
            defaults: function () {
                return utils._.extend({}, utils.deepClone(CompanyAjaxModel.prototype.defaults), {
                    "driverId"     : null,
                    "firstName"    : null,
                    "middleInitial": null,
                    "lastName"     : null,
                    "departmentId" : null
                });
            },

            urlRoot: globals.driverAdd.constants.WEBSERVICE,

            //TODO: Add the custom patterns to Backbone.Validation.patterns for reuse
            validation: {
                "driverId": [
                    {
                        required: true, // Must be set to accurately reflect the selected company's settings
                        msg     : globals.driverAdd.constants.ERROR_DRIVER_ID_REQUIRED_FIELD
                    },
                    {
                        length  : 4,    // Must be set to accurately reflect the selected company's settings
                        msg     : globals.driverAdd.constants.ERROR_DRIVER_ID_INVALID_LENGTH
                    },
                    {
                        pattern : "digits",
                        msg     : globals.driverAdd.constants.ERROR_DRIVER_ID_INVALID_FORMAT
                    }
                ],
                "firstName": [
                    {
                        required: true,
                        msg: globals.driverAdd.constants.ERROR_FIRST_NAME_REQUIRED_FIELD
                    },
                    {
                        maxLength: 11, //TODO: Get from current user's online application settings
                        msg: globals.driverAdd.constants.ERROR_FIRST_NAME_INVALID_LENGTH
                    },
                    {
                        pattern: /^[A-Z\d`~&_\-+{}|:',.\/]+$/i,
                        msg: globals.driverAdd.constants.ERROR_FIRST_NAME_INVALID_CHARACTERS
                    }
                ],
                "middleInitial": [
                    {
                        required: false,
                        maxLength: 1,  //TODO: Get from current user's online application settings
                        msg: globals.driverAdd.constants.ERROR_MIDDLE_NAME_INVALID_LENGTH
                    },
                    {
                        pattern: /^[A-Z]+$/i,
                        msg: globals.driverAdd.constants.ERROR_MIDDLE_NAME_INVALID_CHARACTERS
                    }
                ],
                "lastName": [
                    {
                        required: true,
                        msg: globals.driverAdd.constants.ERROR_LAST_NAME_REQUIRED_FIELD
                    },
                    {
                        maxLength: 12, //TODO: Get from current user's online application settings
                        msg: globals.driverAdd.constants.ERROR_LAST_NAME_INVALID_LENGTH
                    },
                    {
                        pattern: /^[A-Z\d`~&_\-+{}|:',.\/]+$/i,
                        msg: globals.driverAdd.constants.ERROR_LAST_NAME_INVALID_CHARACTERS
                    }
                ]
            },

            initialize: function (options) {
                DriverAddModel.__super__.initialize.apply(this, arguments);

                if (options) {
                    if (options.driverId) { this.set("driverId", options.driverId); }
                    if (options.firstName) { this.set("firstName", options.firstName); }
                    if (options.middleInitial) { this.set("middleInitial", options.middleInitial); }
                    if (options.lastName) { this.set("lastName", options.lastName); }
                    if (options.departmentId) { this.set("departmentId", options.departmentId); }
                }
            }
        });


        return DriverAddModel;
    });
