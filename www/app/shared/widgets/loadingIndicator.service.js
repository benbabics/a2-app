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
            loadingIndicatorCount--;

            if (loadingIndicatorCount === 0) {
                $rootScope.$emit("app:loadingComplete");
            }
        }
    }

    angular
        .module("app.shared.widgets")
        .factory("LoadingIndicator", LoadingIndicator);
})();
