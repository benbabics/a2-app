(function () {
    "use strict";

    var HateoasResource = function (CommonService, SecureApiRestangular) {
        var _ = CommonService._;

        function HateoasResource(resource) {
            if (resource) {
                angular.extend(this, resource);
            }
        }

        HateoasResource.prototype.fetchResource = function (resourceType) {
            resourceType = resourceType || "self";
            resourceType = resourceType.toLowerCase();

            var resourceLink = _.find(this.links, {rel: resourceType});

            if (resourceLink) {
                return SecureApiRestangular.oneUrl("hateoas", resourceLink.href).get()
                    .then(function (response) {
                        return response.data;
                    })
                    .catch(function (error) {
                        throw new Error("Failed to fetch HATEOAS resource from " + resourceLink.href + " - " + error.message);
                    });
            }
            else {
                throw new Error("HATEOAS resource type not found: " + resourceType);
            }
        };

        return HateoasResource;
    };

    angular
        .module("app.shared.network")
        .factory("HateoasResource", HateoasResource);
})();
