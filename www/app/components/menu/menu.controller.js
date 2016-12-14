(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:8

    /* @ngInject */
    function MenuController(_, $state, $timeout, globals, Navigation, NotificationItemsManager, Fingerprint) {

        var vm = this;
        vm.config = globals.MENU.CONFIG;
        vm.fingerprintAuthAvailable = false;

        vm.navigate = navigate;
        vm.currentStateHasRoot = currentStateHasRoot;
        vm.getUnreadNotificationsCount = getUnreadNotificationsCount;

        $timeout( activate );

        /////////////////////
        // Controller initialization
        function activate() {
            Fingerprint.isAvailable()
                .then(function () { vm.fingerprintAuthAvailable = true; });
        }

        function navigate(target) {
            // using .menu-animated value
            $timeout(Navigation[target], 100);
        }

        function currentStateHasRoot(rootState) {
            return _.startsWith($state.current.name, rootState);
        }

        function getUnreadNotificationsCount() {
            return NotificationItemsManager.getUnreadNotificationsCount();
        }
    }

    angular.module("app.components.menu")
        .controller("MenuController", MenuController);
})();
