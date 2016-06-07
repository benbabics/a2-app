(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:5

    /* @ngInject */
    function NetworkStatusController(_, $rootScope, $scope, globals, PlatformUtil) {

        var vm = this;

        vm.bannerText = globals.NOTIFICATIONS.networkError;

        vm.isOnline = PlatformUtil.isOnline();

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            var deregisterCordovaNetworkOnlineListener = $rootScope.$on("$cordovaNetwork:online", _.bind(onOnline, vm)),
                deregisterCordovaNetworkOfflineListener = $rootScope.$on("$cordovaNetwork:offline", _.bind(onOffline, vm));

            //deregister $rootScope listeners
            $scope.$on("$destroy", function () {
                deregisterCordovaNetworkOnlineListener();
                deregisterCordovaNetworkOfflineListener();
            });
        }

        function onOnline() {
            $scope.$apply(function () {
                vm.isOnline = true;
            });
        }

        function onOffline() {
            $scope.$apply(function () {
                vm.isOnline = false;
            });
        }
    }

    angular.module("app.shared.network")
        .controller("NetworkStatusController", NetworkStatusController);
}());
