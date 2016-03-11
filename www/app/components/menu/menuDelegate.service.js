(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function MenuDelegate(_, ElementUtil) {
        var DELEGATE_FUNCTIONS = [
            "closeMenu",
            "goToHome",
            "goToMakePayment",
            "goToPaymentActivity",
            "goToTransactionActivity",
            "goToCards",
            "goToContactUs",
            "goToTermsOfUse",
            "goToPrivacyPolicy",
            "goToLogOut"
        ];

        return createDelegate();
        //////////////////////

        function createDelegate() {
            var controller = getController();

            if (!controller) {
                throw new Error("Side menu controller not found.");
            }

            return _.zipObject(DELEGATE_FUNCTIONS, _.map(DELEGATE_FUNCTIONS, function (delegateFunction) {
                return controller[delegateFunction];
            }));
        }

        function getController() {
            var sideMenu = ElementUtil.getSideMenu("right");

            if (!sideMenu) {
                throw new Error("Side menu element not found.");
            }

            return sideMenu.controller();
        }
    }

    angular
        .module("app.shared.util")
        .factory("MenuDelegate", MenuDelegate);
})();
