(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:5

    /* @ngInject */
    function CardDetailController($cordovaGoogleAnalytics, $scope, globals, card, CommonService) {

        var vm = this;

        vm.config = globals.CARD_DETAIL.CONFIG;

        vm.card = {};

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            vm.card = card;

            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.trackView(vm.config.ANALYTICS.pageName);
            });
        }

    }

    angular.module("app.components.card")
        .controller("CardDetailController", CardDetailController);
})();