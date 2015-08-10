(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function Payment($q, $rootScope, BankManager, CommonService, InvoiceManager, PaymentModel, UserManager) {
        // Private members
        var _ = CommonService._,
            payment = {};

        // Revealed Public members
        var service = {
            getPayment           : getPayment,
            getOrCreatePaymentAdd: getOrCreatePaymentAdd,
            setPayment           : setPayment
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            $rootScope.$on("userLoggedOut", clearCachedValues);
        }

        function clearCachedValues() {
            setPayment({});
        }

        function getPayment() {
            return payment;
        }

        function getOrCreatePaymentAdd() {
            if (_.isEmpty(payment)) {
                return initializePaymentAddDetails();
            }

            return $q(function(resolve, reject) {
                resolve(payment);
            });
        }

        function initializePaymentAddDetails() {
            return BankManager.getDefaultBank(UserManager.getUser().billingCompany.accountId)
                .then(function(defaultBank) {
                    var paymentAdd = new PaymentModel();

                    paymentAdd.amount = InvoiceManager.getInvoiceSummary().minimumPaymentDue;
                    paymentAdd.scheduledDate = new Date();
                    if (_.isObject(defaultBank)) {
                        paymentAdd.bankAccount = defaultBank.name;
                    }

                    setPayment(paymentAdd);
                    return getPayment();
                });
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setPayment(paymentInfo) {
            payment = paymentInfo;
        }

    }

    angular
        .module("app.components.payment")
        .factory("Payment", Payment);
})();