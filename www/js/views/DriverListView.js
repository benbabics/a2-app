define(["backbone", "utils", "mustache", "globals",
    "text!tmpl/driver/searchResults.html", "text!tmpl/driver/searchResultsHeader.html"],
    function (Backbone, utils, Mustache, globals, pageTemplate, searchResultsHeaderTemplate) {

        "use strict";


        var DriverListView = Backbone.View.extend({
            el: "#driverSearchResults",

            template: pageTemplate,
            headerTemplate: searchResultsHeaderTemplate,

            userModel: null,

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the templates
                Mustache.parse(this.headerTemplate);
                Mustache.parse(this.template);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }
            },

            render: function () {
                var $header = this.$el.find(":jqmData(role=header)"),
                    $content = this.$el.find(":jqmData(role=content)");

                $header.html(Mustache.render(this.headerTemplate,
                    {
                        "permissions": this.userModel.get("permissions")
                    }));

                $content.html(Mustache.render(this.template));
            }
        });


        return DriverListView;
    });
