define(["backbone", "utils", "facade", "mustache", "globals", "views/FormView", "text!tmpl/driver/search.html"],
    function (Backbone, utils, facade, Mustache, globals, FormView, pageTemplate) {

        "use strict";


        var DriverSearchView = FormView.extend({
            el: "#driverSearch",

            template: pageTemplate,

            userModel: null,

            events: utils._.extend({}, FormView.prototype.events, {
                "click #submitDriverSearch-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #driverSearchForm"     : "submitForm"
            }),

            initialize: function (options) {
                // call super
                DriverSearchView.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)"),
                    selectedCompany = this.userModel.get("selectedCompany"),
                    departments = selectedCompany.get("departments");

                $content.html(Mustache.render(this.template,
                    {
                        "searchCriteria": this.model.toJSON(),
                        "hasMultipleDepartments": utils._.size(departments) > 1,
                        "departments"   : departments.toJSON()
                    }));
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
