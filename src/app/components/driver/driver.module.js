(function () {
    "use strict";

    angular.module( "app.components.driver", [] )
        .run(($ionicPlatform, $rootScope, DriverManager) => {

            function handleApplicationLogOut() {
                DriverManager.clearCachedValues();
            }

            $ionicPlatform.ready(() => {
                $rootScope.$on( "app:logout", handleApplicationLogOut );
            });
        });
})();
