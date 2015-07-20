(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function MakePaymentController(globals, UserManager) {

        var vm = this;
        vm.config = globals.MAKE_PAYMENT.CONFIG;
        vm.billingCompany = {};

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            vm.billingCompany = UserManager.getUser().billingCompany;
        }

    }

    angular.module("app.components.payment")
        .controller("MakePaymentController", MakePaymentController);
})();