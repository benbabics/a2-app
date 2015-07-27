(function () {
    "use strict";

    var BankModel = function () {

        function BankModel() {
            this.id = "";
            this.defaultBank = "";
            this.name = "";
        }

        BankModel.prototype.set = function (bankResource) {
            angular.extend(this, bankResource);
        };

        return BankModel;
    };

    angular
        .module("app.components.bank")
        .factory("BankModel", BankModel);
})();