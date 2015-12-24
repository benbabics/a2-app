(function () {
    "use strict";

    angular.module("app.components.transaction", ["app.components.account"])
        .run(function ($ionicPlatform, $rootScope, TransactionManager) {

            function handleApplicationLogOut() {
                TransactionManager.clearCachedValues();
            }

            $ionicPlatform.ready(function () {
                //setup event listeners:
                $rootScope.$on("app:logout", handleApplicationLogOut);
            });
        });
})();
