define(["backbone", "utils", "facade", "mustache", "globals", "models/PaymentModel",
        "views/ValidationFormView", "text!tmpl/payment/paymentAdd.html"],
    function (Backbone, utils, facade, Mustache, globals, PaymentModel, ValidationFormView, pageTemplate) {

        "use strict";


        var PaymentAddView = ValidationFormView.extend({
            el: "#paymentAdd",

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

                this.resetModel();

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


        return PaymentAddView;
    });
