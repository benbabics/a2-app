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
            var resourceLink = this.getResourceLink(resourceType);

            if (resourceLink) {
                return SecureApiRestangular.oneUrl("hateoas", resourceLink).get()
                    .then(function (response) {
                        return response.data;
                    })
                    .catch(function (error) {
                        throw new Error("Failed to fetch HATEOAS resource from " + resourceLink + " - " + error.message);
                    });
            }
            else {
                throw new Error("HATEOAS resource link not found for type: " + resourceType);
            }
        };

        HateoasResource.prototype.getResourceLink = function (resourceType) {
            resourceType = (resourceType || "self").toLowerCase();

            var linkObject = _.find(this.links, {rel: resourceType});
            if (linkObject) {
                return linkObject.href;
            }
            else {
                return null;
            }
        };

        return HateoasResource;
    };

    angular
        .module("app.shared.network")
        .factory("HateoasResource", HateoasResource);
})();
