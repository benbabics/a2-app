(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardReissueShippingMethodInputController($scope, $ionicHistory, globals, cardReissue) {

        var vm = this;

        vm.config = globals.CARD_REISSUE_INPUTS.SHIPPING_METHOD.CONFIG;
        vm.cardReissue = cardReissue;

        vm.confirmSelection = confirmSelection;

        activate();

        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
        }

        function confirmSelection(shippingMethod) {
            vm.cardReissue.selectedShippingMethod = shippingMethod;

            $ionicHistory.goBack();
        }
    }

    angular.module("app.components.card")
        .controller("CardReissueShippingMethodInputController", CardReissueShippingMethodInputController);
})();