define(["jclass", "globals", "utils", "facade", "collections/DriverCollection", "models/UserModel",
        "models/DriverSearchModel", "views/DriverEditView", "views/DriverListView", "views/DriverSearchView"],
    function (JClass, globals, utils, facade, DriverCollection, UserModel, DriverSearchModel,
              DriverEditView, DriverListView, DriverSearchView) {

        "use strict";


        var DriverController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        DriverController = JClass.extend({
            driverCollection: null,
            driverEditView: null,
            driverListView: null,
            driverSearchModel: null,
            driverSearchView: null,

            construct: function () {
            },

            init: function () {
                this.driverCollection = new DriverCollection();
                this.driverSearchModel = new DriverSearchModel();

                // create edit view
                this.driverEditView = new DriverEditView({
                    userModel: UserModel.getInstance()
                });

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
                this.driverEditView.on("reactivateDriverSuccess terminateDriverSuccess",
                                       this.showDriverStatusChangeDetails, this);
                this.driverSearchView.on("searchSubmitted", this.showSearchResults, this);
                this.driverListView.on("showAllDrivers", this.showAllSearchResults, this);
            },

            navigateSearch: function () {
                this.driverSearchView.render();
                utils.changePage(this.driverSearchView.$el, null, null, true);
            },

            navigateDriverDetails: function (driverId) {
                this.driverEditView.model = this.driverCollection.findWhere({"driverId": driverId});
                this.driverEditView.render();
                utils.changePage(this.driverEditView.$el);
            },

            showDriverStatusChangeDetails: function (driverChangeStatusResponse) {
                var self = this;

                facade.publish("app", "alert", {
                    title          : globals.driverEdit.constants.STATUS_CHANGE_SUCCESS_TITLE,
                    message        : driverChangeStatusResponse.message,
                    primaryBtnLabel: globals.DIALOG.DEFAULT_BTN_TEXT,
                    popupafterclose:   function () {
                        self.updateCollection();
                    }
                });
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