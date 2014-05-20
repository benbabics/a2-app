define(["globals", "utils", "facade", "collections/DriverCollection", "controllers/BaseController",
        "models/UserModel", "models/DriverModel", "views/DriverAddView", "views/DriverEditView",
        "views/DriverListView", "views/DriverSearchView"],
    function (globals, utils, facade, DriverCollection, BaseController, UserModel, DriverModel,
              DriverAddView, DriverEditView, DriverListView, DriverSearchView) {

        "use strict";


        var DriverController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        DriverController = BaseController.extend({
            driverCollection: null,
            driverAddView: null,
            driverEditView: null,
            driverListView: null,
            driverSearchView: null,

            construct: function () {
            },

            init: function () {
                this.driverCollection = new DriverCollection();

                // create add view
                this.driverAddView = new DriverAddView({
                    model    : new DriverModel(),
                    userModel: UserModel.getInstance()
                });

                // create edit view
                this.driverEditView = new DriverEditView({
                    userModel: UserModel.getInstance()
                });

                // create search view
                this.driverSearchView = new DriverSearchView({
                    model    : new DriverModel(),
                    userModel: UserModel.getInstance()
                });

                // create list view
                this.driverListView = new DriverListView({
                    collection: this.driverCollection,
                    userModel : UserModel.getInstance()
                });

                // listen for events
                this.driverAddView.on("driverAddSuccess", this.showDriverAddDetails, this);
                this.driverEditView.on("reactivateDriverSuccess terminateDriverSuccess",
                                       this.showDriverStatusChangeDetails, this);
                this.driverSearchView.on("searchSubmitted", this.showSearchResults, this);
                this.driverListView.on("showAllDrivers", this.showAllSearchResults, this);
            },

            navigateAdd: function () {
                this.driverAddView.render();
                utils.changePage(this.driverAddView.$el);
            },

            navigateSearch: function () {
                this.driverSearchView.render();
                utils.changePage(this.driverSearchView.$el, null, null, true);
            },

            navigateDriverDetails: function (id) {
                this.driverEditView.setModel(this.driverCollection.findWhere({"id": id}));
                this.driverEditView.render();
                utils.changePage(this.driverEditView.$el);
            },

            showDriverAddDetails: function (driverAddResponse) {
                facade.publish("app", "alert", {
                    title          : globals.driverAddedDetails.constants.SUCCESS_TITLE,
                    message        : driverAddResponse,
                    primaryBtnLabel: globals.DIALOG.DEFAULT_BTN_TEXT
                });
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
                var self = this,
                    data = this.driverSearchView.model.toJSON();

                this.driverListView.showLoadingIndicator();

                // silently reset collection to ensure it always is "updated", even if it's the same models again
                this.driverCollection.reset([], { "silent": true });

                utils.when(this.fetchCollection(this.driverCollection, data))
                    .always(function () {
                        self.driverListView.render();
                        utils.changePage(self.driverListView.$el, null, null, true);
                        self.driverListView.hideLoadingIndicator();
                    });
            }
        }, classOptions);


        return new DriverController();
    });