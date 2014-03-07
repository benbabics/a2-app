define(["utils", "jclass", "models/UserModel", "views/HomeView"],
    function (utils, JClass, UserModel, HomeView) {

        "use strict";


        var HomeController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        HomeController = JClass.extend({
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