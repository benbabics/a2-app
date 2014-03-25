define(["globals", "models/AjaxModel"],
    function (globals, AjaxModel) {

        "use strict";


        var DriverAddModel = AjaxModel.extend({
            defaults: {
                "driverId"     : null,
                "firstName"    : null,
                "middleInitial": null,
                "lastName"     : null,
                "departmentId" : null
            },

            urlRoot: globals.driverAdd.constants.WEBSERVICE,

            validation: {
                "driverId": {
                    required: true, //TODO: Update this to reflect if company is set to use auto generated IDs
                    length  : 4, //TODO: Update to User.selectedCompany.driverIdLength
                    pattern : "digits",
                    msg     : globals.driverAdd.constants.ERROR_DRIVER_ID_REQUIRED_FIELD
                },
                "firstName": {
                    required: true,
                    maxLength: 11,
                    msg: globals.driverAdd.constants.ERROR_FIRST_NAME_REQUIRED_FIELD
                },
                "lastName": {
                    required: true,
                    maxLength: 12,
                    msg: globals.driverAdd.constants.ERROR_LAST_NAME_REQUIRED_FIELD
                }
            },

            initialize: function (options) {
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
