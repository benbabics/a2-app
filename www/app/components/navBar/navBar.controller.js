(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function NavBarController(globals, AlertsManager) {

        var vm = this;
        vm.config = globals.NAV_BAR.CONFIG;
        vm.getUnreadAlertsCount = getUnreadAlertsCount;

        function getUnreadAlertsCount() {
            return AlertsManager.getUnreadAlertsCount();
        }
    }

    angular.module("app.components.navBar")
        .controller("NavBarController", NavBarController);
})();
