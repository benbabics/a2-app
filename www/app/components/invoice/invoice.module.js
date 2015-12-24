(function () {
    "use strict";

    angular.module("app.components.invoice", ["app.components.account"])
        .run(function ($ionicPlatform, $rootScope, InvoiceManager) {

            function handleApplicationLogOut() {
                InvoiceManager.clearCachedValues();
            }

            $ionicPlatform.ready(function () {
                //setup event listeners:
                $rootScope.$on("app:logout", handleApplicationLogOut);
            });
        });
})();
