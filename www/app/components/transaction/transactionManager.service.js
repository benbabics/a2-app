(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function TransactionManager(_, $q, Logger, LoggerUtil, PostedTransactionModel, TransactionsResource) {
        // Private members
        var pendingTransactions,
            postedTransactions;

        // Revealed Public members
        var service = {
                clearCachedValues       : clearCachedValues,
                fetchPostedTransaction  : fetchPostedTransaction,
                fetchPostedTransactions : fetchPostedTransactions,
                fetchPendingTransactions: fetchPendingTransactions,
                getPostedTransactions   : getPostedTransactions,
                setPostedTransactions   : setPostedTransactions
            };

        activate();

        return service;
        //////////////////////

        function activate() {
            clearCachedValues();
        }

        function clearCachedValues() {
            pendingTransactions = [];
            postedTransactions = [];
        }

        function createTransaction(transactionResource) {
            var transactionModel = new PostedTransactionModel();
            transactionModel.set(transactionResource);

            return transactionModel;
        }

        function fetchPostedTransaction(transactionId) {
            return $q.when(_.find(postedTransactions, {transactionId: transactionId}));
        }

        // jshint maxparams:6
        function fetchPostedTransactions(accountId, fromDate, toDate, pageNumber, pageSize, cardId) {
            var params = {
                fromDate  : fromDate,
                toDate    : toDate,
                pageNumber: pageNumber,
                pageSize  : pageSize
            };

            if (!_.isUndefined(cardId)) {
                params.cardId = cardId;
            }

            return TransactionsResource.getPostedTransactions(accountId, params)
                .then(function (postedTransactionsResponse) {
                    if (postedTransactionsResponse && postedTransactionsResponse.data) {
                        //map the posted transaction data to model objects
                        var fetchedTransactions = _.map(postedTransactionsResponse.data, createTransaction);

                        //reset the cache if we're fetching the first page of results
                        if (pageNumber === 0) {
                            postedTransactions = [];
                        }

                        //only cache the fetched transactions that haven't been cached yet
                        postedTransactions = _.uniqBy(postedTransactions.concat(fetchedTransactions), "transactionId");

                        return fetchedTransactions;
                    }
                    // no data in the response
                    else {
                        var error = "No data in Response from getting the Posted Transactions";
                        Logger.error(error);
                        throw new Error(error);
                    }
                })
                // get posted transactions failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting Posted Transactions failed: " + LoggerUtil.getErrorMessage(failureResponse);
                    Logger.error(error);
                    throw new Error(error);
                });
        }

        // jshint maxparams:3
        function fetchPendingTransactions(accountId, cardId, filterValue) {
            var params = {};

            if (!_.isUndefined(cardId)) {
                params.cardId = cardId;
            }

            if (!_.isUndefined(filterValue)) {
                params.filterValue = filterValue;
            }

            return TransactionsResource.getPendingTransactions(accountId, params)
                .then(function (pendingTransactionsResponse) {
                    if (pendingTransactionsResponse && pendingTransactionsResponse.data) {
                        //map the pending transaction data to model objects
                        var fetchedTransactions = _.map(pendingTransactionsResponse.data, createTransaction);

                        //reset the cache
                        pendingTransactions = [];

                        return fetchedTransactions;
                    }
                    // no data in the response
                    else {
                        var error = "No data in Response from getting the Pending Transactions";
                        Logger.error(error);
                        throw new Error(error);
                    }
                })
                // get pending transactions failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting Pending Transactions failed: " + LoggerUtil.getErrorMessage(failureResponse);
                    Logger.error(error);
                    throw new Error(error);
                });
        }

        function getPostedTransactions() {
            return postedTransactions;
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setPostedTransactions(postedTransactionsInfo) {
            postedTransactions = postedTransactionsInfo;
        }
    }

    angular
        .module("app.components.transaction")
        .factory("TransactionManager", TransactionManager);
})();
