define(["backbone", "utils", "facade", "mustache", "globals", "models/DriverModel",
        "views/ValidationFormView", "text!tmpl/driver/driverAdd.html", "text!tmpl/driver/driverAddDetails.html"],
    function (Backbone, utils, facade, Mustache, globals, DriverModel, ValidationFormView,
              pageTemplate, driverAddDetailsTemplate) {

        "use strict";


        var DriverAddView = ValidationFormView.extend({
            el: "#driverAdd",

            template: pageTemplate,
            addDetailsTemplate: driverAddDetailsTemplate,

            events: utils._.extend({}, ValidationFormView.prototype.events, {
                "click #submitDriverAdd-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #driverAddForm"     : "submitForm"
            }),

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // set context
                utils._.bindAll(this, "handlePageBeforeShow");

                // parse the add details template
                Mustache.parse(this.addDetailsTemplate);

                // jQM Events
                this.$el.on("pagebeforeshow", this.handlePageBeforeShow);
            },

            render: function () {
                var $content = this.$el.find(".ui-content");

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                this.formatRequiredFields();

                $content.trigger("create");
            },

            resetForm: function () {
                DriverAddView.__super__.resetForm.apply(this, arguments);

                this.model.set("department", this.findDefaultDepartment());
            },

            getConfiguration: function () {
                var user = this.userModel.toJSON(),
                    driverSettings = user.selectedCompany.settings.driverSettings,
                    driverConfiguration = utils._.extend({}, utils.deepClone(globals.driverAdd.configuration)),
                    departmentListValues = [];

                utils._.each(user.selectedCompany.departments, function (department) {
                    if (department.visible === true) {
                        departmentListValues.push({
                            "id": department.id,
                            "name": department.name,
                            "selected": department.name === globals.APP.constants.DEFAULT_DEPARTMENT_NAME
                        });
                    }
                });

                driverConfiguration.firstName.value = this.model.get("firstName");
                driverConfiguration.firstName.maxLength = driverSettings.firstNameMaxLength;

                driverConfiguration.middleName.value = this.model.get("middleName");
                driverConfiguration.middleName.maxLength = driverSettings.middleNameMaxLength;

                driverConfiguration.lastName.value = this.model.get("lastName");
                driverConfiguration.lastName.maxLength = driverSettings.lastNameMaxLength;

                driverConfiguration.id.maxLength = driverSettings.idFixedLength;
                driverConfiguration.id.value = this.model.get("id");
                driverConfiguration.id.placeholder =
                    Mustache.render(globals.driver.constants.DRIVER_ID_PLACEHOLDER_FORMAT, {
                        "idFixedLength": driverSettings.idFixedLength
                    });
                driverConfiguration.departmentId.enabled = departmentListValues.length > 1;
                driverConfiguration.departmentId.values = departmentListValues;

                return {
                    "driver"        : driverConfiguration,
                    "requiredFields": user.selectedCompany.requiredFields
                };
            },

            getAddDetailsConfiguration: function (response) {
                var newDriver = new DriverModel(),
                    driver,
                    driverConfiguration = utils._.extend({}, utils.deepClone(globals.driverAddedDetails.configuration));

                newDriver.initialize(response);
                driver = newDriver.toJSON();

                // populate configuration details
                driverConfiguration.driverName.value = driver.formattedName();
                driverConfiguration.id.value = driver.id;
                driverConfiguration.status.value = driver.status;
                driverConfiguration.statusDate.value = driver.statusDate;
                if (driver.department) {
                    driverConfiguration.department.value = driver.department.name;
                }

                return {
                    "message": response.message,
                    "driver" : driverConfiguration
                };
            },

            pageBeforeShow: function () {
                this.resetForm();
            },

            /*
             * Event Handlers
             */
            handlePageBeforeShow: function (evt) {
                this.pageBeforeShow();
            },

            handleInputChanged: function (evt) {
                var target = evt.target;
                if (target.name === "departmentId") {
                    this.updateAttribute("department", this.findDepartment(target.value));
                } else {
                    DriverAddView.__super__.handleInputChanged.apply(this, arguments);
                }
            },

            submitForm: function (evt) {
                var self = this;

                evt.preventDefault();

                this.model.add({
                    success: function (model, response) {
                        var message =
                            Mustache.render(self.addDetailsTemplate, self.getAddDetailsConfiguration(response));

                        self.trigger("driverAddSuccess", message);

                        self.resetForm();
                    }
                });
            }
        });


        return DriverAddView;
    });
