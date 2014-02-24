define(["backbone", "utils"],
    function (Backbone, utils) {

        "use strict";


        var AppRouter = Backbone.Router.extend({
            /*
             * Route Definitions
            */
            routes: {
                "*page"              : "changePage",

                ""                   : "root"
            },

            /*
             * Route Handlers
            */
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
