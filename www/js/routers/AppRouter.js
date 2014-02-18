define(["backbone"],
    function (Backbone) {

        "use strict";


        var AppRouter = Backbone.Router.extend({
            /*
             * Route Definitions
            */
            routes: {
                "" : "root"
            },

            /*
             * Route Handlers
            */

            root: function () {
            },

            start: function () {
                Backbone.history.start();
            }
        });


        return AppRouter;
    });
