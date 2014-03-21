define(["jclass", "utils", "collections/DriverCollection", "models/UserModel", "models/DriverSearchModel",
        "views/DriverListView", "views/DriverSearchView"],
    function (JClass, utils, DriverCollection, UserModel, DriverSearchModel, DriverListView, DriverSearchView) {

        "use strict";


        var DriverController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        DriverController = JClass.extend({
            driverCollection: null,
            driverListView: null,
            driverSearchModel: null,
            driverSearchView: null,

            construct: function () {
            },

            init: function () {
                this.driverCollection = new DriverCollection();
                this.driverSearchModel = new DriverSearchModel();

                // create search view
                this.driverSearchView = new DriverSearchView({
                    model    : this.driverSearchModel,
                    userModel: UserModel.getInstance()
                });

                // create list view
                this.driverListView = new DriverListView({
                    collection: this.driverCollection,
                    userModel : UserModel.getInstance()
                });

                // listen for events
                this.driverSearchView.on("searchSubmitted", this.showSearchResults, this);
                this.driverListView.on("showAllDrivers", this.showAllSearchResults, this);
            },

            navigateSearch: function () {
                this.driverSearchView.render();
                utils.changePage(this.driverSearchView.$el, null, null, true);
            },

            showSearchResults: function () {
                this.driverCollection.resetPage();
                this.updateCollection();
            },

            showAllSearchResults: function () {
                this.driverCollection.showAll();
                this.updateCollection();
            },

            updateCollection: function () {
                var self = this;

                this.driverListView.showLoadingIndicator();

                // silently reset collection to ensure it always is "updated", even if it's the same models again
                this.driverCollection.reset([], { "silent": true });

                utils.when(this.fetchCollection())
                    .always(function () {
                        self.driverListView.render();
                        utils.changePage(self.driverListView.$el, null, null, true);
                        self.driverListView.hideLoadingIndicator();
                    });
            },

            fetchCollection: function () {
                // if params not supplied use the Search Criteria
                var deferred = utils.Deferred(),
                    data = this.driverSearchModel.toJSON();

                this.driverCollection
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


        return new DriverController();
    });