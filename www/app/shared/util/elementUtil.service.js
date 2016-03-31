(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function ElementUtil(_, Logger) {
        // Private members
        var focusedStateOrder = ["stage", "entering", "active"],
            unfocusedStateOrder = ["cached", "leaving", "active"];

        // Revealed Public members
        var service = {
            "fieldHasError"            : fieldHasError,
            "findActiveBackButton"     : findActiveBackButton,
            "findBackButton"           : findBackButton,
            "findCachedBackButton"     : findCachedBackButton,
            "findNavBarByStatesInOrder": findNavBarByStatesInOrder,
            "findViewByState"          : findViewByState,
            "findViewByStatesInOrder"  : findViewByStatesInOrder,
            "findViews"                : findViews,
            "findViewsMatching"        : findViewsMatching,
            "getActiveNavView"         : getActiveNavView,
            "getFocusedNavBar"         : getFocusedNavBar,
            "getFocusedView"           : getFocusedView,
            "getSideMenu"              : getSideMenu,
            "getUnfocusedNavBar"       : getUnfocusedNavBar,
            "getUnfocusedView"         : getUnfocusedView,
            "getViewContent"           : getViewContent,
            "pageHasNavBar"            : pageHasNavBar,
            "resetInfiniteList"        : resetInfiniteList
        };

        return service;
        //////////////////////

        function fieldHasError(field) {
            return (field && field.$error && !_.isEmpty(field.$error));
        }

        /**
         * Searches for the wex-back-button element on the active view.
         *
         * @return {jqLite} An element that represents the back button, or null if no back button was found
         */
        function findActiveBackButton() {
            var view = getFocusedView(),
                navBar = getFocusedNavBar();

            if (view) {
                return findBackButton(view, navBar);
            }
            else {
                return null;
            }
        }

        /**
         * Searches for the primary wex-back-button element for the given view.
         *
         * @param {jqLite} view The view to search on
         * @param {jqLite} [navBar] The nav-bar to search on
         * @return {jqLite} An element that represents the back button, or null if no back button was found
         */
        function findBackButton(view, navBar) {
            var backButton;

            //first search the view to see if it has an overriding back button
            backButton = view[0].querySelector(".button-wex-back");

            //there's no override, so look for the global back button on the nav-bar
            if (!backButton && navBar) {
                backButton = navBar[0].querySelector(".button-wex-back");
            }

            return backButton ? angular.element(backButton) : null;
        }

        /**
         * Searches for the wex-back-button element on the cached view.
         *
         * @return {jqLite} An element that represents the back button, or null if no back button was found
         */
        function findCachedBackButton() {
            var view = getUnfocusedView(),
                navBar = getUnfocusedNavBar();

            if (view) {
                return findBackButton(view, navBar);
            }
            else {
                return null;
            }
        }

        /**
         * Searches for the first nav-bar that matches any of the given states, searching in the order that the states
         * are specified.
         *
         * @param {Array} orderedStates The ordered array of state names that the nav-bar can match
         * @return {jqLite} An element that represents the nav-bar, or null if no matching nav-bar was found
         */
        function findNavBarByStatesInOrder(orderedStates) {
            var navBarBlocks = document.querySelectorAll(".nav-bar-block"),
                navBar = null;

            //loop through the states in order and return the first nav-bar that matches a given state
            _.each(orderedStates, function (state) {
                for (var i = 0; i < navBarBlocks.length; ++i) {
                    var curNavBlock = angular.element(navBarBlocks[i]);

                    //if the cur nav-block matches the given state, see if it has a header-bar in it
                    if (curNavBlock.attr("nav-bar") === state) {
                        var curNavBar = curNavBlock.find("ion-header-bar");

                        //found a matching nav-bar, so end the loop
                        if (curNavBar.length > 0) {
                            navBar = curNavBar;
                            return false;
                        }
                    }
                }
            });

            return navBar;
        }

        /**
         * Recursively searches for the first view within a nav-view that matches the given state.
         *
         * @param {String} state The state name that the view should match
         * @param {jqLite} [navView] The nav-view to search within (default: the active nav-view)
         * @return {jqLite} An element that represents the view, or null if no view was found
         */
        function findViewByState(state, navView) {
            return findViewsMatching([state], true, navView);
        }

        /**
         * Recursively searches for the first view within a nav-view that matches any of the given states, searching in
         * the order that the states are specified.
         *
         * @param {Array} orderedStates The ordered array of state names that the view can match
         * @param {jqLite} [navView] The nav-view to search within (default: the active nav-view)
         * @return {jqLite} An element that represents the view, or null if no view was found
         */
        function findViewByStatesInOrder(orderedStates, navView) {
            var matchingViews = findViewsMatching(orderedStates, false, navView),
                foundView = null;

            //loop through the states in order and return the first view that matches a given state
            _.each(orderedStates, function (state) {
                _.each(matchingViews, function (view) {

                    if (view.attr("nav-view") === state) {
                        foundView = view;

                        return false;
                    }
                });

                if (foundView) {
                    return false;
                }
            });

            return foundView;
        }

        /**
         * Recursively searches for views within a nav-view that match the given predicate.
         *
         * @param {Function} predicate The predicate function to apply to each view
         * @param {boolean} [firstView] Whether or not to return only the first view found (default: false)
         * @param {jqLite} [navView] The nav-view to search within (default: the active nav-view)
         * @return {Array|jqLite} An array of elements that were found, or a single element (or null) if firstView is
         * true
         */
        function findViews(predicate, firstView, navView) {
            navView = navView || getActiveNavView();

            var views = [],
                children;

            if (navView) {
                children = navView.children();

                for (var i = 0; i < children.length; ++i) {
                    var curChild = angular.element(children[i]);

                    if (predicate(curChild)) {
                        //if the current view element isn't an ion-view, treat it as a parent nav-view and keep searching down
                        if (curChild.prop("tagName").toLowerCase() !== "ion-view") {
                            //add all the found views from the search in curChild to this array
                            views = _.union(views, findViews(predicate, false, curChild));
                        }
                        else {
                            views.push(curChild);
                        }
                    }
                }
            }

            if (firstView) {
                //only return the first view (or null if there are none)
                if (views.length > 0) {
                    views = views[0];
                }
                else {
                    views = null;
                }
            }
            return views;
        }

        /**
         * Recursively searches for views within a nav-view that match any of the given states.
         *
         * @param {Array} states The array of state names that the views should match
         * @param {boolean} [firstView] Whether or not to return only the first view found (default: false)
         * @param {jqLite} [navView] The nav-view to search within (default: the active nav-view)
         * @return {Array|jqLite} An array of elements that were found, or a single element (or null) if firstView is
         * true
         */
        function findViewsMatching(states, firstView, navView) {
            return findViews(function (view) {
                var navViewAttr = view.attr("nav-view");

                return (navViewAttr && _.includes(states, navViewAttr));
            }, firstView, navView);
        }

        /**
         * Searches for the active nav-view element.
         *
         * @return {jqLite} element representing the active nav-view, or null if no active element found.
         */
        function getActiveNavView() {
            var navView = document.querySelector("ion-nav-view.nav-view-root");
            return navView ? angular.element(navView) : null;
        }

        /**
         * Searches for the focused nav-bar element.
         *
         * @return {jqLite} An element that represents the nav-bar, or null if no nav-bar was found
         */
        function getFocusedNavBar() {
            return findNavBarByStatesInOrder(focusedStateOrder);
        }

        /**
         * Searches for the focused view element within a nav-view.
         *
         * @param {jqLite} [navView] The nav-view to search within (default: the active nav-view)
         * @return {jqLite} An element that represents the view, or null if no view was found
         */
        function getFocusedView(navView) {
            return findViewByStatesInOrder(focusedStateOrder, navView);
        }

        function getSideMenu(side) {
            var selector = "ion-side-menu" + (side ? "[side='" + side + "']" : ""),
                sideMenu = document.querySelector(selector);

            return sideMenu ? angular.element(sideMenu) : null;
        }

        /**
         * Searches for the unfocused nav-bar element.
         *
         * @return {jqLite} An element that represents the nav-bar, or null if no nav-bar was found
         */
        function getUnfocusedNavBar() {
            return findNavBarByStatesInOrder(unfocusedStateOrder);
        }

        /**
         * Searches for the unfocused view element within a nav-view.
         *
         * @param {jqLite} [navView] The nav-view to search within (default: the active nav-view)
         * @return {jqLite} An element that represents the view, or null if no view was found
         */
        function getUnfocusedView(navView) {
            return findViewByStatesInOrder(unfocusedStateOrder, navView);
        }

        /**
         * Searches for the content element within a view.
         *
         * @param {jqLite} [view] The view to search within (default: the focused view)
         * @return {jqLite} An element that represents the view, or null if no view was found
         */
        function getViewContent(view) {
            view = view || getFocusedView();
            var content;

            if (!view) {
                return null;
            }

            content = view.find("ion-content");
            return content.length > 0 ? content : null;
        }

        /**
         * Determines whether or not the page currently has a visible navBar.
         *
         * @return {boolean} true if the page has a visible navBar, false if it does not
         */
        function pageHasNavBar() {
            var navBar = document.querySelector("ion-nav-bar.bar-wex");

            if (navBar) {
                return !angular.element(navBar).hasClass("hide");
            }
            return false;
        }

        /**
         * Resets an infinite list so that it is reloaded.
         *
         * @param {jqLite} [infiniteList] The infinite list to reset (if not given, resets the first infinite list in the active view)
         * @throws Will throw an error if no infinite list is given and one cannot be found in the active view
         */
        function resetInfiniteList(infiniteList) {
            var error;

            if (!infiniteList) {
                var view = getFocusedView();

                if (!view) {
                    error = "Failed to reset infinite list: Couldn't find the active view";
                    Logger.error(error);
                    throw new Error(error);
                }

                infiniteList = angular.element(view[0].querySelector("wex-infinite-list"));
            }

            if (infiniteList.length === 0) {
                error = "Failed to reset infinite list: No infinite scroll found";
                Logger.error(error);
                throw new Error(error);
            }

            //TODO: Remove this kludge when Ionic's collection-repeat is fixed to remove previous items from the list
            angular.element(infiniteList[0].querySelector(".collection-repeat-container")).children().remove();

            //TODO: Remove this kludge when Ionic's ion-infinite-scroll is fixed to call onInfinite() when a collection is reset
            infiniteList.scope().$$postDigest(function () {
                //force the infinite scroll to re-evaluate the bounds so that an onInfinite update occurs
                var infiniteScroll = angular.element(infiniteList[0].querySelector("ion-infinite-scroll"));

                infiniteScroll.controller("ionInfiniteScroll").checkBounds();
            });
        }
    }

    angular
        .module("app.shared.util")
        .factory("ElementUtil", ElementUtil);
})();
