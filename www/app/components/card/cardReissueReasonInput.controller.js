(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardReissueReasonInputController($scope, $ionicHistory, globals, cardReissue) {

        var vm = this;

        vm.config = angular.extend({}, globals.CARD_REISSUE_INPUTS.REISSUE_REASON.CONFIG, globals.CARD);
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

        function confirmSelection(reissueReason) {
            vm.cardReissue.reissueReason = reissueReason;

            $ionicHistory.goBack();
        }
    }

    angular.module("app.components.card")
        .controller("CardReissueReasonInputController", CardReissueReasonInputController);
})();