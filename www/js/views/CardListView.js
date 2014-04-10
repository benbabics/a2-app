define(["backbone", "utils", "mustache", "globals", "views/CardView",
        "text!tmpl/card/searchResults.html", "text!tmpl/card/searchResultsHeader.html"],
    function (Backbone, utils, Mustache, globals, CardView, pageTemplate, searchResultsHeaderTemplate) {

        "use strict";


        var CardListView = Backbone.View.extend({
            el: "#cardSearchResults",

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
                this.renderHeader();
                this.renderContent();
            },

            renderHeader: function () {
                var $header = this.$el.find(":jqmData(role=header)");

                $header.html(Mustache.render(this.headerTemplate,
                    {
                        "permissions": this.userModel.get("permissions")
                    }));
                $header.trigger("create");
            },

            renderContent: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template));

                $content.trigger("create");
            }
        });


        return CardListView;
    });
