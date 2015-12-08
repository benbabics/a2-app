(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:5

    /* @ngInject */
    function InvoiceManager($rootScope, CommonService, InvoiceSummaryModel, InvoicesResource, Logger) {
        // Private members
        var invoiceSummary = {};

        // Revealed Public members
        var service = {
            fetchCurrentInvoiceSummary: fetchCurrentInvoiceSummary,
            getInvoiceSummary         : getInvoiceSummary,
            setInvoiceSummary         : setInvoiceSummary
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            $rootScope.$on("app:logout", clearCachedValues);

            clearCachedValues();
        }

        function clearCachedValues() {
            invoiceSummary = new InvoiceSummaryModel();
        }

        function fetchCurrentInvoiceSummary(billingAccountId) {
            return InvoicesResource.getCurrentInvoiceSummary(billingAccountId)
                .then(function (currentInvoiceSummaryResponse) {
                    if (currentInvoiceSummaryResponse && currentInvoiceSummaryResponse.data) {
                        getInvoiceSummary().set(currentInvoiceSummaryResponse.data);
                        return getInvoiceSummary();
                    }
                    // no data in the response
                    else {
                        Logger.error("No data in Response from getting the current invoice summary");
                        throw new Error("No data in Response from getting the current invoice summary");
                    }
                })
                // get token failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting Current Invoice Summary failed: " + CommonService.getErrorMessage(failureResponse);

                    Logger.error(error);
                    throw new Error(error);
                });
        }

        function getInvoiceSummary() {
            return invoiceSummary;
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setInvoiceSummary(invoiceSummaryInfo) {
            invoiceSummary = invoiceSummaryInfo;
        }

    }

    angular
        .module("app.components.invoice")
        .factory("InvoiceManager", InvoiceManager);
})();
