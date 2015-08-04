(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function CommonService(_, $ionicPopup, $rootScope, globals) {

        // Private members
        var loadingIndicatorCount = 0,
            alertPopup;

        // Revealed Public members
        var service = {
            // common dependencies
            "_": _,

            // utility functions
            "closeAlert"       : closeAlert,
            "displayAlert"     : displayAlert,
            "fieldHasError"    : fieldHasError,
            "getActiveNavView" : getActiveNavView,
            "getActiveView"    : getActiveView,
            "getErrorMessage"  : getErrorMessage,
            "loadingBegin"     : loadingBegin,
            "loadingComplete"  : loadingComplete,
            "maskAccountNumber": maskAccountNumber,
            "pageHasNavBar"    : pageHasNavBar
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
         * Searches for the active ion-nav-view element.
         *
         * @return JQLite element representing the active ion-nav-view
         */
        function getActiveNavView() {
            var navView = document.querySelector("ion-nav-view.nav-view-root");
            return navView ? angular.element(navView) : null;
        }

        /**
         * Searches for the active ion-view element, optionally only searching inside the given navView.
         *
         * @param [navView]
         * @return JQLite element representing the active ion-view
         */
        function getActiveView(navView) {
            navView = navView || getActiveNavView();
            var activeView,
                findViewByState = function (state) {
                    var children = navView.children();

                    for (var i = 0; i < children.length; ++i) {
                        var curChild = angular.element(children[i]);

                        if (curChild.attr("nav-view") === state) {
                            return curChild;
                        }
                    }

                    return null;
                };

            if (!navView) {
                return null;
            }

            //first look for views with the active state
            activeView = findViewByState("active");

            //if there are no active views, look for ones that are being entered
            if (!activeView) {
                activeView = findViewByState("entering");
            }

            //if the selected view element isn't an ion-view, treat it as a parent nav-view and keep searching down
            if (activeView && activeView.prop("tagName").toLowerCase() !== "ion-view") {
                activeView = getActiveView(activeView);
            }

            return activeView;
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
            else if (_.isObject(errorObject.data)) {
                errorMessage += errorObject.data.error ? errorObject.data.error + ": " : "";
                errorMessage += errorObject.data.error_description || "";
            }

            if (_.isEmpty(errorMessage)) {
                errorMessage = globals.GENERAL.ERRORS.UNKNOWN_EXCEPTION;
            }

            return errorMessage;
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
         * @return boolean true if the page has a visible navBar, false if it does not
         */
        function pageHasNavBar() {
            var navBar = document.querySelector("ion-nav-bar.bar-wex");

            if (navBar) {
                return !angular.element(navBar).hasClass("hide");
            }
            return false;
        }
    }

    angular
        .module("app.shared.core")
        .factory("CommonService", CommonService);
})();