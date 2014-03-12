define(["backbone", "utils", "models/DepartmentModel"],
    function (Backbone, utils, DepartmentModel) {

        "use strict";


        var CompanyModel = Backbone.Model.extend({
            defaults: {
                "name"            : null,
                "wexAccountNumber": null,
                "driverIdLength"  : null,
                "departments"     : null
            },

            initialize: function (options) {
                var departments = [];

                if (options) {
                    if (options.name) { this.set("name", options.name); }
                    if (options.wexAccountNumber) { this.set("wexAccountNumber", options.wexAccountNumber); }
                    if (options.driverIdLength) { this.set("driverIdLength", options.driverIdLength); }
                    if (options.departments) {
                        utils._.each(options.departments, function (department) {
                            departments.push(new DepartmentModel(department));
                        });

                        this.set("departments", departments);
                    }
                }
            }
        });

        return CompanyModel;
    });
