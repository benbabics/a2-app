define(["globals", "models/AjaxModel"],
    function (globals, AjaxModel) {

        "use strict";


        var DriverReactivateModel = AjaxModel.extend({
            defaults: {
                "driverId": null
            },

            urlRoot: globals.driverReactivate.constants.WEBSERVICE,

            initialize: function (options) {
                if (options) {
                    if (options.driverId) { this.set("driverId", options.driverId); }
                }
            }
        });


        return DriverReactivateModel;
    });
