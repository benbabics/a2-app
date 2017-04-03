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
            }
        });

        $stateProvider.state("driver.detail", {
            url:   "/detail/:driverId",
            cache: false,
            resolve: {
                driver: ($stateParams, DriverManager) => {
                    return DriverManager.fetchDriver( $stateParams.driverId )
                }
            },
            views: {
                "view@driver": {
                    templateUrl: "app/components/driver/templates/driverDetail.html",
                    controller:  "DriverDetailController as vm"
                }
            }
        });
    }

    angular.module( "app.components.driver" )
        .config( configureRoutes );
}());