define(["backbone", "utils", "facade", "mustache", "globals", "views/FormView",
    "text!tmpl/driver/search.html", "text!tmpl/driver/searchHeader.html"],
    function (Backbone, utils, facade, Mustache, globals, FormView, pageTemplate, searchHeaderTemplate) {

        "use strict";


        var DriverSearchView = FormView.extend({
            el: "#driverSearch",

            template: pageTemplate,
            headerTemplate: searchHeaderTemplate,

            events: utils._.extend({}, FormView.prototype.events, {
                "click #submitDriverSearch-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #driverSearchForm"     : "submitForm"
            }),

            initialize: function (options) {
                // call super
                DriverSearchView.__super__.initialize.apply(this, arguments);

                // set context
                utils._.bindAll(this, "handlePageBeforeShow");

                // parse the header template
                Mustache.parse(this.headerTemplate);

                // jQM Events
                this.$el.on("pagebeforeshow", this.handlePageBeforeShow);
            },

            render: function () {
                this.renderHeader();
                this.renderContent();
                this.$el.trigger("create");
            },

            renderHeader: function () {
                var $header = this.$el.find(":jqmData(role=header)");

                $header.html(Mustache.render(this.headerTemplate,
                    {
                        "permissions": this.userModel.get("selectedCompany").get("permissions")
                    }));
            },

            renderContent: function () {
                var $content = this.$el.find(":jqmData(role=content)");
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

                utils._.each(departments, function (department) {
                    departmentListValues.push({
                        "id"  : department.id,
                        "name": department.name
                    });
                });

                configuration.departmentId.enabled = hasMultipleDepartments;
                configuration.departmentId.values = departmentListValues;

                return configuration;
            },

            findDepartment: function (id) {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("departments").findWhere({"id": id});
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
                }
                else {
                    DriverSearchView.__super__.handleInputChanged.apply(this, arguments);
                }
            },

            submitForm: function (evt) {
                evt.preventDefault();

                this.trigger("searchSubmitted");
            }
        });


        return DriverSearchView;
    });
