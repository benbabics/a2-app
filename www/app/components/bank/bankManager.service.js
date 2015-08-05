(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function BankManager(BankModel, BanksResource, CommonService, Logger) {

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
            return BanksResource.getActiveBanks(billingAccountId)
                .then(function (activeBanksResponse) {
                    if (activeBanksResponse && activeBanksResponse.data) {
                        var bankModelCollection = {};

                        _.forEach(activeBanksResponse.data, function (bank) {
                            var bankModel = new BankModel();
                            bankModel.set(bank);
                            bankModelCollection[bank.id] = bankModel;
                        });

                        setActiveBanks(bankModelCollection);
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

        // Caution against using this as it replaces the collection versus setting properties or extending
        // each of the models in the collections
        function setActiveBanks(activeBanksInfo) {
            activeBanks = activeBanksInfo;
        }

    }

    angular
        .module("app.components.bank")
        .factory("BankManager", BankManager);
})();