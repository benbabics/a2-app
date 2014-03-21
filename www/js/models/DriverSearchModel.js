define(["backbone"],
    function (Backbone) {

        "use strict";


        var DriverSearchModel = Backbone.Model.extend({
            defaults: {
                "accountId"         : null,
                "filterFirstName"   : null,
                "filterLastName"    : null,
                "filterDriverId"    : null,
                "filterStatus"      : null,
                "filterDepartmentId": null
            }
        });


        return DriverSearchModel;
    });
