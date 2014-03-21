define(["backbone", "utils", "mustache", "globals", "text!tmpl/driver/driverEdit.html"],
    function (Backbone, utils, Mustache, globals, pageTemplate) {

        "use strict";


        var DriverEditView = Backbone.View.extend({
            el: "#driverDetails",

            template: pageTemplate,

            userModel: null,

            events: {
                "click #submitChangeStatus-btn": "changeStatus"
            },

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template, this.getConfiguration()));
            },

            getConfiguration: function () {
                var driver = this.model.toJSON(),
                    driverConfiguration = utils._.extend({}, utils.deepClone(globals.driverEdit.configuration));

                // populate configuration details
                driverConfiguration.driverName.value = driver.formattedName();
                driverConfiguration.driverId.value = driver.driverId;
                driverConfiguration.driverStatus.value = driver.status;
                driverConfiguration.driverStatusDate.value = driver.statusDate;
                if (driver.department) {
                    driverConfiguration.driverDepartment.value = driver.department.name;
                }

                if (driver.status === globals.driverEdit.constants.STATUS_TERMINATED) {
                    driverConfiguration.submitButton.label = globals.driverEdit.constants.BUTTON_ACTIVATE;
                }
                else {
                    driverConfiguration.submitButton.label = globals.driverEdit.constants.BUTTON_TERMINATE;
                }

                return driverConfiguration;
            },

            /*
             * Event Handlers
             */
            changeStatus: function (evt) {
                evt.preventDefault();

                //TODO - Finish as part of MOBILE-2200
            }
        });


        return DriverEditView;
    });
