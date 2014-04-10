define(["backbone", "utils", "mustache", "globals", "views/CardView",
        "text!tmpl/card/searchResults.html", "text!tmpl/card/searchResultsHeader.html"],
    function (Backbone, utils, Mustache, globals, CardView, pageTemplate, searchResultsHeaderTemplate) {

        "use strict";


        var CardListView = Backbone.View.extend({
            el: "#cardSearchResults",

            template: pageTemplate,
            headerTemplate: searchResultsHeaderTemplate,

            userModel: null,

            events: {
                "click #showAllResults-btn": "handleShowAllCards"
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

                // TODO - Figure out why assigning $content.find("#cardSearchResultList") to a variable and using
                // the variable rather that calling find each time resulted in no results getting added to the list

                // empty list
                $content.find("#cardSearchResultList").empty();

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                // populate $list
                this.collection.each(function (card) {
                    var cardView = new CardView({
                        model: card
                    }).render();
                    $content.find("#cardSearchResultList").append(cardView.$el); // add driver to the list
                }, this);

                try {
                    // This call throws an exception if called during startup before the list is ready
                    $content.find("#cardSearchResultList").listview("refresh");
                } catch (e) {}

                $content.trigger("create");
            },

            getConfiguration: function () {
                var configuration = utils._.extend({}, utils.deepClone(globals.cardSearchResults.configuration)),
                    resultsInfo;

                if (this.collection.length > 0) {
                    resultsInfo = Mustache.render(globals.cardSearchResults.constants.TOTAL_RESULTS_FORMAT, {
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

            handleShowAllCards: function () {
                this.trigger("showAllCards");
            }
        });


        return CardListView;
    });
