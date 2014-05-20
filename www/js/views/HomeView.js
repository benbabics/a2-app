define(["backbone", "utils", "mustache", "globals", "text!tmpl/home/page.html"],
    function (Backbone, utils, Mustache, globals, pageTemplate) {

        "use strict";


        var HomeView = Backbone.View.extend({
            el: "#home",

            template: pageTemplate,

            initialize: function () {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");
                $content.html(Mustache.render(this.template, this.model.toJSON()));
                this.$el.trigger("create");
            }
        });


        return HomeView;
    });
