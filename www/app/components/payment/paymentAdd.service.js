(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function PaymentAdd($q, $rootScope, BankManager, CommonService, InvoiceManager, PaymentAddModel, UserManager) {
        // Private members
        var _ = CommonService._,
            paymentAdd = {};

        // Revealed Public members
        var service = {
            getPaymentAdd        : getPaymentAdd,
            getOrCreatePaymentAdd: getOrCreatePaymentAdd,
            setPaymentAdd        : setPaymentAdd
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            $rootScope.$on("userLoggedOut", clearCachedValues);
        }

        function clearCachedValues() {
            setPaymentAdd({});
        }

        function getPaymentAdd() {
            return paymentAdd;
        }

        function getOrCreatePaymentAdd() {
            if (_.isEmpty(paymentAdd)) {
                return initializePaymentAddDetails();
            }

            return $q(function(resolve, reject) {
                resolve(paymentAdd);
            });
        }

        function initializePaymentAddDetails() {
            return BankManager.getDefaultBank(UserManager.getUser().billingCompany.accountId)
                .then(function(defaultBank) {
                    var paymentAdd = new PaymentAddModel();

                    paymentAdd.amount = InvoiceManager.getInvoiceSummary().minimumPaymentDue;
                    paymentAdd.paymentDate = new Date();
                    if (_.isObject(defaultBank)) {
                        paymentAdd.bankAccount = defaultBank.name;
                    }

                    setPaymentAdd(paymentAdd);
                    return getPaymentAdd();
                });
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setPaymentAdd(paymentAddInfo) {
            paymentAdd = paymentAddInfo;
        }

    }

    angular
        .module("app.components.payment")
        .factory("PaymentAdd", PaymentAdd);
})();