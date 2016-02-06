(function () {
    "use strict";

    var BrandAssetModel = function () {

        function BrandAssetModel() {
            this.assetSubtypeId = "";
            this.assetTypeId = "";
            this.assetValue = "";
            this.clientBrandId = "";
            this.clientBrandName = "";
            this.endDate = "";
            this.startDate = "";
        }

        BrandAssetModel.prototype.set = function (brandAssetResource) {
            angular.extend(this, brandAssetResource);
        };

        return BrandAssetModel;
    };

    angular
        .module("app.components.brand")
        .factory("BrandAssetModel", BrandAssetModel);
})();
