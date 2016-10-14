(function () {
    "use strict";

    angular.module("app.components.card", ["app.components.account"])
        .run(function ($ionicPlatform, $rootScope, CardManager) {

            function handleApplicationLogOut() {
                CardManager.clearCachedValues();
            }

            $ionicPlatform.ready(function () {
                //setup event listeners:
                $rootScope.$on("app:logout", handleApplicationLogOut);
            });
        });
})();
