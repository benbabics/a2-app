define([ "models/HierarchyModel", "collections/BaseCollection" ],
    function (HierarchyModel, BaseCollection) {

        "use strict";

        var HierarchyCollection = BaseCollection.extend({
            model: HierarchyModel
        });

        return HierarchyCollection;
    });
