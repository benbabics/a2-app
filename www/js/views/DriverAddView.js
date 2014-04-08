define(["backbone", "utils", "facade", "mustache", "globals", "models/DriverModel",
        "views/ValidationFormView", "text!tmpl/driver/driverAdd.html", "text!tmpl/driver/driverAddDetails.html"],
    function (Backbone, utils, facade, Mustache, globals, DriverModel, ValidationFormView,
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

                this.formatRequiredFields();

                $content.trigger("create");
            },

            resetForm: function () {
                DriverAddView.__super__.resetForm.apply(this, arguments);

                this.model.set("department", this.findDefaultDepartment());
            },

            getConfiguration: function () {
                var driverConfiguration = utils._.extend({}, utils.deepClone(globals.driverAdd.configuration)),
                    selectedCompany = this.userModel.get("selectedCompany"),
                    departments = selectedCompany.get("departments").toJSON(),
                    departmentListValues = [];

                utils._.each(departments, function (department) {
                    if (department.visible === true) {
                        departmentListValues.push({
                            "id": department.id,
                            "name": department.name,
                            "selected": department.name === globals.driverAdd.constants.DEFAULT_DEPARTMENT_NAME
                        });
                    }
                });

                driverConfiguration.firstName.value = this.model.get("firstName");
                driverConfiguration.middleName.value = this.model.get("middleName");
                driverConfiguration.lastName.value = this.model.get("lastName");
                driverConfiguration.id.maxLength = selectedCompany.get("driverIdLength");
                driverConfiguration.id.value = this.model.get("id");
                driverConfiguration.id.placeholder =
                    Mustache.render( globals.driver.constants.DRIVER_ID_PLACEHOLDER_FORMAT, {
                        "driverIdLength": selectedCompany.get("driverIdLength")
                    });
                driverConfiguration.departmentId.enabled = departmentListValues.length > 1;
                driverConfiguration.departmentId.values = departmentListValues;

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

            findDefaultDepartment: function () {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("departments")
                    .findWhere({"visible": true, "name": globals.driverAdd.constants.DEFAULT_DEPARTMENT_NAME});
            },

            findDepartment: function (id) {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("departments").findWhere({"visible": true, "id": id});
            },

            /*
             * Event Handlers
             */
            handleInputChanged: function (evt) {
                var target = evt.target;
                if (target.name === "departmentId") {
                    this.updateAttribute("department", this.findDepartment(target.value));
                }
                else {
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
