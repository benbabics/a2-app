(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function ServerConnectionErrorBannerController($scope, $rootScope, globals) {

        var vm = this;

        vm.bannerText = globals.NOTIFICATIONS.serverConnectionError;
        vm.isConnected = true;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            $scope.$on("serverConnectionSuccess", _.bind(hide, vm));
            $scope.$on("serverConnectionError", _.bind(show, vm));
            $scope.$on("bannerClosed", _.bind(hide, vm));
            $rootScope.$on("$stateChangeStart", _.bind(hide, vm));
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