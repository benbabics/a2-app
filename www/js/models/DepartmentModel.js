define(["backbone"],
    function (Backbone) {

        "use strict";


        var DepartmentModel = Backbone.Model.extend({
            defaults: {
                "id"     : null,
                "name"   : null,
                "visible": false
            },

            initialize: function (options) {
                if (options) {
                    if (options.id) { this.set("id", options.id); }

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
