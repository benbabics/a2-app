(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexFeatureFlag(_, globals) {
        var directive = {
            restrict: "A",
            link    : link
        };

        return directive;
        ////////////////////
        //Public functions:

        function link(scope, elem, attrs) {
            var feature = (attrs.wexFeatureFlag || "").toUpperCase();

            if (!isFeatureEnabled(feature)) {
                elem.remove();
            }
        }
        ////////////////////
        //Private functions:

        function isFeatureEnabled(feature) {
            return (!feature || _.get(globals.FEATURE_FLAGS, feature));
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexFeatureFlag", wexFeatureFlag);
})();
