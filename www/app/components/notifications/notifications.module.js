(function () {
    "use strict";

    angular.module("app.components.notifications", [])
        .run(function ($ionicPlatform, $rootScope, NotificationItemsManager) {
            function handleApplicationLogOut() {
                NotificationItemsManager.clearCachedValues();
            }

            $ionicPlatform.ready(function () {
                //setup event listeners:
                $rootScope.$on( "app:logout", handleApplicationLogOut );
            });
        });
})();
