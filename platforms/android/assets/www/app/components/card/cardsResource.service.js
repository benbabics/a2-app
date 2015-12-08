(function () {
    "use strict";
    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function CardsResource($q, globals, AccountsResource) {
        // Private members
        var accountsResource;

        // Revealed Public members
        var service = {
            getCards        : getCards,
            postStatusChange: postStatusChange,
            postUpdate      : postUpdate
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

        function postStatusChange(accountId, cardId, newStatus) {
            return $q.when(accountsResource.forAccount(accountId)
                .doPOST(null, globals.ACCOUNT_MAINTENANCE_API.CARDS.BASE + "/" + cardId + "/" + globals.ACCOUNT_MAINTENANCE_API.CARDS.STATUS, {newStatus: newStatus}));
        }

        function postUpdate(accountId, cardId, updateDetails) {
            return $q.when(accountsResource.forAccount(accountId).doPOST(updateDetails, globals.ACCOUNT_MAINTENANCE_API.CARDS.BASE + "/" + cardId));
        }

    }

    angular
        .module("app.components.card")
        .factory("CardsResource", CardsResource);
})();
