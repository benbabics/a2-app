(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("notifications", {
            abstract: true,
            url: "/notifications",
            views: {
                "@": {
                    template: "<ion-nav-view name='view'></ion-nav-view>"
                }
            }
        });

        $stateProvider.state("notifications.list", {
            cache: true,
            url: "/",
            views: {
                view: {
                    templateUrl: "app/components/notifications/notificationsList/templates/notificationsList.html",
                    controller: "NotificationsListController as vm"
                }
            },
            onEnter: function (globals, AnalyticsUtil) {
                // AnalyticsUtil.trackView(globals.NOTIFICATIONS_LIST.CONFIG.ANALYTICS.pageName);
            }
        });
    }

    angular.module("app.components.notifications")
        .config(configureRoutes);
}());
