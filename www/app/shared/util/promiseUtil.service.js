(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function PromiseUtil($q, CommonService) {
        // Private members
        var _ = CommonService._;

        // Revealed Public members
        var service = {
            "allFinished": allFinished,
            "rejectAfter": rejectAfter
        };

        return service;
        //////////////////////

        /**
         * Waits for all given promises to settle (either resolve or reject), then resolves if all promises were resolved or
         * rejects if any of the promises reject. Resolves with an array of the resolved values from the given promises or rejects
         * with an array of the rejection reasons for the given promises.
         *
         * @param {Array} promises The array of promises to wait for
         * @return {Promise} A promise that will resolve if all given promises resolve and reject if any given promises reject.
         */
        function allFinished(promises) {
            return $q.allSettled(promises)
                .then(function (results) {
                    var rejections = _.filter(results, {state: "rejected"});

                    if (_.isEmpty(rejections)) {
                        return _.pluck(results, "value");
                    }
                    else {
                        throw _.pluck(rejections, "reason");
                    }
                });
        }

        /**
         * Waits for a given promise to resolve (if given) and then rejects with the given reason (if given). Rejects immediately
         * if no promise is given.
         *
         * @param {Promise} [promise] The promise to wait for
         * @param {Object} [reason] The reason to reject with
         * @return {Promise} A promise that will reject once the given promise has been fulfilled.
         */
        function rejectAfter(promise, reason) {
            if (promise) {
                return promise.then(function () {
                    return $q.reject(reason);
                });
            }
            else {
                return $q.reject(reason);
            }
        }
    }

    angular
        .module("app.shared.util")
        .factory("PromiseUtil", PromiseUtil);

})();