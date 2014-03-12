define(["backbone"],
    function (Backbone) {

        "use strict";


        var DriverSearchModel = Backbone.Model.extend({
            defaults: {
                "filterFirstName"   : null,
                "filterLastName"    : null,
                "filterDriverId"    : null,
                "filterStatus"      : null,
                "filterDepartmentId": null
            },

            initialize: function () {
            }
        });


        return DriverSearchModel;
    });
