(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function LandingController($scope, CommonService, currentInvoiceSummary, globals, UserManager) {

        var vm = this;
        vm.config = globals.LANDING.CONFIG;
        vm.invoiceSummary = {};
        vm.billingCompany = {};
        vm.popupTest = popupTest;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);

            vm.billingCompany = UserManager.getUser().billingCompany;
        }

        function beforeEnter() {
            vm.invoiceSummary = currentInvoiceSummary; // the invoiceSummary object should be bound now to the object returned by retrieveCurrentInvoiceSummary
        }

        //TODO - Remove this
        function popupTest() {
            CommonService.displayAlert({
               cssClass: "wex-warning-popup",
                content: "Online payment is not currently available for this account. The account has set up an alternative method of payment, such as direct debit.",
                buttonText: "OK",
                buttonCssClass: "button-submit"
            });

        }
    }

    angular.module("app.components.landing")
        .controller("LandingController", LandingController);
})();