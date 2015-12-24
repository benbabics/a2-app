(function () {
    "use strict";

    angular.module("app.components.payment", ["app.components.bank"])
        .run(function ($ionicPlatform, $rootScope, PaymentManager) {

            function handleApplicationLogOut() {
                PaymentManager.clearCachedValues();
            }

            $ionicPlatform.ready(function () {
                //setup event listeners:
                $rootScope.$on("app:logout", handleApplicationLogOut);
            });
        });
})();
