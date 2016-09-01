(function () {
    "use strict";

    /* @ngInject */
    function TransactionFilterByController($stateParams, filterDetails, globals) {

        var vm = this;

        vm.config = globals.TRANSACTION_LIST.CONFIG;
        vm.filterDetails = filterDetails;
        vm.params = $stateParams;
    }

    angular.module("app.components.transaction")
        .controller("TransactionFilterByController", TransactionFilterByController);
})();
