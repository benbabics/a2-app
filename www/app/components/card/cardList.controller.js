(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardListController($scope, globals, CommonService) {

        var _ = CommonService._,
            vm = this;

        vm.config = globals.CARD_LIST.CONFIG;
        vm.cards = [];
        vm.searchOptions = globals.CARD_LIST.SEARCH_OPTIONS;

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
        .controller("CardListController", CardListController);
})();