define(["backbone", "utils", "mustache", "text!tmpl/login/page.html"],
    function (Backbone, utils, Mustache, template) {

        "use strict";


        var LoginView;
        LoginView = Backbone.View.extend({

            el: utils.$("#login"),

            events: {
            },

            initialize: function () {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // create page
                this.pageCreate();
            },

            pageCreate: function () {
                var $content = this.$el.find(":jqmData(role=content)");
                $content.html(Mustache.render(template));
            }
        });


        return LoginView;
    });
