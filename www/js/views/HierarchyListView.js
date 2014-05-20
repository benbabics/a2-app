define(["backbone", "utils", "mustache", "globals", "views/HierarchyView",
        "text!tmpl/hierarchy/hierarchyList.html", "text!tmpl/hierarchy/hierarchyListHeader.html"],
    function (Backbone, utils, Mustache, globals, HierarchyView, pageTemplate, hierarchyListHeaderTemplate) {

        "use strict";


        var HierarchyListView = Backbone.View.extend({
            el: "#hierarchyManager",

            template: pageTemplate,
            headerTemplate: hierarchyListHeaderTemplate,

            userModel: null,

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the templates
                Mustache.parse(this.template);
                Mustache.parse(this.headerTemplate);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }
            },

            render: function () {
                this.renderHeader();
                this.renderContent();
                this.$el.trigger("create");
            },

            renderHeader: function () {
                var $header = this.$el.find(":jqmData(role=header)");

                // TODO - Only show 'Back' when the user has a selected company

                $header.html(Mustache.render(this.headerTemplate));
            },

            renderContent: function () {
                var $content = this.$el.find(":jqmData(role=content)"),
                    container = document.createDocumentFragment(),
                    listContainer;

                // empty list
                $content.find("#hierarchyList").empty();

                $content.html(Mustache.render(this.template));

                listContainer = $content.find("#hierarchyList");

                // populate $list
                this.collection.each(function (hierarchy) {
                    var hierarchyView = new HierarchyView({
                        model: hierarchy
                    });
                    hierarchyView.render();
                    container.appendChild(hierarchyView.el);  // add hierarchy to the list
                });

                listContainer.append(container);

                try {
                    // This call throws an exception if called during startup before the list is ready
                    listContainer.listview("refresh");
                } catch (e) {}
            }
        });


        return HierarchyListView;
    });
