define(["backbone", "utils", "facade", "mustache", "globals", "views/ValidationFormView",
        "text!tmpl/payment/paymentEdit.html", "text!tmpl/payment/paymentChangeDetails.html"],
    function (Backbone, utils, facade, Mustache, globals, ValidationFormView, pageTemplate, paymentChangeDetailsTemplate) {

        "use strict";


        var PaymentEditView = ValidationFormView.extend({
            el: "#paymentEdit",

            template: pageTemplate,
            editDetailsTemplate: paymentChangeDetailsTemplate,

            invoiceSummaryModel: null,
            userModel: null,

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the edit details template
                Mustache.parse(this.editDetailsTemplate);

                if (options) {
                    if (options.invoiceSummaryModel) {
                        this.invoiceSummaryModel = options.invoiceSummaryModel;
                    }
                    if (options.userModel) {
                        this.userModel = options.userModel;
                    }
                }
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                this.resetModel();

                $content.html(Mustache.render(this.template));

                this.formatRequiredFields();

                $content.trigger("create");
            }
        });


        return PaymentEditView;
    });
