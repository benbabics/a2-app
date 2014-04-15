define(["jclass", "globals", "facade", "utils", "collections/CardCollection", "models/UserModel", "models/CardModel",
        "views/CardDetailView", "views/CardListView", "views/CardSearchView"],
    function (JClass, globals, facade, utils, CardCollection, UserModel, CardModel,
              CardDetailView, CardListView, CardSearchView) {

        "use strict";


        var CardController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        CardController = JClass.extend({
            cardCollection: null,
            cardDetailView: null,
            cardListView: null,
            cardSearchView: null,

            construct: function () {
            },

            init: function () {
                this.cardCollection = new CardCollection();

                // create search view
                this.cardSearchView = new CardSearchView({
                    model    : new CardModel(),
                    userModel: UserModel.getInstance()
                });

                // create list view
                this.cardListView = new CardListView({
                    collection: this.cardCollection,
                    userModel : UserModel.getInstance()
                });

                // create detail view
                this.cardDetailView = new CardDetailView({
                    userModel: UserModel.getInstance()
                });

                // listen for events
                this.cardDetailView.on("terminateCardSuccess", this.showCardStatusChangeDetails, this);
                this.cardSearchView.on("searchSubmitted", this.showSearchResults, this);
                this.cardListView.on("showAllCards", this.showAllSearchResults, this);
            },

            navigateCardDetails: function (id) {
                this.cardDetailView.model = this.cardCollection.findWhere({"id": id});
                this.cardDetailView.render();
                utils.changePage(this.cardDetailView.$el);
            },

            navigateSearch: function () {
                this.cardSearchView.resetForm();
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
                var self = this;

                this.cardListView.showLoadingIndicator();

                // silently reset collection to ensure it always is "updated", even if it's the same models again
                this.cardCollection.reset([], { "silent": true });

                utils.when(this.fetchCollection())
                    .always(function () {
                        self.cardListView.render();
                        utils.changePage(self.cardListView.$el, null, null, true);
                        self.cardListView.hideLoadingIndicator();
                    });
            },

            fetchCollection: function () {
                // if params not supplied use the Search Criteria
                var deferred = utils.Deferred(),
                    data = this.cardSearchView.model.toJSON();

                this.cardCollection
                    .once("sync",
                        function () {
                            deferred.resolve();
                        },
                        this)
                    .once("error",
                        function () {
                            deferred.reject();
                        },
                        this)
                    .fetch(data); // fetch new data with supplied params

                return deferred.promise();
            }
        }, classOptions);


        return new CardController();
    });