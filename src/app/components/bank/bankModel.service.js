(function () {
    "use strict";

    var BankModel = function () {

        function BankModel() {
            this.id = "";
            this.defaultBank = "";
            this.lastFourDigits = "";
            this.name = "";
        }

        BankModel.prototype.set = function (bankResource) {
            angular.extend(this, bankResource);
        };

        BankModel.prototype.getDisplayName = function () {
            if (this.name) {
                return this.name + " " + this.lastFourDigits;
            }

            return this.lastFourDigits;
        };

        return BankModel;
    };

    angular
        .module("app.components.bank")
        .factory("BankModel", BankModel);
})();
