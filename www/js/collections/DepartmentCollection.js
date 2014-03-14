define([ "globals", "backbone", "models/DepartmentModel" ],
    function (globals, Backbone, DepartmentModel) {

        "use strict";

        var DepartmentCollection = Backbone.Collection.extend({
            model: DepartmentModel
        });

        return DepartmentCollection;
    });
