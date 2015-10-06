(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardReissueConfirmationController($scope, globals, cardReissueDetails, CardReissueManager) {

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
            CardReissueManager.clearCardReissueDetails();
        }
    }

    angular.module("app.components.card")
        .controller("CardReissueConfirmationController", CardReissueConfirmationController);

})();