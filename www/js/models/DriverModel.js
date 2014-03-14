define(["backbone", "utils", "models/DepartmentModel", "backbone-relational"],
    function (Backbone, utils, DepartmentModel) {

        "use strict";


        var DriverModel = Backbone.RelationalModel.extend({
            defaults: {
                "driverId"  : null,
                "firstName" : null,
                "middleName": null,
                "lastName"  : null,
                "status"    : null,
                "statusDate": null,
                "department": null
            },

            relations: [
                {
                    type: Backbone.HasOne,
                    key: "department",
                    relatedModel: DepartmentModel
                }
            ],

            initialize: function (options) {
                var department;

                if (options) {
                    if (options.driverId) { this.set("driverId", options.driverId); }
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
            }
        });

        return DriverModel;
    });
