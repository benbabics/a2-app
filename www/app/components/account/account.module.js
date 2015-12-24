(function () {
    "use strict";

    angular.module("app.components.account", [])
        .run(function ($ionicPlatform, $rootScope, AccountManager) {

            function handleApplicationLogOut() {
                AccountManager.clearCachedValues();
            }

            $ionicPlatform.ready(function () {
                //setup event listeners:
                $rootScope.$on("app:logout", handleApplicationLogOut);
            });
        });
})();
