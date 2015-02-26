define(["globals", "facade", "utils", "collections/CardCollection", "controllers/BaseController",
        "models/UserModel", "models/CardModel", "models/ShippingModel", "views/CardAddView", "views/CardDetailView",
        "views/CardEditView", "views/CardListView", "views/CardSearchView", "views/CardShippingView"],
    function (globals, facade, utils, CardCollection, BaseController, UserModel, CardModel, ShippingModel,
              CardAddView, CardDetailView, CardEditView, CardListView, CardSearchView, CardShippingView) {

        "use strict";


        var CardController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        CardController = BaseController.extend({
            cardCollection: null,
            cardAddView: null,
            cardDetailView: null,
            cardEditView: null,
            cardListView: null,
            cardSearchView: null,
            cardShippingView: null,
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

                // create shipping view
                this.cardShippingView = new CardShippingView({
                    model    : new ShippingModel(),
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

                // create edit view
                this.cardEditView = new CardEditView({
                    userModel: this.userModel
                });

                // listen for events
                this.cardAddView.on("cardAddSubmitted", this.showCardAddShippingDetails, this);
                this.cardEditView.on("cardEditSuccess", this.showCardEditDetails, this);
                this.cardEditView.on("cardEditSubmitted", this.showReissueCardPrompt, this);
                this.cardShippingView.on("cardAddSuccess", this.showCardAddDetails, this);
                this.cardShippingView.on("cardEditSuccess", this.showCardEditDetails, this);
                this.cardDetailView.on("terminateCardSuccess", this.showCardStatusChangeDetails, this);
                this.cardSearchView.on("searchSubmitted", this.showSearchResults, this);
                this.cardListView.on("showAllCards", this.showAllSearchResults, this);
            },

            fetchProperties: function (view, callback) {
                var selectedCompany = this.userModel.get("selectedCompany");

                if (!selectedCompany) {
                    return true;
                }

                if (selectedCompany.areFetchedPropertiesEmpty()) {
                    view.showLoadingIndicator();

                    utils.when(selectedCompany.fetchAuthorizationProfiles())
                        .always(function () {
                            view.hideLoadingIndicator();
                        })
                        .done(function () {
                            callback();
                        });
                }

                // allow navigation if the the fetched properties are available
                return !selectedCompany.areFetchedPropertiesEmpty();
            },

            beforeNavigateAddCondition: function () {
                var self = this;
                return this.fetchProperties(this.cardAddView, function () { self.navigateAdd(); });
            },

            beforeNavigateEditCondition: function (id) {
                var self = this;
                return this.fetchProperties(this.cardEditView, function () { self.navigateEdit(id); });
            },

            navigateAdd: function () {
                this.cardAddView.render();
                utils.changePage(this.cardAddView.$el);
            },

            navigateCardDetails: function (id) {
                this.cardDetailView.setModel(this.cardCollection.findWhere({"id": id}));
                this.cardDetailView.render();
                utils.changePage(this.cardDetailView.$el);
            },

            navigateEdit: function (id) {
                this.cardEditView.setModel(this.cardCollection.findWhere({"id": id}));
                this.cardEditView.render();
                utils.changePage(this.cardEditView.$el);
            },

            navigateSearch: function () {
                this.cardSearchView.render();
                utils.changePage(this.cardSearchView.$el, null, null, true);
            },

            rollbackEditChanges: function () {
                this.cardEditView.rollbackChanges();
            },

            showCardAddShippingDetails: function () {
                this.showCardShippingDetails(this.cardAddView.model);
            },

            showCardEditShippingDetails: function () {
                this.showCardShippingDetails(this.cardEditView.model);
            },

            showCardShippingDetails: function (cardModel) {
                this.cardShippingView.setCardModel(cardModel);
                this.cardShippingView.render();
                utils.changePage(this.cardShippingView.$el);
            },

            showCardAddDetails: function (cardAddResponse) {
                var self = this;

                facade.publish("app", "alert", {
                    title          : globals.cardChangedDetails.constants.SUCCESS_TITLE,
                    message        : cardAddResponse,
                    primaryBtnLabel: globals.DIALOG.DEFAULT_BTN_TEXT,
                    popupafterclose:   function () {
                        self.navigateAdd();
                    }
                });
            },

            showCardEditDetails: function (cardEditResponse) {
                var self = this;

                facade.publish("app", "alert", {
                    title          : globals.cardChangedDetails.constants.SUCCESS_TITLE,
                    message        : cardEditResponse,
                    primaryBtnLabel: globals.DIALOG.DEFAULT_BTN_TEXT,
                    popupafterclose:   function () {
                        self.updateCollection();
                    }
                });
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

            showReissueCardPrompt: function (reissueCardPromptMessage) {
                var self = this,
                    constants = globals.cardEdit.constants;

                facade.publish("app", "alert", {
                    title            : constants.REISSUE_PROMPT_TITLE,
                    message          : reissueCardPromptMessage,
                    primaryBtnLabel  : constants.REISSUE_PROMPT_OK_BTN_TEXT,
                    primaryBtnHandler: function () {
                        self.showCardEditShippingDetails();
                    },
                    secondaryBtnLabel: constants.REISSUE_PROMPT_CANCEL_BTN_TEXT,
                    secondaryBtnHandler: function () {
                        self.rollbackEditChanges();
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

                utils.when(this.fetchCollection(this.cardCollection, data))
                    .always(function () {
                        self.cardListView.render();
                        utils.changePage(self.cardListView.$el, null, null, true);
                        self.cardListView.hideLoadingIndicator();
                    });
            }
        }, classOptions);


        return new CardController();
    });