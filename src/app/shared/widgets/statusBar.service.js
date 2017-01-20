(function () {
    "use strict";

    // Service for controlling the iOS status bar overlaying the app
    function StatusBar() {

        var service = {
            setOverlaysApp: setOverlaysApp
        };

        return service;

        // If TRUE is passed, the status bar will appear over the web view.
        // If FALSE is passed, the status bar will appear over a solid bar.
        function setOverlaysApp(overlays) {
            var element = angular.element(document.querySelector("#status-bar-overlay"));

            if (overlays) {
                element.addClass("overlaying");
            } else {
                element.removeClass("overlaying");
            }
        }
    }

    angular
        .module("app.shared.widgets")
        .factory("StatusBar", StatusBar)
})();