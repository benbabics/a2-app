define(["backbone", "utils", "mustache", "globals", "views/FormView", "text!tmpl/contactUs/page.html", "backbone-validation"],
    function (Backbone, utils, Mustache, globals, FormView, pageTemplate) {

        "use strict";


        var ContactUsView = FormView.extend({
            el: "#contactUs",

            template: pageTemplate,

            events: {
            },

            initialize: function () {
                // call super
                ContactUsView.__super__.initialize.apply(this, arguments);
            },

            pageCreate: function () {
                var $content = this.$el.find(":jqmData(role=content)");
                $content.html(Mustache.render(this.template));
            }
        });


        return ContactUsView;
    });
