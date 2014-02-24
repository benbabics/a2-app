define(["backbone", "utils"],
    function (Backbone, utils) {

        "use strict";


        var AppRouter = Backbone.Router.extend({
            /*
             * Route Definitions
            */
            routes: {
                "about"              : "showAbout",
                "contactUs"          : "showContactUs",
                "info"               : "showInfo",
                "termsAndConditions" : "showTermsAndConditions",

                ""                   : "root"
            },

            /*
             * Route Handlers
            */
            showAbout: function () {
                utils.changePage("#about", null, null, true); // force updateHash
            },

            showContactUs: function () {
                utils.changePage("#contactUs", null, null, true); // force updateHash
            },

            showInfo: function () {
                utils.changePage("#info", null, null, true); // force updateHash
            },

            showTermsAndConditions: function () {
                utils.changePage("#termsAndConditions", null, null, true); // force updateHash
            },

            root: function () {
            },

            start: function () {
                Backbone.history.start();
            }
        });


        return AppRouter;
    });
