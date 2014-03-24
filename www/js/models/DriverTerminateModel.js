define(["globals", "models/AjaxModel"],
    function (globals, AjaxModel) {

        "use strict";


        var DriverTerminateModel = AjaxModel.extend({
            defaults: {
                "driverId": null
            },

            urlRoot: globals.driverTerminate.constants.WEBSERVICE,

            initialize: function (options) {
                if (options) {
                    if (options.driverId) { this.set("driverId", options.driverId); }
                }
            }
        });


        return DriverTerminateModel;
    });
