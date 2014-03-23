define(["backbone", "utils", "mustache", "globals", "views/DriverView",
    "text!tmpl/driver/searchResults.html", "text!tmpl/driver/searchResultsHeader.html"],
    function (Backbone, utils, Mustache, globals, DriverView, pageTemplate, searchResultsHeaderTemplate) {

        "use strict";


        var DriverListView = Backbone.View.extend({
            el: "#driverSearchResults",

            template: pageTemplate,
            headerTemplate: searchResultsHeaderTemplate,

            userModel: null,

            events: {
                "click #showAllResults-btn": "handleShowAllDrivers"
            },

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

                // TODO - Figure out why assigning $content.find("#driverSearchResultList") to a variable and using
                // the variable rather that calling find each time resulted in no results getting added to the list

                // empty list
                $content.find("#driverSearchResultList").empty();

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                // populate $list
                this.collection.each(function (driver) {
                    var driverView = new DriverView({
                        model: driver
                    }).render();
                    $content.find("#driverSearchResultList").append(driverView.$el); // add driver to the list
                }, this);

                try {
                    // This call throws an exception if called during startup before the list is ready
                    $content.find("#driverSearchResultList").listview("refresh");
                } catch (e) {}

                $content.trigger("create");
            },

            getConfiguration: function () {
                var configuration = utils._.extend({}, utils.deepClone(globals.driverSearchResults.configuration)),
                    resultsInfo;

                if (this.collection.length > 0) {
                    resultsInfo = Mustache.render(globals.driverSearchResults.constants.TOTAL_RESULTS_FORMAT, {
                        "numberDisplayed": this.collection.length,
                        "totalResults"   : this.collection.totalResults
                    });
                }
                else {
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
