define(["backbone", "utils", "mustache", "globals", "views/BaseView", "text!tmpl/hierarchy/hierarchy.html"],
    function (Backbone, utils, Mustache, globals, BaseView, pageTemplate) {

        "use strict";


        var HierarchyView = BaseView.extend({
            tagName: "li",

            template: pageTemplate,

            render: function () {
                this.$el.html(Mustache.render(this.template));
                return this;
            }
        });


        return HierarchyView;
    });
