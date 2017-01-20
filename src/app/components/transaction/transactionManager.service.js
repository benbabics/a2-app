(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:7

    /* @ngInject */
    function TransactionManager(_, $q, Logger, LoggerUtil, PostedTransactionModel, TransactionsResource, WexCache) {
        // Private members
        var CACHE_KEY_PENDING = "transactions.pending",
            CACHE_KEY_POSTED = "transactions.posted";

        // Revealed Public members
        var service = {
                clearCachedValues           : clearCachedValues,
                fetchPendingTransaction     : fetchPendingTransaction,
                fetchPendingTransactions    : fetchPendingTransactions,
                fetchPostedTransaction      : fetchPostedTransaction,
                fetchPostedTransactions     : fetchPostedTransactions,
                getCachedPendingTransactions: getCachedPendingTransactions,
                getCachedPostedTransactions : getCachedPostedTransactions
            };

        activate();

        return service;
        //////////////////////

        function activate() {
            clearCachedValues();
        }

        function clearCachedValues() {
            WexCache.clearPropertyValue(CACHE_KEY_PENDING);
            WexCache.clearPropertyValue(CACHE_KEY_POSTED);
        }

        function createTransaction(transactionResource) {
            var transactionModel = new PostedTransactionModel();
            transactionModel.set(transactionResource);

            return transactionModel;
        }

        function fetchPendingTransaction(authorizationId) {
            return $q.when(_.find(getCachedPendingTransactions(), {authorizationId: authorizationId}));
        }

        function fetchPostedTransaction(transactionId) {
            return $q.when(_.find(getCachedPostedTransactions(), {transactionId: transactionId}));
        }

        // jshint maxparams:8
        function fetchPostedTransactions(accountId, fromDate, toDate, pageNumber, pageSize, filterBy, filterValue, cardId) {
            var params = {
                fromDate  : fromDate,
                toDate    : toDate,
                pageNumber: pageNumber,
                pageSize  : pageSize
            };

            if ( !_.isUndefined(filterBy) && !_.isUndefined(filterValue) ) {
              params.filterBy    = filterBy;
              params.filterValue = filterValue;
            }

            if (!_.isUndefined(cardId)) {
                params.cardId = cardId;
            }

            return TransactionsResource.getPostedTransactions(accountId, params)
                .then(function (postedTransactionsResponse) {
                    if (postedTransactionsResponse && postedTransactionsResponse.data) {
                        //map the posted transaction data to model objects
                        var fetchedTransactions = _.map(postedTransactionsResponse.data, createTransaction);

                        updateCachedPostedTransactions(fetchedTransactions);

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

        function fetchPendingTransactions(accountId, fromDate, toDate, pageNumber, pageSize, filterBy, filterValue, cardId) {
            var params = {
                fromDate:   fromDate,
                toDate:     toDate,
                pageSize:   pageSize,
                pageNumber: pageNumber
            };

            if ( !_.isUndefined(filterBy) && !_.isUndefined(filterValue) ) {
              params.filterBy    = filterBy;
              params.filterValue = filterValue;
            }

            if (!_.isUndefined(cardId)) {
                params.cardId = cardId;
            }

            return TransactionsResource.getPendingTransactions(accountId, params)
                .then(function (pendingTransactionsResponse) {
                    if (pendingTransactionsResponse && pendingTransactionsResponse.data) {
                        //map the pending transaction data to model objects
                        var fetchedTransactions = _.map(pendingTransactionsResponse.data, createTransaction);

                        updateCachedPendingTransactions(fetchedTransactions);

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

        function getCachedPostedTransactions() {
            return WexCache.readPropertyValue(CACHE_KEY_POSTED) || [];
        }

        function getCachedPendingTransactions() {
            return WexCache.readPropertyValue(CACHE_KEY_PENDING) || [];
        }

        function updateCachedPendingTransactions(transactions) {
            WexCache.mergePropertyValue(CACHE_KEY_PENDING, transactions, {mergeBy: "authorizationId"});
        }

        function updateCachedPostedTransactions(transactions) {
            WexCache.mergePropertyValue(CACHE_KEY_POSTED, transactions, {mergeBy: "transactionId"});
        }
    }

    angular
        .module("app.components.transaction")
        .factory("TransactionManager", TransactionManager);
})();
