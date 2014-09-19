define(["backbone", "mustache", "views/BaseView", "text!tmpl/about/page.html"],
    function (Backbone, Mustache, BaseView, pageTemplate) {

        "use strict";


        var AboutView = BaseView.extend({
            el: "#about",
            template: pageTemplate,

            pageCreate: function () {
                var $content = this.$el.find(".ui-content");
                $content.html(Mustache.render(this.template, this.model.toJSON()));
                $content.enhanceWithin();
            }
        });


        return AboutView;
    });
