(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function LoadingIndicator($ionicLoading, $rootScope) {
        // Private members
        var loadingIndicatorCount = 0;

        // Revealed Public members
        var service = {
            "begin"   : begin,
            "complete": complete
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            /**
             * Set up loading indicator
             */
            $rootScope.$on("app:loadingBegin", function () {
                $ionicLoading.show({
                    template: "<ion-spinner class='spinner-light'></ion-spinner>"
                })
                    .then(function() {
                        // There is a race condition where .hide() may finish before .show() and not cancel it,
                        // resulting in .show() completing successfully, putting up a loading indicator, and effectively freezing the app.
                        // So we check after any successful .show()s to see if the loading indicator should really be up.
                        if (loadingIndicatorCount === 0) {
                            complete();
                        }
                    });
            });

            $rootScope.$on("app:loadingComplete", function () {
                $ionicLoading.hide();
            });
        }

        function begin() {
            if (loadingIndicatorCount === 0) {
                $rootScope.$emit("app:loadingBegin");
            }

            loadingIndicatorCount++;
        }

        function complete() {
            if (loadingIndicatorCount > 0) {
                loadingIndicatorCount--;
            }

            if (loadingIndicatorCount === 0) {
                $rootScope.$emit("app:loadingComplete");
            }
        }
    }

    angular
        .module("app.shared.widgets")
        .factory("LoadingIndicator", LoadingIndicator);
})();
