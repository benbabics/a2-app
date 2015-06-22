(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function NetworkStatusBannerController($scope, globals) {

        var vm = this;

        vm.bannerText = globals.NOTIFICATIONS.networkError;
        vm.isOnline = true;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            $scope.$on("cordovaOnline", _.bind(onOnline, vm));
            $scope.$on("cordovaOffline", _.bind(onOffline, vm));
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

    angular.module("app.network")
        .controller("NetworkStatusBannerController", NetworkStatusBannerController);
}());