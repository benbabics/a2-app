(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function CardReissueReasonInputController($cordovaGoogleAnalytics, $scope, $ionicHistory,
                                              globals, cardReissueDetails, CommonService) {

        var vm = this;

        vm.config = angular.extend({}, globals.CARD_REISSUE_INPUTS.REISSUE_REASON.CONFIG, globals.CARD);
        vm.cardReissueDetails = cardReissueDetails;

        vm.confirmSelection = confirmSelection;

        activate();

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

        function confirmSelection(reissueReason) {
            vm.cardReissueDetails.reissueReason = reissueReason;

            $ionicHistory.goBack();
        }
    }

    angular.module("app.components.card")
        .controller("CardReissueReasonInputController", CardReissueReasonInputController);
})();