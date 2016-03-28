(function () {
    "use strict";

    var VersionStatusModel = function () {

        function VersionStatusModel() {
            this.status = "";
        }

        VersionStatusModel.prototype.set = function (versionStatusResource) {
            angular.extend(this, versionStatusResource);
        };

        return VersionStatusModel;
    };

    angular
        .module("app.components.version")
        .factory("VersionStatusModel", VersionStatusModel);
})();
