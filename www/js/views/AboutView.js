define(["backbone", "mustache", "text!tmpl/about/page.html"],
    function (Backbone, Mustache, pageTemplate) {

        "use strict";


        var AboutView;
        AboutView = Backbone.View.extend({
            el: "#about",
            template: pageTemplate,

            initialize: function () {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);

                // create page
                this.pageCreate();
            },

            pageCreate: function () {
                var $content = this.$el.find(":jqmData(role=content)");
                $content.html(Mustache.render(this.template, this.model.toJSON()));
                this.$el.trigger("create");
            }
        });


        return AboutView;
    });
