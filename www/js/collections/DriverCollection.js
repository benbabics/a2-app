define([ "globals", "backbone", "models/DriverModel" ],
    function (globals, Backbone, DriverModel) {

        "use strict";

        var DriverCollection = Backbone.Collection.extend({
            model: DriverModel
        });

        return DriverCollection;
    });
