(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function AccountManager($q, $rootScope, CommonService, Logger, AccountModel, AccountsResource) {
        // Private members
        var account;

        // Revealed Public members
        var service = {
            fetchAccount: fetchAccount,
            getAccount  : getAccount,
            setAccount  : setAccount
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            $rootScope.$on("app:logout", clearCachedValues);

            clearCachedValues();
        }

        function clearCachedValues() {
            account = null;
        }

        function fetchAccount(accountId) {
            //if the account is already cached, just return it
            if(account && account.accountId === accountId) {
                return $q.when(account);
            }

            return AccountsResource.getAccount(accountId)
                .then(function (accountResponse) {
                    if (accountResponse && accountResponse.data) {

                        //override the previously cached account
                        account = new AccountModel();
                        account.set(accountResponse.data);

                        return account;
                    }
                    // no data in the response
                    else {
                        var error = "No data in Response from getting the account";
                        Logger.error(error);
                        throw new Error(error);
                    }
                })
                // get token failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting Account failed: " + CommonService.getErrorMessage(failureResponse);
                    Logger.error(error);
                    throw new Error(error);
                });

        }

        function getAccount() {
            return account;
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setAccount(accountInfo) {
            account = accountInfo;
        }
    }

    angular
        .module("app.components.account")
        .factory("AccountManager", AccountManager);
})();