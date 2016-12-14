(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    //Workaround for Ionic list anchor scrolling issue described here: https://github.com/driftyco/ionic/issues/814
    function wexClick(_, $interval, moment, ElementUtil) {
        var ACTIVATED_DURATION = 150, //ms
            TAP_DELAY = 120, //ms
            SCROLL_TIMEOUT = 80, //ms
            CSS_CLASS_ACTIVATED = "wex-click-activated";

        return {
            restrict: "A",
            link    : {pre: pre}
        };
        //////////////////////
        //Public functions:

        function pre(scope, element) {
            var interval,
                touchCoords,
                scrollArea = ElementUtil.getViewContent(),
                lastScrollTime = new Date(),
                scrollInterval,
                onScroll = function () {
                    if (!scrollInterval) {
                        scrollInterval = $interval(function () {
                            //update the last scroll time
                            lastScrollTime = new Date();
                            scrollInterval = null;
                        }, 10, 1);
                    }
                };

            if (scrollArea) {
                scrollArea.on("scroll", onScroll);

                scope.$on("$destroy", function () {
                    scrollArea.off("scroll", onScroll);
                });
            }

            element.on("click", function (event) {
                //disable clicking of the anchor until the activated state has been toggled
                if (interval) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                }
            });

            element.on("touchstart mousedown", function () {
                //make sure the user wasn't scrolling
                if (!interval && moment(lastScrollTime).isBefore(moment().subtract(SCROLL_TIMEOUT, "ms"))) {
                    //start the interval for the activated state
                    interval = $interval(function () {
                        element.addClass(CSS_CLASS_ACTIVATED);

                        //start the interval for removing the activated state
                        $interval(function () {
                            element.removeClass(CSS_CLASS_ACTIVATED);

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
        //////////////////////
        //Private functions:

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
        .directive("wexClick", wexClick);
})();
