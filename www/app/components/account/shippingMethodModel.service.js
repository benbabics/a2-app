(function () {
    "use strict";

    var ShippingMethodModel = function () {

        function ShippingMethodModel() {
            this.id = "";
            this.name = "";
            this.cost = "";
            this.poBoxAllowed = "";
            this.isDefault = "";
        }

        ShippingMethodModel.prototype.set = function (shippingMethodResource) {
            angular.extend(this, shippingMethodResource);
        };

        return ShippingMethodModel;
    };

    angular
        .module("app.components.account")
        .factory("ShippingMethodModel", ShippingMethodModel);
})();