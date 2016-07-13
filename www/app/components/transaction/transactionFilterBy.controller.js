(function () {
    "use strict";

    /* @ngInject */
    function TransactionFilterByController($scope, $stateParams, globals) {

        var vm = this;

        vm.config = globals.TRANSACTION_LIST.CONFIG;
        vm.params = $stateParams;
    }

    angular.module("app.components.transaction")
        .controller("TransactionFilterByController", TransactionFilterByController);
})();
