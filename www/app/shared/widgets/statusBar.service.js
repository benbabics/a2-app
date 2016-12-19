(function () {
    "use strict";

    // Service for controlling the iOS status bar overlaying the app
    function StatusBar($document) {
        //Private members
        var element;

        var service = {
            setOverlaysApp: setOverlaysApp
        };

        activate();

        return service;

        function activate() {
            $document.ready(function() {
                element = angular.element(document.querySelector("#status-bar-overlay"));
                setOverlaysApp(true);
            });
        }

        // If TRUE is passed, the status bar will appear over the web view.
        // If FALSE is passed, the status bar will appear over a solid bar.
        function setOverlaysApp(overlays) {
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