define(["backbone", "mustache", "text!tmpl/invoice/summary.html"],
    function (Backbone, Mustache, pageTemplate) {

        "use strict";


        var InvoiceSummaryView = Backbone.View.extend({
            el: "#invoiceSummary",
            template: pageTemplate,

            initialize: function () {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");
                $content.html(Mustache.render(this.template));
                $content.trigger("create");
            }
        });


        return InvoiceSummaryView;
    });
