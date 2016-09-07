(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function ServerConnectionErrorBannerController($scope, $rootScope, globals) {

        var vm = this;

        vm.bannerText = globals.GLOBAL_NOTIFICATIONS.serverConnectionError;
        vm.isConnected = true;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            var deregisterStateChangeStartListener = $rootScope.$on("$stateChangeStart", _.bind(hide, vm)),
                deregisterServerConnectionSuccessListener = $rootScope.$on("network:serverConnectionSuccess", _.bind(hide, vm)),
                deregisterServerConnectionErrorListener = $rootScope.$on("network:serverConnectionError", _.bind(show, vm));

            $scope.$on("notificationBar:closed", _.bind(hide, vm));

            // deregister $rootScope listeners
            $scope.$on("$destroy", function () {
                deregisterStateChangeStartListener();
                deregisterServerConnectionSuccessListener();
                deregisterServerConnectionErrorListener();
            });
        }

        function show() {
            vm.isConnected = false;
        }

        function hide() {
            vm.isConnected = true;
        }
    }

    angular.module("app.shared.network")
        .controller("ServerConnectionErrorBannerController", ServerConnectionErrorBannerController);
}());
