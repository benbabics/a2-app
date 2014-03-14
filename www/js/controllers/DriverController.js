define(["jclass", "utils", "models/UserModel", "models/DriverSearchModel", "views/DriverSearchView"],
    function (JClass, utils, UserModel, DriverSearchModel, DriverSearchView) {

        "use strict";


        var DriverController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        DriverController = JClass.extend({
            driverSearchView: null,

            construct: function () {
            },

            init: function () {
                // create search view
                this.driverSearchView = new DriverSearchView({
                    model: new DriverSearchModel(),
                    userModel: UserModel.getInstance()
                });
            },

            navigateSearch: function () {
                this.driverSearchView.render();
                utils.changePage(this.driverSearchView.$el, null, null, true);
            }
        }, classOptions);


        return new DriverController();
    });