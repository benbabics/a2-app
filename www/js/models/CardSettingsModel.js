define(["backbone"],
    function (Backbone) {

        "use strict";


        var CardSettingsModel = Backbone.Model.extend({
            defaults: {
                "customVehicleIdMaxLength"    : null,
                "licensePlateNumberMaxLength" : null,
                "licensePlateStateFixedLength": null,
                "vehicleDescriptionMaxLength" : null,
                "vinFixedLength"              : null
            },

            initialize: function (options) {
                if (options) {
                    if (options.customVehicleIdMaxLength) {
                        this.set("customVehicleIdMaxLength", options.customVehicleIdMaxLength);
                    }
                    if (options.licensePlateNumberMaxLength) {
                        this.set("licensePlateNumberMaxLength", options.licensePlateNumberMaxLength);
                    }
                    if (options.licensePlateStateFixedLength) {
                        this.set("licensePlateStateFixedLength", options.licensePlateStateFixedLength);
                    }
                    if (options.vehicleDescriptionMaxLength) {
                        this.set("vehicleDescriptionMaxLength", options.vehicleDescriptionMaxLength);
                    }
                    if (options.vinFixedLength) {
                        this.set("vinFixedLength", options.vinFixedLength);
                    }
                }
            }
        });

        return CardSettingsModel;
    });
