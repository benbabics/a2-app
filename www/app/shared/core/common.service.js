(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function CommonService(_, $ionicPlatform, $ionicPopup, $rootScope, $state, globals) {

        // Private members
        var loadingIndicatorCount = 0,
            alertPopup,
            focusedStateOrder = ["stage", "entering", "active"];

        // Revealed Public members
        var service = {
            // common dependencies
            "_": _,

            // utility functions
            "closeAlert"             : closeAlert,
            "displayAlert"           : displayAlert,
            "fieldHasError"          : fieldHasError,
            "findViewByState"        : findViewByState,
            "findViewByStatesInOrder": findViewByStatesInOrder,
            "findViews"              : findViews,
            "findViewsMatching"      : findViewsMatching,
            "getActiveNavView"       : getActiveNavView,
            "getErrorMessage"        : getErrorMessage,
            "getFocusedView"         : getFocusedView,
            "getViewContent"         : getViewContent,
            "loadingBegin"           : loadingBegin,
            "loadingComplete"        : loadingComplete,
            "maskAccountNumber"      : maskAccountNumber,
            "pageHasNavBar"          : pageHasNavBar,
            "setBackButtonStateRef"  : setBackButtonStateRef
        };

        return service;
        //////////////////////

        // Common utility functions go here

        /**
         * Closes an alert that had been previously opened by calling the below displayAlert function.
         */
        function closeAlert() {
            if (alertPopup) {
                alertPopup.close();
                alertPopup = null;
            }
        }

        /**
         * Displays an alert and save a reference to it for the above closeAlert function to use.
         */
        function displayAlert(options) {
            var mappedOptions = {};

            if (_.isObject(options)) {
                // Only set the options if they are provided as setting them to a option NOT specified
                // results in us passing undefined values which may or may not be acceptable
                if (_.isString(options.title)) {
                    mappedOptions.title = options.title;
                }

                if (_.isString(options.subTitle)) {
                    mappedOptions.subTitle = options.subTitle;
                }

                mappedOptions.cssClass = options.cssClass || "wex-alert-popup";

                if (_.isString(options.content)) {
                    mappedOptions.template = options.content;
                }

                if (_.isString(options.buttonText)) {
                    mappedOptions.okText = options.buttonText;
                }

                if (_.isString(options.buttonCssClass)) {
                    mappedOptions.okType = options.buttonCssClass;
                }
            }
            else {
                mappedOptions = {
                    cssClass: "wex-alert-popup"
                };
            }

            alertPopup = $ionicPopup.alert(mappedOptions);

            alertPopup.then(function (resolution) {
                // close popup
            });
        }

        function fieldHasError(field) {
            return (field && field.$error && !_.isEmpty(field.$error));
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

                return (navViewAttr && _.contains(states, navViewAttr));
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
         * Decomposes the errorObject and pulls out the appropriate values with details about the
         * error whether it's the response of a failed remote request or simply a string message.
         *
         * @param errorObject
         * @return string the error message
         */
        function getErrorMessage(errorObject) {

            var errorMessage = "";

            if (_.isString(errorObject)) {
                errorMessage = errorObject;
            }
            // if an Error class object
            else if (_.has(errorObject, "message")) {
                errorMessage = errorObject.message;
            }
            else if (_.isObject(errorObject.data)) {
                errorMessage += errorObject.data.error ? errorObject.data.error + ": " : "";
                errorMessage += errorObject.data.error_description || "";
            }

            if (_.isEmpty(errorMessage)) {
                errorMessage = globals.GENERAL.ERRORS.UNKNOWN_EXCEPTION;
            }

            return errorMessage;
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

        function loadingBegin() {
            if (loadingIndicatorCount === 0) {
                $rootScope.$broadcast("loadingBegin");
            }

            loadingIndicatorCount++;
        }

        function loadingComplete() {
            loadingIndicatorCount--;

            if (loadingIndicatorCount === 0) {
                $rootScope.$broadcast("loadingComplete");
            }
        }

        function maskAccountNumber(accountNumber) {

            var maskedNumber = "";

            if (!_.isEmpty(accountNumber)) {
                // Replace all but the last 4 characters with *
                maskedNumber = accountNumber.replace(/.(?=.{4})/g, "*");
            }

            return maskedNumber;
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

        function setBackButtonStateRef(scope, state) {
            var deregister = $ionicPlatform.registerBackButtonAction(function () {
                $state.go(state);
            }, 101);

            scope.$on("$destroy", deregister);
        }
    }

    angular
        .module("app.shared.core")
        .factory("CommonService", CommonService);
})();