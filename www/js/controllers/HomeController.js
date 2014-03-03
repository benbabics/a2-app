define(["utils", "jclass", "views/HomeView"],
    function (utils, JClass, HomeView) {

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
                this.homeView = new HomeView();
            },

            navigate: function () {
                utils.changePage(this.homeView.$el);
            }
        }, classOptions);


        return new HomeController();
    });