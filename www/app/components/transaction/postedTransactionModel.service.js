(function () {
    "use strict";

    var PostedTransactionModel = function () {

        function PostedTransactionModel() {
            this.transactionId = "";
            this.transactionDate = "";
            this.postDate = "";
            this.accountName = "";
            this.embossedAccountNumber = "";
            this.embossedCardNumber = "";
            this.driverFirstName = "";
            this.driverMiddleName = "";
            this.driverLastName = "";
            this.customVehicleId = "";
            this.merchantBrand = "";
            this.merchantName = "";
            this.merchantAddress = "";
            this.merchantCity = "";
            this.merchantState = "";
            this.merchantZipCode = "";
            this.productDescription = "";
            this.grossCost = "";
            this.netCost = "";
        }

        PostedTransactionModel.prototype.set = function (postedTransactionResource) {
            angular.extend(this, postedTransactionResource);
        };

        return PostedTransactionModel;
    };

    angular
        .module("app.components.transaction")
        .factory("PostedTransactionModel", PostedTransactionModel);
})();
