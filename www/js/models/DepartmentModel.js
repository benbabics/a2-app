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
                    if (options.name) { this.set("name", options.name); }
                    if (options.visible) { this.set("visible", options.visible); }
                }
            }
        });

        return DepartmentModel;
    });
