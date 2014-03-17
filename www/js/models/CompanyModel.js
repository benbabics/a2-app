define(["backbone", "utils", "models/DepartmentModel", "collections/DepartmentCollection", "backbone-relational"],
    function (Backbone, utils, DepartmentModel, DepartmentCollection) {

        "use strict";


        var CompanyModel = Backbone.RelationalModel.extend({
            defaults: {
                "name"            : null,
                "accountId"       : null,
                "wexAccountNumber": null,
                "driverIdLength"  : null,
                "departments"     : null
            },

            relations: [
                {
                    type: Backbone.HasMany,
                    key: "departments",
                    relatedModel: DepartmentModel,
                    collectionType: DepartmentCollection
                }
            ],

            initialize: function (options) {
                if (options) {
                    if (options.name) { this.set("name", options.name); }
                    if (options.accountId) { this.set("accountId", options.accountId); }
                    if (options.wexAccountNumber) { this.set("wexAccountNumber", options.wexAccountNumber); }
                    if (options.driverIdLength) { this.set("driverIdLength", options.driverIdLength); }
                    if (options.departments) { this.setDepartments(options.departments); }
                }
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
            }
        });

        return CompanyModel;
    });
