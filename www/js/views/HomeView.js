define(["backbone", "utils", "mustache", "globals", "views/BaseView", "text!tmpl/home/page.html"],
    function (Backbone, utils, Mustache, globals, BaseView, pageTemplate) {

        "use strict";


        var HomeView = BaseView.extend({
            el: "#home",

            template: pageTemplate,

            render: function () {
                var $content = this.$el.find(".ui-content");
                $content.html(Mustache.render(this.template, this.model.toJSON()));
                $content.trigger("create");
            }
        });


        return HomeView;
    });
