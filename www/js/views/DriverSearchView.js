define(["backbone", "utils", "facade", "mustache", "globals", "text!tmpl/driver/search.html"],
    function (Backbone, utils, facade, Mustache, globals, pageTemplate) {

        "use strict";


        var DriverSearchView = Backbone.View.extend({
            el: "#driverSearch",

            template: pageTemplate,

            initialize: function (options) {
                // call super
                DriverSearchView.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template, this.model.toJSON()));
            }
        });


        return DriverSearchView;
    });
