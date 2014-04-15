define(["backbone", "utils", "facade", "mustache", "globals", "models/CardModel",
        "views/ValidationFormView", "text!tmpl/card/cardAdd.html"],
    function (Backbone, utils, facade, Mustache, globals, CardModel, ValidationFormView, pageTemplate) {

        "use strict";


        var CardAddView = ValidationFormView.extend({
            el: "#cardAdd",

            template: pageTemplate,

            userModel: null,

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // set context
                utils._.bindAll(this, "handlePageBeforeShow");

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }

                // jQM Events
                this.$el.on("pagebeforeshow", this.handlePageBeforeShow);
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                this.formatRequiredFields();

                $content.trigger("create");
            },

            resetForm: function () {
                CardAddView.__super__.resetForm.apply(this, arguments);

                this.model.set("department", this.findDefaultDepartment());
            },

            getConfiguration: function () {
                var cardConfiguration = utils._.extend({}, utils.deepClone(globals.cardAdd.configuration)),
                    selectedCompany = this.userModel.get("selectedCompany");

                return {
                    "card"          : cardConfiguration,
                    "requiredFields": selectedCompany.get("requiredFields")
                };
            },

            findDefaultDepartment: function () {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("departments")
                    .findWhere({"visible": true, "name": globals.cardAdd.constants.DEFAULT_DEPARTMENT_NAME});
            },

            findDepartment: function (id) {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("departments").findWhere({"visible": true, "id": id});
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
                    CardAddView.__super__.handleInputChanged.apply(this, arguments);
                }
            }
        });


        return CardAddView;
    });
