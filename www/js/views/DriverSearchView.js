define(["backbone", "utils", "facade", "mustache", "globals", "views/FormView",
    "text!tmpl/driver/search.html", "text!tmpl/driver/searchHeader.html"],
    function (Backbone, utils, facade, Mustache, globals, FormView, pageTemplate, searchHeaderTemplate) {

        "use strict";


        var DriverSearchView = FormView.extend({
            el: "#driverSearch",

            template: pageTemplate,
            headerTemplate: searchHeaderTemplate,

            userModel: null,

            events: utils._.extend({}, FormView.prototype.events, {
                "click #submitDriverSearch-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #driverSearchForm"     : "submitForm"
            }),

            initialize: function (options) {
                // call super
                DriverSearchView.__super__.initialize.apply(this, arguments);

                // parse the templates
                Mustache.parse(this.headerTemplate);
                Mustache.parse(this.template);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }
            },

            render: function () {
                var $header = this.$el.find(":jqmData(role=header)"),
                    $content = this.$el.find(":jqmData(role=content)");

                $header.html(Mustache.render(this.headerTemplate,
                    {
                        "permissions": this.userModel.get("permissions")
                    }));

                $content.html(Mustache.render(this.template, this.getConfiguration()));
            },

            getConfiguration: function () {
                var configuration = utils._.extend({}, utils.deepClone(globals.driverSearch.configuration)),
                    selectedCompany = this.userModel.get("selectedCompany"),
                    departments = selectedCompany.get("departments").toJSON(),
                    departmentListValues = [],
                    hasMultipleDepartments = utils._.size(departments) > 1;

                if (hasMultipleDepartments) {
                    departmentListValues.push(globals.driverSearch.constants.ALL);
                }

                utils._.each(departments, function (department, key, list) {
                    departmentListValues.push({
                        "id"  : department.departmentId,
                        "name": department.name
                    });
                });

                configuration.filterFirstName.value = this.model.get("filterFirstName");
                configuration.filterLastName.value = this.model.get("filterLastName");
                configuration.filterDriverId.value = this.model.get("filterDriverId");
                configuration.filterStatus.value = this.model.get("filterStatus");
                configuration.filterDepartmentId.value = this.model.get("filterDepartmentId");
                configuration.filterDepartmentId.enabled = hasMultipleDepartments;
                configuration.filterDepartmentId.values = departmentListValues;


                return configuration;
            },

            /*
             * Event Handlers
             */
            submitForm: function (evt) {
                evt.preventDefault();

                //TODO - This will get finished as part of the display driver search results task
            }
        });


        return DriverSearchView;
    });
