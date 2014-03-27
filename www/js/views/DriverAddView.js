define(["backbone", "utils", "facade", "mustache", "globals", "models/DriverAddModel", "models/DriverModel",
        "views/ValidationFormView", "text!tmpl/driver/driverAdd.html", "text!tmpl/driver/driverAddDetails.html"],
    function (Backbone, utils, facade, Mustache, globals, DriverAddModel, DriverModel, ValidationFormView,
              pageTemplate, driverAddDetailsTemplate) {

        "use strict";


        var DriverAddView = ValidationFormView.extend({
            el: "#driverAdd",

            template: pageTemplate,
            addDetailsTemplate: driverAddDetailsTemplate,

            userModel: null,

            events: utils._.extend({}, ValidationFormView.prototype.events, {
                "click #submitDriverAdd-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #driverAddForm"     : "submitForm"
            }),

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the add details template
                Mustache.parse(this.addDetailsTemplate);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                this.updateValidationRules();

                this.formatRequiredFields();

                $content.trigger("create");
            },

            updateValidationRules: function () {
                var selectedCompany = this.userModel.get("selectedCompany");

                this.model.validation.driverId[0].required = selectedCompany.get("requiredFields").DRIVER_ID;
                this.model.validation.driverId[2].length = selectedCompany.get("driverIdLength");
                this.model.validation.driverId[2].msg =
                    Mustache.render(globals.driverAdd.constants.ERROR_DRIVER_ID_INVALID_LENGTH, {
                        "driverIdLength": selectedCompany.get("driverIdLength")
                    });
            },

            getConfiguration: function () {
                var driverConfiguration = utils._.extend({}, utils.deepClone(globals.driverAdd.configuration)),
                    selectedCompany = this.userModel.get("selectedCompany"),
                    departments = selectedCompany.get("departments").toJSON(),
                    departmentListValues = [];

                utils._.each(departments, function (department) {
                    if (department.visible === true) {
                        departmentListValues.push({
                            "id": department.departmentId,
                            "name": department.name,
                            "selected": department.name === globals.driverAdd.constants.DEFAULT_DEPARTMENT_NAME
                        });
                    }
                });

                driverConfiguration.firstName.value = this.model.get("firstName");
                driverConfiguration.middleInitial.value = this.model.get("middleInitial");
                driverConfiguration.lastName.value = this.model.get("lastName");
                driverConfiguration.driverId.maxLength = selectedCompany.get("driverIdLength");
                driverConfiguration.driverId.value = this.model.get("driverId");
                driverConfiguration.departmentId.enabled = departmentListValues.length > 1;
                driverConfiguration.departmentId.values = departmentListValues;

                driverConfiguration.driverId.placeholder =
                    Mustache.render(globals.driverAdd.constants.DRIVER_ID_PLACEHOLDER_FORMAT, {
                        "driverIdLength": selectedCompany.get("driverIdLength")
                    });

                return {
                    "driver"        : driverConfiguration,
                    "requiredFields": selectedCompany.get("requiredFields")
                };
            },

            getAddDetailsConfiguration: function (response) {
                var newDriver = new DriverModel(),
                    driver,
                    driverConfiguration = utils._.extend({}, utils.deepClone(globals.driverAddedDetails.configuration));

                newDriver.initialize(response.data);
                driver = newDriver.toJSON();

                // populate configuration details
                driverConfiguration.driverName.value = driver.formattedName();
                driverConfiguration.driverId.value = driver.driverId;
                driverConfiguration.driverStatus.value = driver.status;
                driverConfiguration.driverStatusDate.value = driver.statusDate;
                if (driver.department) {
                    driverConfiguration.driverDepartment.value = driver.department.name;
                }

                return {
                    "message": response.message,
                    "driver" : driverConfiguration
                };
            },

            findDefaultDepartmentId: function () {
                var selectedCompany = this.userModel.get("selectedCompany"),
                    departments = selectedCompany.get("departments").toJSON(),
                    returnValue = null;

                utils._.each(departments, function (department) {
                    if (department.visible === true) {
                        if (department.name === globals.driverAdd.constants.DEFAULT_DEPARTMENT_NAME) {
                            returnValue = department.departmentId;
                        }
                    }
                });

                return returnValue;
            },

            /*
             * Event Handlers
             */
            submitForm: function (evt) {
                var self = this;

                evt.preventDefault();

                // Set the account Id to the currently selected company
                this.model.set("accountId", this.userModel.get("selectedCompany").get("accountId"));

                this.model.save(this.model.toJSON(), {
                    success: function (model, response) {
                        var message =
                            Mustache.render(self.addDetailsTemplate, self.getAddDetailsConfiguration(response));

                        self.trigger("driverAddSuccess", message);

                        self.resetForm();
                        self.model.set("departmentId", self.findDefaultDepartmentId());
                    }
                });
            }
        });


        return DriverAddView;
    });
