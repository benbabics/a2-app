(function () {
    "use strict";

    var BrandAssetModel = function (HateoasResource) {

        function BrandAssetModel() {
            HateoasResource.call(this);

            this.assetSubtypeId = "";
            this.assetTypeId = "";
            this.assetValue = "";
            this.clientBrandId = "";
            this.clientBrandName = "";
            this.endDate = "";
            this.startDate = "";
        }

        BrandAssetModel.prototype = Object.create(HateoasResource.prototype);

        BrandAssetModel.prototype.set = function (brandAssetResource) {
            angular.extend(this, brandAssetResource);
        };

        BrandAssetModel.prototype.hasResource = function () {
            return !!this.getResourceLink();
        };

        return BrandAssetModel;
    };

    angular
        .module("app.components.brand")
        .factory("BrandAssetModel", BrandAssetModel);
})();
