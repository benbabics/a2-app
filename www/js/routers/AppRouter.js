define(["backbone", "utils", "facade"],
    function (Backbone, utils, facade) {

        "use strict";


        var AppRouter = Backbone.Router.extend({
            /*
             * Route Definitions
            */
            routes: {
                "contactUs": "showContactUs",

                "*page": "changePage",

                ""     : "root"
            },

            /*
             * Route Handlers
            */
            showContactUs: function () {
                facade.publish("contactUs", "navigate");
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
