define(["backbone", "utils", "mustache", "globals", "text!tmpl/payment/payment.html"],
    function (Backbone, utils, Mustache, globals, pageTemplate) {

        "use strict";


        var PaymentView = Backbone.View.extend({
            tagName: "li",

            template: pageTemplate,

            initialize: function () {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);
            },

            render: function () {
                this.$el.html(Mustache.render(this.template));
                return this;
            }
        });


        return PaymentView;
    });
