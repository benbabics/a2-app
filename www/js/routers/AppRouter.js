define(["backbone", "utils", "facade"],
    function (Backbone, utils, facade) {

        "use strict";


        var AppRouter = Backbone.Router.extend({
            /*
             * Route Definitions
             */
            routes: {
                "cardAdd"               : "showCardAdd",
                "cardDetails(/)(:id)"   : "showCardDetails",
                "cardSearch"            : "showCardSearch",
                "contactUs"             : "showContactUs",
                "driverAdd"             : "showDriverAdd",
                "driverSearch"          : "showDriverSearch",
                "driverDetails(/)(:id)" : "showDriverDetails",
                "hierarchyManager"      : "showHierarchyManager",
                "invoiceSummary"        : "showInvoiceSummary",
                "paymentAdd"            : "showPaymentAdd",
                "paymentDetails(/)(:id)": "showPaymentDetails",
                "paymentHistory"        : "showPaymentHistory",

                "*page": "changePage",

                ""     : "root"
            },

            /*
             * Route Handlers
             */
            showCardAdd: function () {
                facade.publish("card", "navigateAdd");
            },

            showCardDetails: function (id) {
                facade.publish("card", "navigateCardDetails", id);
            },

            showCardSearch: function () {
                facade.publish("card", "navigateSearch");
            },

            showContactUs: function () {
                facade.publish("contactUs", "navigate");
            },

            showDriverAdd: function () {
                facade.publish("driver", "navigateAdd");
            },

            showDriverSearch: function () {
                facade.publish("driver", "navigateSearch");
            },

            showDriverDetails: function (id) {
                facade.publish("driver", "navigateDriverDetails", id);
            },

            showHierarchyManager: function () {
                facade.publish("hierarchy", "navigate");
            },

            showInvoiceSummary: function () {
                facade.publish("invoice", "navigateSummary");
            },

            showPaymentAdd: function () {
                facade.publish("invoice", "navigatePaymentAdd");
            },

            showPaymentDetails: function (id) {
                facade.publish("invoice", "navigatePaymentDetails", id);
            },

            showPaymentHistory: function () {
                facade.publish("invoice", "navigatePaymentHistory");
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
