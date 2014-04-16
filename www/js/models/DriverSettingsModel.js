define(["backbone"],
    function (Backbone) {

        "use strict";


        var DriverSettingsModel = Backbone.Model.extend({
            defaults: {
                "idFixedLength"      : null,
                "firstNameMaxLength" : null,
                "middleNameMaxLength": null,
                "lastNameMaxLength"  : null
            },

            initialize: function (options) {
                if (options) {
                    if (options.idFixedLength) { this.set("idFixedLength", options.idFixedLength); }
                    if (options.firstNameMaxLength) { this.set("firstNameMaxLength", options.firstNameMaxLength); }
                    if (options.middleNameMaxLength) { this.set("middleNameMaxLength", options.middleNameMaxLength); }
                    if (options.lastNameMaxLength) { this.set("lastNameMaxLength", options.lastNameMaxLength); }
                }
            }
        });

        return DriverSettingsModel;
    });
