(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:5

    /* @ngInject */
    function CardReissueConfirmationController($cordovaGoogleAnalytics, $scope, globals, cardReissueDetails, CommonService) {

        var vm = this;

        vm.reissuedCard = cardReissueDetails.reissuedCard;
        vm.config = globals.CARD_REISSUE_CONFIRMATION.CONFIG;

        activate();

        //////////////////////

        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.trackView(vm.config.ANALYTICS.pageName);
            });
        }
    }

    angular.module("app.components.card")
        .controller("CardReissueConfirmationController", CardReissueConfirmationController);

})();