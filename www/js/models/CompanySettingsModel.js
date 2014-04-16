define(["backbone", "globals", "utils", "models/CardSettingsModel", "models/DriverSettingsModel"],
    function (Backbone, globals, utils, CardSettingsModel, DriverSettingsModel) {

        "use strict";


        var CompanySettingsModel = Backbone.Model.extend({
            defaults: {
                "cardSettings"  : null,
                "driverSettings": null
            },

            initialize: function (options) {
                var cardSettings,
                    driverSettings;

                if (options) {
                    if (options.cardSettings) {
                        cardSettings = new CardSettingsModel();
                        cardSettings.initialize(options.cardSettings);
                        this.set("cardSettings", cardSettings);
                    }
                    if (options.driverSettings) {
                        driverSettings = new DriverSettingsModel();
                        driverSettings.initialize(options.driverSettings);
                        this.set("driverSettings", driverSettings);
                    }
                }
            },

            toJSON: function () {
                var json = CompanySettingsModel.__super__.toJSON.apply(this, arguments);

                if (json.cardSettings) {
                    json.cardSettings = json.cardSettings.toJSON();
                }
                if (json.driverSettings) {
                    json.driverSettings = json.driverSettings.toJSON();
                }

                return json;
            }
        });

        return CompanySettingsModel;
    });
