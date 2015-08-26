(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function BankManager($q, $rootScope, BankModel, BanksResource, CommonService, Logger) {

        // Private members
        var _ = CommonService._,
            activeBanks = {};

        // Revealed Public members
        var service = {
                fetchActiveBanks     : fetchActiveBanks,
                getActiveBanks       : getActiveBanks,
                getOrFetchActiveBanks: getOrFetchActiveBanks,
                getDefaultBank       : getDefaultBank,
                hasMultipleBanks     : hasMultipleBanks,
                setActiveBanks       : setActiveBanks
            };

        activate();

        return service;
        //////////////////////

        function activate() {
            $rootScope.$on("userLoggedOut", clearCachedValues);

            clearCachedValues();
        }

        function clearCachedValues() {
            activeBanks = {};
        }

        function fetchActiveBanks(accountId) {

            return BanksResource.getActiveBanks(accountId)
                .then(function (activeBanksResponse) {
                    if (activeBanksResponse && activeBanksResponse.data) {
                        var bankModelCollection = {};

                        _.forEach(activeBanksResponse.data, function (bank) {
                            var bankModel = new BankModel();
                            bankModel.set(bank);
                            bankModelCollection[bank.id] = bankModel;
                        });

                        setActiveBanks(bankModelCollection);
                        return bankModelCollection;
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

        function getOrFetchActiveBanks(accountId) {
            if (_.isEmpty(activeBanks)) {
                return fetchActiveBanks(accountId);
            }

            return $q.when(activeBanks);
        }

        function getDefaultBank(accountId) {
            return getOrFetchActiveBanks(accountId)
                .then(function(bankModelCollection) {
                    var defaultBank;

                    if (_.isEmpty(bankModelCollection)) {
                        return null;
                    }

                    defaultBank = _.find(bankModelCollection, "defaultBank", true);

                    if (_.isObject(defaultBank)) {
                        return defaultBank;
                    }

                    return _.first(_.sortBy(bankModelCollection, "name"));
                });
        }

        function hasMultipleBanks(accountId) {
            return getOrFetchActiveBanks(accountId)
                    .then(function(activeBanks) {
                        return _.size(activeBanks) > 1;
                    });
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