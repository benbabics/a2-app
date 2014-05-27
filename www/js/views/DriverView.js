define(["backbone", "utils", "mustache", "globals", "views/BaseView", "text!tmpl/driver/driver.html"],
    function (Backbone, utils, Mustache, globals, BaseView, pageTemplate) {

        "use strict";


        var DriverView = BaseView.extend({
            tagName: "li",

            template: pageTemplate,

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
                        globals.driverSearchResults.constants.DRIVER_DETAILS_BASE_URL + driver.id;
                    driverConfiguration.driverName.value = driver.formattedName();
                    driverConfiguration.id.value = driver.id;
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
