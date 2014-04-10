define(["jclass", "globals", "utils", "collections/CardCollection", "models/UserModel",
        "models/CardModel", "views/CardSearchView"],
    function (JClass, globals, utils, CardCollection, UserModel, CardModel, CardSearchView) {

        "use strict";


        var CardController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        CardController = JClass.extend({
            cardCollection: null,
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

                // listen for events
                this.cardSearchView.on("searchSubmitted", this.showSearchResults, this);
            },

            navigateSearch: function () {
                this.cardSearchView.resetForm();
                this.cardSearchView.render();
                utils.changePage(this.cardSearchView.$el, null, null, true);
            },

            showSearchResults: function () {
                this.cardCollection.resetPage();
                this.updateCollection();
            },

            updateCollection: function () {
//                var self = this;

//                this.cardListView.showLoadingIndicator();

                // silently reset collection to ensure it always is "updated", even if it's the same models again
                this.cardCollection.reset([], { "silent": true });

                utils.when(this.fetchCollection())
                    .always(function () {
//                        self.cardListView.render();
//                        utils.changePage(self.driverListView.$el, null, null, true);
//                        self.cardListView.hideLoadingIndicator();
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