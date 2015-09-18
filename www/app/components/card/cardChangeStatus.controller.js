(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardChangeStatusController($scope, globals, card) {

        var vm = this;

        vm.card = card;
        vm.config = globals.CARD_CHANGE_STATUS.CONFIG;

        activate();

        //////////////////////

        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
        }
    }

    angular.module("app.components.card")
        .controller("CardChangeStatusController", CardChangeStatusController);

})();