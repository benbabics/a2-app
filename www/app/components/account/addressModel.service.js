(function () {
    "use strict";

    var AddressModel = function (AddressUtil) {

        function AddressModel() {
            this.firstName = "";
            this.lastName = "";
            this.companyName = "";
            this.addressLine1 = "";
            this.addressLine2 = "";
            this.city = "";
            this.state = "";
            this.postalCode = "";
            this.countryCode = "";
            this.residence = "";
        }

        AddressModel.prototype.set = function (addressResource) {
            angular.extend(this, addressResource);
        };

        AddressModel.prototype.isPoBox = function () {
            return AddressUtil.isPoBox(this.addressLine1) || AddressUtil.isPoBox(this.addressLine2);
        };

        return AddressModel;
    };

    angular
        .module("app.components.account")
        .factory("AddressModel", AddressModel);
})();
