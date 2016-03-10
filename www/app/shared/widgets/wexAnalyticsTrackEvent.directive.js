(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* Directive that tracks a given event on Google Analytics when the parent element is clicked.
     * The directive expects an array with at least two elements. The directive uses the first four elements for the following:
     * 0: category
     * 1: action
     * 2: label [optional]
     * 3: value [optional]
     *
     * Any additional elements will be ignored.
     *
     * Example usage:
     *
     * <a ui-sref="login" wex-analytics-track-event="['Menu', 'LogoutButton']"></a>
     */

    /* @ngInject */
    function wexAnalyticsTrackEvent(_, AnalyticsUtil) {
        var directive = {
                restrict: "A",
                link    : link
            };

        return directive;
        //////////////////////

        function link(scope, elem, attrs) {
            var eventArgs = attrs.wexAnalyticsTrackEvent ? scope.$eval(attrs.wexAnalyticsTrackEvent) : null;

            if (_.isArray(eventArgs) && _.size(eventArgs) >= 2) {
                elem.on("click", _.partial(_.spread(AnalyticsUtil.trackEvent), eventArgs));
            }
            else {
                throw new Error("Malformed analytics tracking event arguments: " + eventArgs);
            }
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexAnalyticsTrackEvent", wexAnalyticsTrackEvent);
})();
