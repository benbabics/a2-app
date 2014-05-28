define(["facade", "utils", "controllers/BaseController", "models/UserModel", "views/HomeView"],
    function (facade, utils, BaseController, UserModel, HomeView) {

        "use strict";


        var HomeController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        HomeController = BaseController.extend({
            homeView: null,
            userModel: null,

            construct: function () {
            },

            init: function () {
                this.userModel = UserModel.getInstance();

                // create home view
                this.homeView = new HomeView({
                    model: this.userModel
                });
            },

            navigate: function () {
                this.homeView.render();
                utils.changePage(this.homeView.$el, null, null, true);
            },

            beforeNavigateCondition: function () {
                if (this.userModel.get("selectedCompany")) {
                    return true;
                }

                facade.publish("hierarchy", "navigate");
                return false;
            }
        }, classOptions);


        return new HomeController();
    });