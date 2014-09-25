define(["backbone", "utils", "mustache", "globals", "views/BaseView", "views/DriverView",
    "text!tmpl/driver/searchResults.html", "text!tmpl/driver/searchResultsHeader.html"],
    function (Backbone, utils, Mustache, globals, BaseView, DriverView, pageTemplate, searchResultsHeaderTemplate) {

        "use strict";


        var DriverListView = BaseView.extend({
            el: "#driverSearchResults",

            template: pageTemplate,
            headerTemplate: searchResultsHeaderTemplate,

            events: {
                "click #showAllResults-btn": "handleShowAllDrivers"
            },

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

                $header.html(Mustache.render(this.headerTemplate,
                    {
                        "permissions": this.userModel.get("selectedCompany").get("permissions")
                    }));

                $header.enhanceWithin();
            },

            renderContent: function () {
                var $content = this.$el.find(".ui-content"),
                    container = document.createDocumentFragment(),
                    listContainer;

                // empty list
                $content.find("#driverSearchResultList").empty();

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                listContainer = $content.find("#driverSearchResultList");

                // populate $list
                this.collection.each(function (driver) {
                    var driverView = new DriverView({
                        model: driver
                    });
                    driverView.render();
                    container.appendChild(driverView.el);  // add driver to the list
                }, this);

                listContainer.append(container);

                try {
                    // This call throws an exception if called during startup before the list is ready
                    listContainer.listview("refresh");
                } catch (ignore) {}

                $content.enhanceWithin();
            },

            getConfiguration: function () {
                var configuration = utils._.extend({}, utils.deepClone(globals.driverSearchResults.configuration)),
                    resultsInfo;

                if (this.collection.length > 0) {
                    resultsInfo = Mustache.render(globals.driverSearchResults.constants.TOTAL_RESULTS_FORMAT, {
                        "numberDisplayed": this.collection.length,
                        "totalResults"   : this.collection.totalResults
                    });
                } else {
                    resultsInfo = globals.driverSearchResults.constants.NO_RESULTS_MESSAGE;
                }

                configuration.totalResults.value = resultsInfo;
                configuration.submitButton.visible = !this.collection.isAllResults &&
                    this.collection.pageSize < globals.driverSearch.constants.SHOW_ALL_PAGE_SIZE;

                return configuration;
            },

            handleShowAllDrivers: function () {
                this.trigger("showAllDrivers");
            }
        });


        return DriverListView;
    });
