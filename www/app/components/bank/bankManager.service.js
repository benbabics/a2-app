(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function BankManager($q, BanksResource, CommonService, Logger) {
        // Private members
        var activeBanks = {};

        // Revealed Public members
        var service = {
                fetchActiveBanks: fetchActiveBanks,
                getActiveBanks  : getActiveBanks,
                setActiveBanks  : setActiveBanks
            };

        return service;
        //////////////////////

        function fetchActiveBanks(billingAccountId) {
            return $q.when(BanksResource.one(billingAccountId).activeBanks())
                .then(function (activeBanksResponse) {
                    if (activeBanksResponse && activeBanksResponse.data) {
                        setActiveBanks(activeBanksResponse.data);
                        return getActiveBanks();
                    }
                    // no data in the response
                    else {
                        Logger.error("No data in Response from getting the Active Banks");
                        throw new Error("No data in Response from getting the Active Banks");
                    }
                })
                // get token failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting Active Banks failed: " + CommonService.getErrorMessage(failureResponse);

                    Logger.error(error);
                    throw new Error(error);
                });

        }

        function getActiveBanks() {
            return activeBanks;
        }

        function setActiveBanks(activeBanksInfo) {
            activeBanks = activeBanksInfo;
        }

    }

    angular
        .module("app.components.bank")
        .factory("BankManager", BankManager);
})();