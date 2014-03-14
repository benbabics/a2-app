define(["backbone", "utils", "facade"],
    function (Backbone, utils, facade) {

        "use strict";


        var AppRouter = Backbone.Router.extend({
            /*
             * Route Definitions
            */
            routes: {
                "contactUs"   : "showContactUs",
                "driverSearch": "showDriverSearch",

                "*page": "changePage",

                ""     : "root"
            },

            /*
             * Route Handlers
            */
            showContactUs: function () {
                facade.publish("contactUs", "navigate");
            },

            showDriverSearch: function () {
                facade.publish("driver", "navigateSearch");
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
