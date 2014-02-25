define(["backbone", "utils", "mustache", "text!tmpl/login/page.html"],
    function (Backbone, utils, Mustache, pageTemplate) {

        "use strict";


        var LoginView;
        LoginView = Backbone.View.extend({

            el: "#login",

            template: pageTemplate,

            events: {
            },

            initialize: function () {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // cache the template
                Mustache.parse(this.template);

                // create page
                this.pageCreate();
            },

            pageCreate: function () {
                var $content = this.$el.find(":jqmData(role=content)");
                $content.html(Mustache.render(this.template));
            }
        });


        return LoginView;
    });
