define(["backbone", "utils", "facade", "mustache", "globals", "views/FormView",
        "text!tmpl/card/search.html", "text!tmpl/card/searchHeader.html"],
    function (Backbone, utils, facade, Mustache, globals, FormView, pageTemplate, searchHeaderTemplate) {

        "use strict";


        var CardSearchView = FormView.extend({
            el: "#cardSearch",

            template: pageTemplate,
            headerTemplate: searchHeaderTemplate,

            userModel: null,

            initialize: function (options) {
                // call super
                CardSearchView.__super__.initialize.apply(this, arguments);

                // parse the templates
                Mustache.parse(this.headerTemplate);
                Mustache.parse(this.template);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }
            },

            render: function () {
                this.renderHeader();
                this.renderContent();
            },

            renderHeader: function () {
                var $header = this.$el.find(":jqmData(role=header)");

                $header.html(Mustache.render(this.headerTemplate,
                    {
                        "permissions": this.userModel.get("permissions")
                    }));
                $header.trigger("create");
            },

            renderContent: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template));
                $content.trigger("create");
            },

            findDepartment: function (id) {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("departments").findWhere({"id": id});
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
                    CardSearchView.__super__.handleInputChanged.apply(this, arguments);
                }
            },

            submitForm: function (evt) {
                evt.preventDefault();

                this.trigger("searchSubmitted");
            }
        });


        return CardSearchView;
    });
