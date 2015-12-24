(function () {
    "use strict";

    angular.module("app.components.bank", ["app.components.account"])
        .run(function ($ionicPlatform, $rootScope, BankManager) {

            function handleApplicationLogOut() {
                BankManager.clearCachedValues();
            }

            $ionicPlatform.ready(function () {
                //setup event listeners:
                $rootScope.$on("app:logout", handleApplicationLogOut);
            });
        });
})();
