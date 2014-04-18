define(["jclass", "globals", "facade", "utils", "collections/CardCollection", "models/UserModel", "models/CardModel",
        "views/CardAddView", "views/CardDetailView", "views/CardListView", "views/CardSearchView"],
    function (JClass, globals, facade, utils, CardCollection, UserModel, CardModel,
              CardAddView, CardDetailView, CardListView, CardSearchView) {

        "use strict";


        var CardController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        CardController = JClass.extend({
            cardCollection: null,
            cardAddView: null,
            cardDetailView: null,
            cardListView: null,
            cardSearchView: null,
            userModel: null,

            construct: function () {
            },

            init: function () {
                this.userModel = UserModel.getInstance();
                this.cardCollection = new CardCollection();

                // create add view
                this.cardAddView = new CardAddView({
                    model    : new CardModel(),
                    userModel: this.userModel
                });

                // create search view
                this.cardSearchView = new CardSearchView({
                    model    : new CardModel(),
                    userModel: this.userModel
                });

                // create list view
                this.cardListView = new CardListView({
                    collection: this.cardCollection,
                    userModel : this.userModel
                });

                // create detail view
                this.cardDetailView = new CardDetailView({
                    userModel: this.userModel
                });

                // listen for events
                this.cardDetailView.on("terminateCardSuccess", this.showCardStatusChangeDetails, this);
                this.cardSearchView.on("searchSubmitted", this.showSearchResults, this);
                this.cardListView.on("showAllCards", this.showAllSearchResults, this);
            },

            beforeNavigateAddCondition: function () {
                var self = this,
                    selectedCompany = this.userModel.get("selectedCompany");

                if (!selectedCompany) {
                    return true;
                }

                if (selectedCompany.areFetchedPropertiesEmpty()) {
                    this.cardAddView.showLoadingIndicator();

                    utils.when(selectedCompany.fetch())
                        .always(function () {
                            self.cardAddView.hideLoadingIndicator();
                        })
                        .done(function () {
                            self.navigateAdd.apply(self, arguments);
                        });
                }

                // allow navigation if the the fetched properties are available
                return !selectedCompany.areFetchedPropertiesEmpty();
            },

            navigateAdd: function () {
                this.cardAddView.render();
                utils.changePage(this.cardAddView.$el);
            },

            navigateCardDetails: function (id) {
                this.cardDetailView.model = this.cardCollection.findWhere({"id": id});
                this.cardDetailView.render();
                utils.changePage(this.cardDetailView.$el);
            },

            navigateSearch: function () {
                this.cardSearchView.render();
                utils.changePage(this.cardSearchView.$el, null, null, true);
            },

            showCardStatusChangeDetails: function (cardChangeStatusResponse) {
                var self = this;

                facade.publish("app", "alert", {
                    title          : globals.cardDetails.constants.STATUS_CHANGE_SUCCESS_TITLE,
                    message        : cardChangeStatusResponse.message,
                    primaryBtnLabel: globals.DIALOG.DEFAULT_BTN_TEXT,
                    popupafterclose:   function () {
                        self.updateCollection();
                    }
                });
            },

            showSearchResults: function () {
                this.cardCollection.resetPage();
                this.updateCollection();
            },

            showAllSearchResults: function () {
                this.cardCollection.showAll();
                this.updateCollection();
            },

            updateCollection: function () {
                var self = this,
                    data = this.cardSearchView.model.toJSON();

                this.cardListView.showLoadingIndicator();

                // silently reset collection to ensure it always is "updated", even if it's the same models again
                this.cardCollection.reset([], { "silent": true });

                utils.when(utils.fetchCollection(this.cardCollection, data))
                    .always(function () {
                        self.cardListView.render();
                        utils.changePage(self.cardListView.$el, null, null, true);
                        self.cardListView.hideLoadingIndicator();
                    });
            }
        }, classOptions);


        return new CardController();
    });