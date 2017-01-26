(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function NavBarController(globals, NotificationItemsManager) {

        var vm = this;
        vm.config = globals.NAV_BAR.CONFIG;
        vm.getUnreadNotificationsCount = getUnreadNotificationsCount;

        function getUnreadNotificationsCount() {
            return NotificationItemsManager.getUnreadNotificationsCount();
        }
    }

    angular.module("app.components.navBar")
        .controller("NavBarController", NavBarController);
})();
