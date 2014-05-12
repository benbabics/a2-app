define(["backbone", "utils", "facade", "mustache", "globals", "views/BaseView", "text!tmpl/payment/paymentDetail.html"],
    function (Backbone, utils, facade, Mustache, globals, BaseView, pageTemplate) {

        "use strict";


        var PaymentDetailView = BaseView.extend({
            el: "#paymentDetails",

            template: pageTemplate,

            userModel: null,

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template));

                $content.trigger("create");
            }
        });


        return PaymentDetailView;
    });
