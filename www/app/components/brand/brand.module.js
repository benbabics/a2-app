(function () {
    "use strict";

    angular.module("app.components.brand", [])
        .run(function ($ionicPlatform, $rootScope, BrandManager) {

            function handleApplicationLogOut() {
                BrandManager.clearCachedValues();
            }

            $ionicPlatform.ready(function () {
                //setup event listeners:
                $rootScope.$on("app:logout", handleApplicationLogOut);
            });
        });
})();
