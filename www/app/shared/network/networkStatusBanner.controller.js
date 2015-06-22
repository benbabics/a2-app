(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function NetworkStatusBannerController($rootScope, $scope, globals) {

        var vm = this;

        vm.bannerText = globals.NOTIFICATIONS.networkError;
        vm.isOnline = true;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            $rootScope.$on("$cordovaNetwork:online", _.bind(onOnline, vm));
            $rootScope.$on("$cordovaNetwork:offline", _.bind(onOffline, vm));
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