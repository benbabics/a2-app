define(["backbone", "utils", "facade"],
    function (Backbone, utils, facade) {

        "use strict";


        var AppRouter = Backbone.Router.extend({
            /*
             * Route Definitions
            */
            routes: {
                "about": "navigateAbout",

                "*page": "changePage",

                ""     : "root"
            },

            /*
             * Route Handlers
            */
            navigateAbout: function () {
                facade.publish("about", "navigate");
            },

            changePage: function (page) {
                utils.changePage("#" + page, null, null, true);
            },

            root: function () {
            },

            start: function () {
                Backbone.history.start();
            }
        });


        return AppRouter;
    });
