define(["backbone", "utils", "mustache", "globals", "text!tmpl/driver/driver.html"],
    function (Backbone, utils, Mustache, globals, pageTemplate) {

        "use strict";


        var DriverView = Backbone.View.extend({
            tagName: "li",

            template: pageTemplate,

            initialize: function () {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);
            },

            render: function () {
                this.$el.html(Mustache.render(this.template, this.getConfiguration()));
                return this;
            },

            getConfiguration: function () {
                var driverConfiguration = null,
                    driver;

                if (this.model) {
                    driver = this.model.toJSON();
                    driverConfiguration = utils._.extend({},
                        utils.deepClone(globals.driverSearchResults.configuration));

                    // populate configuration details
                    driverConfiguration.url.value =
                        globals.driverSearchResults.constants.DRIVER_DETAILS_BASE_URL + driver.driverId;
                    driverConfiguration.driverName.value = driver.formattedName();
                    driverConfiguration.driverId.value = driver.driverId;
                    driverConfiguration.driverStatus.value = driver.status;
                    if (driver.department) {
                        driverConfiguration.driverDepartment.value = driver.department.name;
                    }
                }

                return {
                    "driver" : driverConfiguration
                };
            }
        });


        return DriverView;
    });
