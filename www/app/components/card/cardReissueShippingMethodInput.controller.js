(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardReissueShippingMethodInputController($ionicHistory, globals, cardReissueDetails) {

        var vm = this;

        vm.config = globals.CARD_REISSUE_INPUTS.SHIPPING_METHOD.CONFIG;
        vm.cardReissueDetails = cardReissueDetails;

        vm.confirmSelection = confirmSelection;

        activate();

        // Controller initialization
        function activate() {
        }

        function confirmSelection(shippingMethod) {
            vm.cardReissueDetails.selectedShippingMethod = shippingMethod;

            $ionicHistory.goBack();
        }
    }

    angular.module("app.components.card")
        .controller("CardReissueShippingMethodInputController", CardReissueShippingMethodInputController);
})();