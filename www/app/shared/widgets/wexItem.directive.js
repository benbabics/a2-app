(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    function wexItem(_, $interval) {
        var ACTIVATED_DURATION = 150, //ms
            TAP_DELAY = 40; //ms

        var directive = {
            restrict: "ACE",
            link: link
        };

        return directive;
        //////////////////////
        //Public functions:

        function link(scope, elem) {
            //override the touch events for each anchor element
            angular.forEach(elem.find("a"), function (anchorElement) {
                applyAnchorElementFix(angular.element(anchorElement));
            });
        }
        //////////////////////
        //Private functions:

        //Workaround for Ionic ion-item anchor issue described in https://github.com/driftyco/ionic/issues/814
        function applyAnchorElementFix(element) {
            var interval,
                touchCoords;

            element.on("click", function (event) {
                //disable clicking of the anchor until the activated state has been toggled
                if (interval) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });

            element.on("touchstart mousedown", function () {
                if (!interval) {
                    //start the interval for the activated state
                    interval = $interval(function () {
                        element.addClass("wex-item-activated");

                        //start the interval for removing the activated state
                        $interval(function () {
                            element.removeClass("wex-item-activated");

                            //trigger the click handler after the activated state has been toggled
                            element.triggerHandler("click");
                        }, ACTIVATED_DURATION, 1);

                        interval = null;
                    }, TAP_DELAY, 1);

                    //clear the last saved touch coords
                    touchCoords = null;
                }
            });

            element.on("touchmove", function (event) {
                var curTouchCoords = getTouchCoords(event),
                    lastTouchCoords = touchCoords || curTouchCoords;

                //if the user's finger has moved since the start of the touch event, cancel the activated interval
                if (interval && !_.isEmpty(_.difference(curTouchCoords, lastTouchCoords))) {
                    $interval.cancel(interval);
                    interval = null;
                }

                //update the saved touch coords
                touchCoords = curTouchCoords;
            });
        }

        function getTouchCoords(event) {
            return _(event.touches)
                .map(_.partial(_.pick, _, ["clientX", "clientY"]))
                .map(_.partial(_.values, _))
                .flatten()
                .value();
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexItem", wexItem);
})();
