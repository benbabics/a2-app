define([ "models/DepartmentModel", "collections/BaseCollection" ],
    function (DepartmentModel, BaseCollection) {

        "use strict";

        var DepartmentCollection = BaseCollection.extend({
            model: DepartmentModel
        });

        return DepartmentCollection;
    });
