define(["utils", "controllers/BaseController", "models/UserModel", "views/HomeView"],
    function (utils, BaseController, UserModel, HomeView) {

        "use strict";


        var HomeController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        HomeController = BaseController.extend({
            homeView: null,

            construct: function () {
            },

            init: function () {
                // create view
                this.homeView = new HomeView({
                    model: UserModel.getInstance()
                });
            },

            navigate: function () {
                this.homeView.render();
                utils.changePage(this.homeView.$el, null, null, true);
            }
        }, classOptions);


        return new HomeController();
    });