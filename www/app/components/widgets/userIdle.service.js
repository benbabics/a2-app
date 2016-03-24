(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us
    // jshint maxparams:5

    /* @ngInject */
    function UserIdle($rootScope, $state, globals, Idle, LoginManager) {
        // Revealed Public members
        var service = {
            endWatch  : endWatch,
            isUserIdle: isUserIdle,
            isWatching: isWatching,
            startWatch: startWatch
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            $rootScope.$on("IdleStart", onIdleStart);
            $rootScope.$on("app:login", startWatch);
            $rootScope.$on("app:logout", endWatch);
        }

        function endWatch() {
            Idle.unwatch();
        }

        function isUserIdle() {
            return Idle.idling();
        }

        function isWatching() {
            return Idle.running();
        }

        function onIdleStart() {
            //log out the user
            LoginManager.logOut();

            //go to the login page
            $state.go(globals.LOGIN_STATE, {timedOut: true});
        }

        function startWatch() {
            Idle.watch();
        }
    }

    angular
        .module("app.components.widgets")
        .factory("UserIdle", UserIdle);
})();
