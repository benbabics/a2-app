(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function FormEncoder(CommonService) {
        // Private members
        _ = CommonService._;

        // Revealed Public members
        var service = {
            encode: encode
        };

        return service;
        //////////////////////

        function encode(data) {
            var pairs = [];
            _.forEach(data, function (value, key) {
                pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
            });
            return pairs.join("&").replace(/%20/g, "+");
        }
    }

    angular
        .module("app.shared.network")
        .factory("FormEncoder", FormEncoder);
})();