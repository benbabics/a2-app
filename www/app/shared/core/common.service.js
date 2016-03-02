(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us
    // jshint maxparams:8

    /* @ngInject */
    function CommonService(_, $ionicPlatform, $ionicPopup, $q, $rootScope, $state, globals, Logger) {

        // Private members
        var POBOX_REGEX = new RegExp("([\\w\\s*\\W]*(P(OST)?(\\.)?\\s*O(FF(ICE)?)?(\\.)?\\s*B(OX)?))[\\w\\s*\\W]*"),
            loadingIndicatorCount = 0,
            alertPopup,
            confirmPopup,
            focusedStateOrder = ["stage", "entering", "active"],
            unfocusedStateOrder = ["cached", "leaving", "active"],
            logCordovaPlatformWarning = _.once(function () {
                Logger.debug(
                    "waitForCordovaPlatform callback function skipped: Cordova is not available on this platform. " +
                    "Note: All future callbacks will also be skipped."
                );
            });

        // Revealed Public members
        var service = {
            // common dependencies
            "_": _,

            // utility functions
            "closeAlert"               : closeAlert,
            "closeAllPopups"           : closeAllPopups,
            "closeConfirm"             : closeConfirm,
            "displayAlert"             : displayAlert,
            "displayConfirm"           : displayConfirm,
            "exitApp"                  : exitApp,
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
            "getErrorMessage"          : getErrorMessage,
            "getFocusedNavBar"         : getFocusedNavBar,
            "getFocusedView"           : getFocusedView,
            "getUnfocusedNavBar"       : getUnfocusedNavBar,
            "getUnfocusedView"         : getUnfocusedView,
            "getViewContent"           : getViewContent,
            "goToBackState"            : goToBackState,
            "isPoBox"                  : isPoBox,
            "loadingBegin"             : loadingBegin,
            "loadingComplete"          : loadingComplete,
            "maskAccountNumber"        : maskAccountNumber,
            "pageHasNavBar"            : pageHasNavBar,
            "platformHasCordova"       : platformHasCordova,
            "waitForCordovaPlatform"   : waitForCordovaPlatform
        };

        return service;
        //////////////////////

        // Common utility functions go here

        /**
         * Closes an alert that had been previously opened by calling the displayAlert function.
         */
        function closeAlert() {
            if (alertPopup) {
                alertPopup.close();
                alertPopup = null;
            }
        }

        /**
         * Closes all popups that have been previously opened by calling any of the displayPopup functions.
         */
        function closeAllPopups() {
            closeAlert();
            closeConfirm();

            //TODO close datepicker modal popup
        }

        /**
         * Closes a confirm that had been previously opened by calling the displayConfirm function.
         */
        function closeConfirm() {
            if (confirmPopup) {
                confirmPopup.close();
                confirmPopup = null;
            }
        }

        /**
         * Displays an alert and saves a reference to it for the closeAlert function to use.
         */
        function displayAlert(options) {
            var mappedOptions = {};

            if (_.isObject(options)) {
                mappedOptions = mapCommonPopupOptions(options);

                mappedOptions.cssClass = mappedOptions.cssClass || "wex-alert-popup";

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

            return alertPopup.then(function () { // args: resolution
                // close popup
            });
        }

        /**
         * Displays a confirm and saves a reference to it for the closeConfirm function to use.
         */
        function displayConfirm(options) {
            var mappedOptions = {};

            if (_.isObject(options)) {
                mappedOptions = mapCommonPopupOptions(options);

                mappedOptions.cssClass = mappedOptions.cssClass || "wex-confirm-popup";

                if (_.isString(options.okButtonText)) {
                    mappedOptions.okText = options.okButtonText;
                }

                if (_.isString(options.okButtonCssClass)) {
                    mappedOptions.okType = options.okButtonCssClass;
                }

                if (_.isString(options.cancelButtonText)) {
                    mappedOptions.cancelText = options.cancelButtonText;
                }

                if (_.isString(options.cancelButtonCssClass)) {
                    mappedOptions.cancelType = options.cancelButtonCssClass;
                }
            }
            else {
                mappedOptions = {
                    cssClass: "wex-confirm-popup"
                };
            }

            confirmPopup = $ionicPopup.confirm(mappedOptions);

            return confirmPopup;
        }

        function exitApp() {
            //close the app (this does not work on iOS since it does not allow apps to close themselves)
            if (navigator.app) {
                navigator.app.exitApp();
            }

            //app couldn't be closed (i.e. on iOS or a browser, so just go back to the login page)
            $state.go(globals.LOGIN_STATE);
        }

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

            if (_.isArray(errorObject)) {
                errorMessage = _.reduce(errorObject, function (message, error) {
                    return message + "\n- " + getErrorMessage(error);
                }, "");
            }
            else if (_.isString(errorObject)) {
                errorMessage = errorObject;
            }
            // if an Error class object
            else if (_.has(errorObject, "message")) {
                errorMessage = errorObject.message;
            }
            else if (_.has(errorObject, "data") && _.isObject(errorObject.data)) {
                errorMessage += errorObject.data.error ? errorObject.data.error + ": " : "";
                errorMessage += errorObject.data.error_description || "";
            }

            if (_.isEmpty(errorMessage)) {
                errorMessage = globals.GENERAL.ERRORS.UNKNOWN_EXCEPTION;
            }

            return errorMessage;
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
         * Goes to the back state specified by a given back button.
         *
         * @param {jqLite} [backButton] The back button to use (default: the active back button)
         * @return {Boolean} True if the call is successful
         * @throws {Error} Throws error if the back button couldn't be found
         */
        function goToBackState(backButton) {
            var backButtonScope;

            backButton = backButton || findActiveBackButton();

            //if there is a back button, call its goBack function
            if (backButton) {
                backButtonScope = backButton.isolateScope();
                if (backButtonScope) {
                    backButtonScope.goBack();
                    return true;
                }
            }

            var error = "Couldn't find the back button to go the back state";
            Logger.error(error);
            throw new Error(error);
        }

        function isPoBox(addressLine) {
            return _.isString(addressLine) && addressLine.length > 0 && !!addressLine.toUpperCase().match(POBOX_REGEX);
        }

        function loadingBegin() {
            if (loadingIndicatorCount === 0) {
                $rootScope.$emit("app:loadingBegin");
            }

            loadingIndicatorCount++;
        }

        function loadingComplete() {
            loadingIndicatorCount--;

            if (loadingIndicatorCount === 0) {
                $rootScope.$emit("app:loadingComplete");
            }
        }

        function mapCommonPopupOptions(options) {
            var mappedOptions = {};

            // Only set the options if they are provided as setting them to a option NOT specified
            // results in us passing undefined values which may or may not be acceptable
            if (_.isString(options.title)) {
                mappedOptions.title = options.title;
            }

            if (_.isString(options.subTitle)) {
                mappedOptions.subTitle = options.subTitle;
            }

            if (_.isString(options.cssClass)) {
                mappedOptions.cssClass = options.cssClass;
            }

            if (_.isString(options.content)) {
                mappedOptions.template = options.content;
            }

            if (_.isString(options.contentUrl)) {
                mappedOptions.templateUrl = options.contentUrl;
            }

            return mappedOptions;
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

        function platformHasCordova() {
            return !!window.cordova;
        }

        /**
         * Convenience function that executes a callback once Cordova/Ionic are ready and Cordova is available on the platform.
         *
         * @param {Function} [callback] A callback to execute when Cordova is ready and available.
         *
         * @return {Promise} a promise that will resolve when Cordova is ready and available, or reject if Cordova is not
         * available on the current platform. If a callback is given, the promise will resolve with the result of the callback.
         */
        function waitForCordovaPlatform(callback) {
            return $ionicPlatform.ready()
                .then(function () {
                    if (platformHasCordova()) {
                        //cordova is available, so execute the callback (if given)
                        if (_.isFunction(callback)) {
                            return callback();
                        }
                    }
                    else {
                        //Log the warning message (this only happens once per session)
                        logCordovaPlatformWarning();

                        return $q.reject();
                    }
                });
        }

    }

    angular
        .module("app.shared.core")
        .factory("CommonService", CommonService);
})();
