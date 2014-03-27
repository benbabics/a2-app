define(["globals", "utils", "models/CompanyAjaxModel"],
    function (globals, utils, CompanyAjaxModel) {

        "use strict";


        var DriverTerminateModel = CompanyAjaxModel.extend({
            defaults: function () {
                return utils._.extend({}, utils.deepClone(CompanyAjaxModel.prototype.defaults), {
                    "driverId": null
                });
            },

            urlRoot: globals.driverTerminate.constants.WEBSERVICE,

            initialize: function (options) {
                DriverTerminateModel.__super__.initialize.apply(this, arguments);

                if (options) {
                    if (options.driverId) { this.set("driverId", options.driverId); }
                }
            }
        });


        return DriverTerminateModel;
    });
