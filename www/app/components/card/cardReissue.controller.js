(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardReissueController($scope, globals, cardReissue, CommonService) {

        var _ = CommonService._,
            vm = this;

        vm.config = globals.CARD_REISSUE.CONFIG;
        vm.cardReissue = cardReissue;

        vm.isFormComplete = isFormComplete;

        activate();

        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
        }

        function isFormComplete() {
            return !_.isEmpty(vm.cardReissue.shippingAddress) &&
                !_.isEmpty(vm.cardReissue.selectedShippingMethod) &&
                vm.cardReissue.reissueReason;
        }
    }

    angular.module("app.components.card")
        .controller("CardReissueController", CardReissueController);
})();