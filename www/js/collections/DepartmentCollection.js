define([ "globals", "utils", "backbone", "models/DepartmentModel" ],
    function (globals, utils, Backbone, DepartmentModel) {

        "use strict";

        var DepartmentCollection = Backbone.Collection.extend({
            model: DepartmentModel,

            toJSON: function () {
                var json = null,
                    index = 0;

                if (this.length > 0) {
                    json = [];
                    this.each(function (department) {
                        json[index] = department.toJSON();
                        index++;
                    }, this);
                }

                return json;
            }
        });

        return DepartmentCollection;
    });
