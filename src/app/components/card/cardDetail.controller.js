(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardDetailController(_, $rootScope, $scope, $ionicHistory, $state, $stateParams, $q, $ionicActionSheet, $ionicPopup, $window, globals, AnalyticsUtil, UserManager, CardManager, PlatformUtil, card) {
        const CARD_STATUS      = globals.CARD.STATUS;
        const USER_APPLICATION = ((appType) => {
            return {
                isClassic:     appType === globals.USER.ONLINE_APPLICATION.CLASSIC,
                isDistributor: appType === globals.USER.ONLINE_APPLICATION.DISTRIBUTOR,
                isWOLNP:       appType === globals.USER.ONLINE_APPLICATION.WOL_NP
            };
        })( UserManager.getUser().onlineApplication );

        var vm = this;

        vm.config = globals.CARD_DETAIL.CONFIG;
        vm.card = card;

        vm.isChangeStatusLoading            = false;
        vm.shouldDisplayBannerSuccess       = false;
        vm.displayStatusChangeBannerSuccess = false;
        vm.displayStatusChangeBannerFailure = false;

        vm.handleNavigateTransactionActivity = handleNavigateTransactionActivity;
        vm.handleNavigateReissueCard         = handleNavigateReissueCard;
        vm.handleClickChangeStatus           = handleClickChangeStatus;
        vm.updateCardStatus = updateCardStatus;
        vm.canChangeStatus  = canChangeStatus;

        // expose for testing
        vm.displayChangeStatusConfirm = displayChangeStatusConfirm;
        vm.displayChangeStatusActions = displayChangeStatusActions;

        if ( $stateParams.isReissued ) {
            displayBannerSuccess( vm.config.bannerReissueCardSuccess );
        }

        function handleNavigateTransactionActivity() {
            //Clear the cache to work around issue where transaction page shows up before transition
            return $ionicHistory.clearCache([ "transaction" ])
                .then(() => {
                    $state.go("transaction.filterBy", {
                        filterBy:    "card",
                        filterValue: vm.card.cardId
                    });

                    trackEvent( "navigateTransactions" );
                });
        }

        function handleNavigateReissueCard() {
            if ( canReissueCard() ) {
                let cardId = vm.card.cardId;
                return $state.go( "card.reissue.form", { cardId } );
            }

            whenReadyNotification(notification => {
                let message = vm.config.alertPopupMessages.classicMultipleReissues;
                notification.alert( message, _.noop, "" );
            });
        }

        function handleClickChangeStatus() {
            let actions = getAvailableCardStatuses();
            vm.displayChangeStatusActions( actions ).then(label => {
                let action = _.find( actions, { label } );
                vm.displayChangeStatusConfirm( action.id ).then(() => {
                    vm.updateCardStatus( action.id );
                });
                trackEvent( action.trackingId );
            });

            trackView( "statusOptionsOpen" );
        }

        function updateCardStatus(newStatus) {
            if ( !newStatus || newStatus === vm.card.status ) { return; }

            // make request to update card status; if failure, revert
            vm.isChangeStatusLoading = true;

            let accountId = UserManager.getUser().billingCompany.accountId;
            CardManager.updateStatus( accountId, vm.card.cardId, newStatus )
                .then(() => {
                    vm.isChangeStatusLoading = false;
                    displayBannerSuccess( vm.config.bannerStatusChangeSuccess );
                    $rootScope.$broadcast( "card:statusChange" );
                    trackView( "statusOptionsSuccess" );
                });
        }

        function canChangeStatus() {
            if ( USER_APPLICATION.isDistributor ) { return vm.card.isActive(); }
            return !vm.card.isTerminated();
        }

        /**
         * Private Methods
         */
        function canReissueCard() {
            let isClassic = USER_APPLICATION.isClassic,
                cardNo    = vm.card.embossedCardNumber,
                suffixInt = parseInt( cardNo.substr(cardNo.length - 1) );

            return !isClassic || ( isClassic && suffixInt < 9 );
        }

        function getAvailableCardStatuses() {
            let rejectionAttrs;

            // Only WOL_NP with "Active" status can "Suspended" Cards
            if ( !USER_APPLICATION.isWOLNP && vm.card.isActive() ) {
                rejectionAttrs = { id: "SUSPENDED" };
            }

            // will not reject an iteratee when rejectionAttrs is false
            return _.reject( vm.config.statuses, rejectionAttrs || false );
        }

        function displayChangeStatusActions(actions) {
            if ( !actions && _.isEmpty(actions) ) { return; }

            let deferred = $q.defer();

            $ionicActionSheet.show({
                buttons:    _.map( actions, action => { return { text: action.label } } ),
                titleText:  `<b>${vm.config.actionStatusTitle}</b>`,
                cancelText: vm.config.actionStatusCancel,
                cancel() { deferred.reject(); },
                buttonClicked(i, action) {
                    deferred.resolve( action.text );
                    return true;
                }
            });

            return deferred.promise;
        }

        function displayChangeStatusConfirm(actionId) {
            let message, deferred = $q.defer();

            switch( actionId.toLowerCase() ) {
                case CARD_STATUS.TERMINATED:
                    message = vm.config.confirmMessageTerminate;
                    break;

                default: return $q.resolve();
            }

            whenReadyNotification(notification => {
                let handleConfirm = (btnIndex) => {
                    deferred[ btnIndex === 1 ? "reject" : "resolve" ]();
                }

                notification.confirm( message, handleConfirm, "", [ "No", "Yes" ] );
            });

            return deferred.promise;
        }

        function whenReadyNotification(callback) {
            return PlatformUtil.waitForCordovaPlatform(() => {
                if ( $window.navigator.notification ) {
                    return $window.navigator.notification;
                }
            }).then( callback );
        }

        function displayBannerSuccess(message="") {
            vm.shouldDisplayBannerSuccess = true;
            vm.bannerSuccessMessage = message;
        }

        /**
         * Analytics
         **/
        function trackEvent(action) {
            var eventData = vm.config.ANALYTICS.events[ action ];
            _.spread( AnalyticsUtil.trackEvent )( eventData );
        }

        function trackView(viewId) {
            var viewName = vm.config.ANALYTICS.views[ viewId ];
            AnalyticsUtil.trackView( viewName );
        }

    }

    angular.module("app.components.card")
        .controller("CardDetailController", CardDetailController);
})();
