define(["backbone", "backbone-relational"],
    function (Backbone) {

        "use strict";


        var DepartmentModel = Backbone.RelationalModel.extend({
            defaults: {
                // Using "id" will cause backbone-relational to keep track of the object in a store and throw an error
                // if there is another model with the same id value
                "departmentId": null,
                "name"        : null,
                "visible"     : false
            },

            initialize: function (options) {
                if (options) {
                    if (options.id) { this.set("departmentId", options.id); }

                    // This model gets used by multiple services,
                    // some of which return name and others return displayValue
                    if (options.name) {
                        this.set("name", options.name);
                    }
                    else if (options.displayValue) {
                        this.set("name", options.displayValue);
                    }
                    if (options.visible) { this.set("visible", options.visible); }
                }
            }
        });

        return DepartmentModel;
    });
