/**
 * This service provides an injectable (and extended) version of the underscore / lodash lib.
  */
(function () {
    "use strict";

    /* @ngInject */
    function LodashService($window) {

        // Get a local handle on the global lodash reference.
        var _ = $window._;


        /**
         * delete the global reference to make sure that no one on the team gets lazy
         * and tried to reference the library without injecting it.
         * It's an easy mistake to make, and one that won't throw an error
         * (since the core library is globally accessible).
         * ALSO: See .run() block in core.module.js.
         */
        //delete( $window._ ); // commented out because this library is also used by Restangular

        // Methods extending the library would go here

        // Return the [formerly global] reference so that it can be injected
        // into other aspects of the AngularJS application.
        return( _ );
    }

    angular
        .module("app.shared.integration")
        .factory("_", LodashService);
})();
