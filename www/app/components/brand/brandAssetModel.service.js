(function () {
    "use strict";

    var BrandAssetModel = function (globals, moment, HateoasResource) {

        function BrandAssetModel() {
            HateoasResource.call(this);

            this.assetSubtypeId = "";
            this.assetTypeId = "";
            this.assetValue = "";
            this.brandAssetId ="";
            this.clientBrandId = "";
            this.clientBrandName = "";
            this.endDate = "";
            this.startDate = "";
        }

        BrandAssetModel.prototype = Object.create(HateoasResource.prototype);

        BrandAssetModel.prototype.set = function (brandAssetResource) {
            angular.extend(this, brandAssetResource);

            // Convert the date strings to Dates
            this.endDate = moment(brandAssetResource.endDate).toDate();
            this.startDate = moment(brandAssetResource.startDate).toDate();
        };

        BrandAssetModel.prototype.hasResource = function () {
            return this.assetTypeId === globals.BRAND.ASSET_TYPES.FILE;
        };

        BrandAssetModel.prototype.isExpired = function () {
            return this.endDate ? moment().isAfter(this.endDate) : false;
        };

        return BrandAssetModel;
    };

    angular
        .module("app.components.brand")
        .factory("BrandAssetModel", BrandAssetModel);
})();
