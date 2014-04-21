define(["backbone", "utils", "facade", "mustache", "globals", "models/ShippingModel",
        "views/ValidationFormView", "text!tmpl/card/shipping.html"],
    function (Backbone, utils, facade, Mustache, globals, ShippingModel, ValidationFormView, pageTemplate) {

        "use strict";


        var CardShippingView = ValidationFormView.extend({
            el: "#cardShipping",

            template: pageTemplate,

            userModel: null,

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template));

                this.formatRequiredFields();

                $content.trigger("create");
            }
        });


        return CardShippingView;
    });
