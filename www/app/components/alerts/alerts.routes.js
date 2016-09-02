(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("alerts", {
            abstract: true,
            url: "/alerts",
            views: {
                "@": {
                    template: "<ion-nav-view name='view'></ion-nav-view>"
                }
            }
        });

        $stateProvider.state("alerts.list", {
            cache: true,
            url: "/",
            views: {
                view: {
                    templateUrl: "app/components/alerts/templates/list.html",
                    controller: "AlertsListController as vm"
                }
            },
            onEnter: function (globals, AnalyticsUtil) {
                // AnalyticsUtil.trackView(globals.ALERTS_LIST.CONFIG.ANALYTICS.pageName);
            }
        });
    }

    angular.module("app.components.alerts")
        .config(configureRoutes);
}());
