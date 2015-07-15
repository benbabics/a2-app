(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function LandingController($scope, globals, currentInvoiceSummary) {

        var vm = this;
        vm.invoiceSummary = globals.LANDING.CONFIG;
        vm.invoiceSummary = {};

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            vm.invoiceSummary = currentInvoiceSummary; // the invoiceSummary object should be bound now to the object returned by retrieveCurrentInvoiceSummary
        }
    }

    angular.module("app.components.landing")
        .controller("LandingController", LandingController);
})();