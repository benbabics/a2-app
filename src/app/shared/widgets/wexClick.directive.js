(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    //Workaround for Ionic list anchor scrolling issue described here: https://github.com/driftyco/ionic/issues/814
    function wexClick(_, $interval, $timeout, moment, ElementUtil) {
        var ACTIVATED_DURATION = 150, //ms
            TAP_DELAY = 120, //ms
            SCROLL_TIMEOUT = 200, //ms
            TOUCHMOVE_EPSILON = 1.0, //arbitrary value
            CSS_CLASS_ACTIVATED = "wex-click-activated";

        return {
            priority: 1,
            restrict: "A",
            link    : {pre: pre}
        };
        //////////////////////
        //Public functions:

        function pre(scope, element) {
            var interval,
                touchCoords,
                lastClickCoords,
                cancelNextClick = true,
                scrollArea = ElementUtil.getViewContent(),
                lastScrollTime = new Date(),
                scrollInterval,
                onScroll = function () {
                    if (!scrollInterval) {
                        scrollInterval = $interval(function () {
                            //update the last scroll time
                            lastScrollTime = new Date();
                            scrollInterval = null;
                        }, 50, 1);
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
                if (interval || cancelNextClick) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                }
            });

            element.on("touchstart mousedown", function (event) {
                //make sure the user wasn't scrolling and wasn't just clicking the exact same spot
                if (_.every([
                        !interval,
                        moment(lastScrollTime).isBefore(moment().subtract(SCROLL_TIMEOUT, "ms")),
                        !touchCoordsEqual(getTouchCoords(event), lastClickCoords)
                    ])) {
                    lastClickCoords = getTouchCoords(event);

                    //start the interval for the activated state
                    interval = $interval(function () {
                        element.addClass(CSS_CLASS_ACTIVATED);

                        //start the timer for removing the activated state
                        $timeout(function () {
                            interval = null;
                            element.removeClass(CSS_CLASS_ACTIVATED);

                            //trigger the click handler after the activated state has been toggled
                            //wrap in cancelNextClick so only our click event will be handled
                            cancelNextClick = false;
                            element.triggerHandler("click");
                            cancelNextClick = true;
                        }, ACTIVATED_DURATION);
                    }, TAP_DELAY, 1);

                    //clear the last saved touch coords
                    touchCoords = null;
                }
            });

            element.on("touchmove", function (event) {
                var curTouchCoords = getTouchCoords(event),
                    lastTouchCoords = touchCoords || curTouchCoords;

                //if the user's finger has moved since the start of the touch event, cancel the activated interval
                if (interval && !touchCoordsEqual(curTouchCoords, lastTouchCoords)) {
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

        //allows minor changes in coordinates to not count as movement
        function compareTouchCoords(touchA, touchB) {
            return Math.abs(touchA - touchB) < TOUCHMOVE_EPSILON;
        }

        function touchCoordsEqual(touchA, touchB) {
            return _.isEmpty(_.differenceWith(touchA, touchB, compareTouchCoords));
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexClick", wexClick);
})();
