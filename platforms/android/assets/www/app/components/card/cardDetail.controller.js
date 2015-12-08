(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardDetailController($scope, globals, card) {

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
        }

    }

    angular.module("app.components.card")
        .controller("CardDetailController", CardDetailController);
})();