(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("driver", {
            abstract: true,
            url:      "/drivers",
            views: {
                "@": {
                    template: "<ion-nav-view name='view'></ion-nav-view>"
                }
            }
        });

        $stateProvider.state("driver.list", {
            cache: true,
            url:   "/list",
            views: {
                "view@driver": {
                    templateUrl: "app/components/driver/templates/driverList.html",
                    controller:  "DriverListController as vm"
                }
            },
            onEnter: (globals, AnalyticsUtil) => AnalyticsUtil.trackView(globals.DRIVER_LIST.CONFIG.ANALYTICS.pageName)
        });

        $stateProvider.state("driver.detail", {
            url:   "/detail/:promptId",
            cache: false,
            resolve: {
                driver: ($stateParams, DriverManager) => {
                    return DriverManager.fetchDriver( $stateParams.promptId )
                }
            },
            views: {
                "view@driver": {
                    templateUrl: "app/components/driver/templates/driverDetail.html",
                    controller:  "DriverDetailController as vm"
                }
            },
            onEnter: (globals, AnalyticsUtil) => AnalyticsUtil.trackView(globals.DRIVER_DETAILS.CONFIG.ANALYTICS.pageName)
        });
    }

    angular.module( "app.components.driver" )
        .config( configureRoutes );
}());