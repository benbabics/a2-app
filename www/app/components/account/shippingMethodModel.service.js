(function () {
    "use strict";

    var ShippingMethodModel = function (_, $filter) {

        function ShippingMethodModel() {
            this.id = "";
            this.name = "";
            this.cost = "";
            this.poBoxAllowed = "";
            this.default = "";
        }

        ShippingMethodModel.prototype.set = function (shippingMethodResource) {
            angular.extend(this, shippingMethodResource);
        };

        ShippingMethodModel.prototype.getDisplayName = function(showCost) {
            var displayName = this.name;
            showCost = _.isUndefined(showCost) ? true : showCost;

            if (showCost) {
                displayName += " " + $filter("currency")(this.cost);
            }

            return displayName;
        };

        return ShippingMethodModel;
    };

    angular
        .module("app.components.account")
        .factory("ShippingMethodModel", ShippingMethodModel);
})();
