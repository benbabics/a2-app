define(["backbone", "utils", "facade", "mustache", "globals", "text!tmpl/card/cardDetail.html"],
    function (Backbone, utils, facade, Mustache, globals, pageTemplate) {

        "use strict";


        var CardDetailView = Backbone.View.extend({
            el: "#cardDetails",

            template: pageTemplate,

            userModel: null,

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template));

                $content.trigger("create");
            }
        });


        return CardDetailView;
    });
