(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    // jshint maxparams:5
    function NetworkStatusController($ionicModal, $rootScope, $scope, globals, CommonService) {

        // Constants
        var MODAL_TEMPLATE = "app/shared/network/templates/networkStatus.modal.html";

        // Private members
        var _ = CommonService._,
            modal;

        var vm = this;

        vm.bannerText = globals.NOTIFICATIONS.networkError;
        vm.disableModal = disableModal;
        vm.enableModal = enableModal;
        vm.isOnline = true;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            var deregisterCordovaNetworkOnlineListener = $rootScope.$on("$cordovaNetwork:online", _.bind(onOnline, vm)),
                deregisterCordovaNetworkOfflineListener = $rootScope.$on("$cordovaNetwork:offline", _.bind(onOffline, vm));

            vm.enableModal();

            //deregister $rootScope listeners
            $scope.$on("$destroy", function () {
                deregisterCordovaNetworkOnlineListener();
                deregisterCordovaNetworkOfflineListener();
            });
        }

        function disableModal() {
            modal = null;
        }

        function enableModal() {
            var modalScope = $scope;

            modalScope.bannerText = vm.bannerText;

            $ionicModal.fromTemplateUrl(MODAL_TEMPLATE, {
                scope: modalScope,
                animation: "slide-in-up",
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function(modalFromTemplate) {
                modal = modalFromTemplate;
            });
        }

        function onOnline() {
            $scope.$apply(function () {
                vm.isOnline = true;
                if (_.isObject(modal)) {
                    modal.hide();
                }
            });
        }

        function onOffline() {
            $scope.$apply(function () {
                vm.isOnline = false;
                if (_.isObject(modal)) {
                    modal.show();
                }
            });
        }
    }

    angular.module("app.shared.network")
        .controller("NetworkStatusController", NetworkStatusController);
}());
