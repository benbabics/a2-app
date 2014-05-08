define(["backbone", "utils", "mustache", "globals", "views/PaymentView",
        "text!tmpl/payment/searchResults.html"],
    function (Backbone, utils, Mustache, globals, PaymentView, pageTemplate) {

        "use strict";


        var PaymentListView = Backbone.View.extend({
            el: "#paymentHistory",

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


        return PaymentListView;
    });
