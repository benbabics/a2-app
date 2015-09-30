(function () {
    "use strict";

    var ShippingCarrierModel = function (CommonService, ShippingMethodModel) {
        var _ = CommonService._;

        function ShippingCarrierModel() {
            this.id = "";
            this.name = "";
            this.default = "";
            this.wexDefault = "";
            this.shippingMethods = "";
        }

        ShippingCarrierModel.prototype.set = function (shippingCarrierResource) {
            var self = this;

            angular.extend(this, shippingCarrierResource);

            self.shippingMethods = [];
            _.forEach(shippingCarrierResource.shippingMethods, function(shippingMethodResource) {
                var shippingMethod = new ShippingMethodModel();
                shippingMethod.set(shippingMethodResource);

                self.shippingMethods.push(shippingMethod);
            });
        };

        ShippingCarrierModel.prototype.getDefaultShippingMethod = function () {
            return _.find(this.shippingMethods, {default: true});
        };

        ShippingCarrierModel.prototype.getDisplayName = function () {
            return this.name;
        };

        return ShippingCarrierModel;
    };

    angular
        .module("app.components.account")
        .factory("ShippingCarrierModel", ShippingCarrierModel);
})();