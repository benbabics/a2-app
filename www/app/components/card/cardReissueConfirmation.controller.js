(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardReissueConfirmationController($scope, globals, cardReissue, CardReissueManager) {

        var vm = this;

        vm.card = cardReissue.card;
        vm.config = globals.CARD_REISSUE_CONFIRMATION.CONFIG;

        activate();

        //////////////////////

        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            CardReissueManager.clearCardReissue();
        }
    }

    angular.module("app.components.card")
        .controller("CardReissueConfirmationController", CardReissueConfirmationController);

})();