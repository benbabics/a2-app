(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function CardsResource($q, globals, AccountsResource) {
        // Private members
        var accountsResource;

        // Revealed Public members
        var service = {
            getCards: getCards
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            accountsResource = AccountsResource;
        }

        function getCards(accountId, searchCriteria) {
            return $q.when(accountsResource.forAccount(accountId).getList(globals.ACCOUNT_MAINTENANCE_API.CARDS.BASE, searchCriteria));
        }

    }

    angular
        .module("app.components.card")
        .factory("CardsResource", CardsResource);
})();