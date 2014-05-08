define(["backbone", "utils", "facade", "mustache", "globals", "views/BaseView", "text!tmpl/driver/driverEdit.html"],
    function (Backbone, utils, facade, Mustache, globals, BaseView, pageTemplate) {

        "use strict";


        var DriverEditView = BaseView.extend({
            el: "#driverDetails",

            template: pageTemplate,

            userModel: null,

            events: {
                "click #submitChangeStatus-btn": "handleChangeStatus"
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
                var driver,
                    driverConfiguration = null;

                if (this.model) {
                    driver = this.model.toJSON();
                    driverConfiguration = utils._.extend({}, utils.deepClone(globals.driverEdit.configuration));

                    // populate configuration details
                    driverConfiguration.driverName.value = driver.formattedName();
                    driverConfiguration.id.value = driver.id;
                    driverConfiguration.status.value = driver.status;
                    driverConfiguration.statusDate.value = driver.statusDate;
                    if (driver.department) {
                        driverConfiguration.department.value = driver.department.name;
                    }

                    if (driver.status === globals.driver.constants.STATUS_TERMINATED) {
                        driverConfiguration.submitButton.label = globals.driverEdit.constants.BUTTON_ACTIVATE;
                    }
                    else {
                        driverConfiguration.submitButton.label = globals.driverEdit.constants.BUTTON_TERMINATE;
                    }
                }

                return {
                    "driver"     : driverConfiguration,
                    "permissions": this.userModel.get("permissions")
                };
            },

            changeStatus: function (updatedStatus, eventToTrigger) {
                var self = this;

                this.model.changeStatus(updatedStatus, {
                    success: function (model, response) {
                        self.trigger(eventToTrigger, response);
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
                        self.changeStatus(globals.driver.constants.STATUS_TERMINATED, "terminateDriverSuccess");
                    },
                    secondaryBtnLabel : globals.driverTerminate.constants.CANCEL_BTN_TEXT
                });
            },

            /*
             * Event Handlers
             */
            handleChangeStatus: function (evt) {
                evt.preventDefault();

                if (this.model.get("status") === globals.driver.constants.STATUS_TERMINATED) {
                    this.changeStatus(globals.driver.constants.STATUS_ACTIVE, "reactivateDriverSuccess");
                }
                else {
                    this.confirmTerminateDriver();
                }
            }
        });


        return DriverEditView;
    });
