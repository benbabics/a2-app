(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardDetailController(_, $rootScope, $scope, $ionicHistory, $state, $q, $ionicActionSheet, globals, UserManager, CardManager, card) {

        var vm = this;

        vm.config = globals.CARD_DETAIL.CONFIG;
        vm.card = card;

        vm.isChangeStatusLoading            = false;
        vm.displayStatusChangeBannerSuccess = false;
        vm.displayStatusChangeBannerFailure = false;

        vm.goToTransactionActivity = goToTransactionActivity;
        vm.handleClickChangeStatus = handleClickChangeStatus;
        vm.updateCardStatus        = updateCardStatus;
        vm.canChangeStatus         = canChangeStatus;

        function goToTransactionActivity() {
            //Clear the cache to work around issue where transaction page shows up before transition
            return $ionicHistory.clearCache([ "transaction" ])
                .then(() => {
                    $state.go("transaction.filterBy", {
                        filterBy:    "card",
                        filterValue: vm.card.cardId
                    });
                });
        }

        function handleClickChangeStatus() {
            let actions = _.filter( vm.config.statuses, item => item.id !== vm.card.status );
            displayChangeStatusActions( actions ).then(label => {
                let action = _.find( actions, { label } );
                vm.updateCardStatus( action.id );
            });
        }

        function updateCardStatus(newStatus) {
            if ( !newStatus ) { return; }

            // make request to update card status; if failure, revert
            vm.isChangeStatusLoading = true;

            let accountId = UserManager.getUser().billingCompany.accountId;
            CardManager.updateStatus( accountId, vm.card.cardId, newStatus )
                .then(() => {
                    vm.isChangeStatusLoading            = false;
                    vm.displayStatusChangeBannerSuccess = true;
                    $rootScope.$broadcast( "card:statusChange" );
                });
        }

        function canChangeStatus() {
            let userApplication = UserManager.getUser().onlineApplication;
            let isDistributor   = userApplication === globals.USER.ONLINE_APPLICATION.DISTRIBUTOR;
            return isDistributor ? !vm.card.isSuspended() : !vm.card.isTerminated();
        }

        /**
         * Private Methods
         */
        function displayChangeStatusActions(actions) {
            if ( !actions && _.isEmpty(actions) ) { return; }

            let deferred = $q.defer();

            $ionicActionSheet.show({
                buttons:    _.map( actions, action => { return { text: action.label } } ),
                titleText:  vm.config.actionStatusTitle,
                cancelText: vm.config.actionStatusCancel,
                cancel() { deferred.reject(); },
                buttonClicked(i, action) {
                    deferred.resolve( action.text );
                    return true;
                }
            });

            return deferred.promise;
        }

    }

    angular.module("app.components.card")
        .controller("CardDetailController", CardDetailController);
})();
