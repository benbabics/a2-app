define(["backbone", "utils", "facade", "mustache", "globals", "models/DriverReactivateModel",
        "models/DriverTerminateModel", "text!tmpl/driver/driverEdit.html"],
    function (Backbone, utils, facade, Mustache, globals, DriverReactivateModel, DriverTerminateModel, pageTemplate) {

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

                $content.trigger("create");
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

                return {
                    "driver"     : driverConfiguration,
                    "permissions": this.userModel.get("permissions")
                };
            },

            reactivateDriver: function () {
                var self = this,
                    driverReactivateModel = new DriverReactivateModel();

                driverReactivateModel.initialize(utils._.extend({}, this.model.toJSON(), {
                    "accountId": this.userModel.get("selectedCompany").get("accountId")
                }));

                driverReactivateModel.save(driverReactivateModel.toJSON(), {
                    success: function (model, response) {
                        self.trigger("reactivateDriverSuccess", response);
                    }
                });
            },

            terminateDriver: function () {
                var self = this,
                    driverTerminateModel = new DriverTerminateModel();

                driverTerminateModel.initialize(utils._.extend({}, this.model.toJSON(), {
                    "accountId": this.userModel.get("selectedCompany").get("accountId")
                }));

                driverTerminateModel.save(driverTerminateModel.toJSON(), {
                    success: function (model, response) {
                        self.trigger("terminateDriverSuccess", response);
                    }
                });
            },

            confirmTerminateDriver: function () {
                var self = this;

                facade.publish("app", "alert", {
                    title             : globals.driverTerminate.constants.CONFIRMATION_TITLE,
                    message           : globals.driverTerminate.constants.CONFIRMATION_MESSAGE,
                    primaryBtnLabel   : globals.driverTerminate.constants.OK_BTN_TEXT,
                    primaryBtnHandler : function () {
                        self.terminateDriver();
                    },
                    secondaryBtnLabel : globals.driverTerminate.constants.CANCEL_BTN_TEXT
                });
            },

            /*
             * Event Handlers
             */
            changeStatus: function (evt) {
                evt.preventDefault();

                if (this.model.get("status") === globals.driverEdit.constants.STATUS_TERMINATED) {
                    this.reactivateDriver();
                }
                else {
                    this.confirmTerminateDriver();
                }
            }
        });


        return DriverEditView;
    });
