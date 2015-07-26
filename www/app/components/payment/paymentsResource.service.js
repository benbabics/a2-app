(function () {
    "use strict";

    /* @ngInject */
    function PaymentsResource(AccountMaintenanceRestangular, globals) {
        return AccountMaintenanceRestangular.service(globals.ACCOUNT_MAINTENANCE_API.ACCOUNTS.BASE);
    }

    function addCustomMethods(RestangularProvider, sharedGlobals) {
        RestangularProvider.addElementTransformer(sharedGlobals.ACCOUNT_MAINTENANCE_API.ACCOUNTS.BASE, false, function(account) {
            // This will add a method called makePaymentAvailability that will do a GET  to the path payments/makePaymentAvailability
            account.addRestangularMethod("makePaymentAvailability", "get", sharedGlobals.ACCOUNT_MAINTENANCE_API.PAYMENTS.MAKE_PAYMENT_AVAILABILITY);

            return account;
        });
    }

    angular
        .module("app.components.payment")
        .config(addCustomMethods)
        .factory("PaymentsResource", PaymentsResource);
})();