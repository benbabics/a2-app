(function () {
    "use strict";

    angular.module( "app.components.notifications", [] )
        .run(function ($ionicPlatform, $rootScope) {

            function handleApplicationLogOut() {
                //
            }

            $ionicPlatform.ready(function() {
                //setup event listeners:
                $rootScope.$on( "app:logout", handleApplicationLogOut );
            });
        });
})();
