define(["backbone", "utils", "facade", "mustache", "globals", "models/CardModel",
        "views/ValidationFormView", "text!tmpl/card/cardEdit.html"],
    function (Backbone, utils, facade, Mustache, globals, CardModel, ValidationFormView, pageTemplate) {

        "use strict";


        var CardEditView = ValidationFormView.extend({
            el: "#cardEdit",

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

                $content.html(Mustache.render(this.template));

                this.formatRequiredFields();

                $content.trigger("create");
            },

            pageBeforeShow: function () {
                this.resetForm();
            },

            /*
             * Event Handlers
             */
            handlePageBeforeShow: function (evt) {
                this.pageBeforeShow();
            }
        });


        return CardEditView;
    });
