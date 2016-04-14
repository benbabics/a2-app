(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function Popup(_, $ionicPopup) {
        // Private members
        var alertPopup,
            confirmPopup;

        // Revealed Public members
        var service = {
            "closeAlert"     : closeAlert,
            "closeAllPopups" : closeAllPopups,
            "closeConfirm"   : closeConfirm,
            "closeDatePicker": closeDatePicker,
            "displayAlert"   : displayAlert,
            "displayConfirm" : displayConfirm
        };

        return service;
        //////////////////////

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
            closeDatePicker();
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

        function closeDatePicker() {
            var datePicker = angular.element(document.querySelector(".ionic_datepicker_popup")),
                scope;

            if (!_.isEmpty(datePicker)) {
                scope = datePicker.scope().$parent;

                if (_.has(scope, "popup")) {
                    scope.popup.close();
                }
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
    }

    angular
        .module("app.shared.widgets")
        .factory("Popup", Popup);
})();
