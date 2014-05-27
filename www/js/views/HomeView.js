define(["backbone", "utils", "mustache", "globals", "views/BaseView", "text!tmpl/home/page.html"],
    function (Backbone, utils, Mustache, globals, BaseView, pageTemplate) {

        "use strict";


        var HomeView = BaseView.extend({
            el: "#home",

            template: pageTemplate,

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");
                $content.html(Mustache.render(this.template, this.model.toJSON()));
                this.$el.trigger("create");
            }
        });


        return HomeView;
    });
