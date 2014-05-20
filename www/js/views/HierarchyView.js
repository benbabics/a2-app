define(["backbone", "utils", "mustache", "globals", "views/BaseView", "text!tmpl/hierarchy/hierarchy.html"],
    function (Backbone, utils, Mustache, globals, BaseView, pageTemplate) {

        "use strict";


        var HierarchyView = BaseView.extend({
            tagName: "li",

            template: pageTemplate,

            initialize: function () {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);
            },

            render: function () {
                this.$el.html(Mustache.render(this.template));
                return this;
            }
        });


        return HierarchyView;
    });
