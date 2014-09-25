define(["backbone", "utils", "mustache", "globals", "views/BaseView", "views/HierarchyView",
        "text!tmpl/hierarchy/hierarchyList.html", "text!tmpl/hierarchy/hierarchyListHeader.html"],
    function (Backbone, utils, Mustache, globals, BaseView, HierarchyView, pageTemplate, hierarchyListHeaderTemplate) {

        "use strict";


        var HierarchyListView = BaseView.extend({
            el: "#hierarchyManager",

            template: pageTemplate,
            headerTemplate: hierarchyListHeaderTemplate,

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the header template
                Mustache.parse(this.headerTemplate);
            },

            render: function () {
                this.renderHeader();
                this.renderContent();
            },

            renderHeader: function () {
                var $header = this.$el.find(":jqmData(role=header)");
                $header.html(Mustache.render(this.headerTemplate, this.getHeaderConfiguration()));
                $header.enhanceWithin();
            },

            renderContent: function () {
                var $content = this.$el.find(".ui-content"),
                    container = document.createDocumentFragment(),
                    listContainer,
                    self = this;

                // empty list
                $content.find("#hierarchyList").empty();

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                listContainer = $content.find("#hierarchyList");

                // populate $list
                this.collection.each(function (hierarchy) {
                    var hierarchyView = new HierarchyView({
                        model: hierarchy
                    });
                    hierarchyView.render();

                    // listen for events
                    hierarchyView.on("hierarchySelected", self.hierarchySelected, self);

                    container.appendChild(hierarchyView.el);  // add hierarchy to the list
                });

                listContainer.append(container);

                try {
                    // This call throws an exception if called during startup before the list is ready
                    listContainer.listview("refresh");
                } catch (ignore) {}

                $content.enhanceWithin();
            },

            getHeaderConfiguration: function () {
                var configuration = utils._.extend({}, utils.deepClone(globals.hierarchyManager.configuration)),
                    allowBackButton = false;

                // populate configuration details
                if (this.userModel.get("selectedCompany")) {
                    allowBackButton = true;
                }

                configuration.backButton.visible = allowBackButton;

                return configuration;

            },

            getConfiguration: function () {
                var configuration = utils._.extend({}, utils.deepClone(globals.hierarchyManager.configuration)),
                    title;

                // populate configuration details
                if (this.model) {
                    title = Mustache.render(globals.hierarchyManager.constants.SECOND_LEVEL_TITLE,
                        {
                            "hierarchyName": this.model.get("name")
                        });
                } else {
                    title = globals.hierarchyManager.constants.TOP_LEVEL_TITLE;
                }

                configuration.title.value = title;

                return configuration;
            },

            setCollection: function (collection) {
                this.collection = collection;

                if (this.collection) {
                    if (utils._.size(this.collection) === 1) {
                        this.setModel(this.collection.at(0));
                    }
                }
            },

            setModel: function (model) {
                this.model = model;

                if (this.model) {
                    this.setCollection(this.model.get("children"));
                }
            },

            findHierarchy: function (accountId) {
                return this.collection.findWhere({"accountId": accountId});
            },

            hierarchySelected: function (accountId) {
                var hierarchy = this.findHierarchy(accountId);

                if (hierarchy) {
                    if (hierarchy.get("children") && utils._.size(hierarchy.get("children")) > 0) {
                        this.setModel(hierarchy);
                        this.render();
                    } else {
                        this.trigger("hierarchySelected", accountId);
                    }
                }
            }
        });


        return HierarchyListView;
    });
