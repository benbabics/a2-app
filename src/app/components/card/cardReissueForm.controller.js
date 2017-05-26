(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function CardReissueFormController(_, $rootScope, $state, $q, $ionicActionSheet, globals, $window, PlatformUtil,
                                       cardReissueDetails, CardManager, LoadingIndicator, Logger, Popup, UserManager) {

        var vm = this;

        vm.config = globals.CARD_REISSUE.CONFIG;
        vm.cardReissueDetails = cardReissueDetails;

        vm.isFormComplete = isFormComplete;

        vm.handleReissueConfirm       = handleReissueConfirm;
        vm.handleSelectShippingMethod = handleSelectShippingMethod;
        vm.handleSelectReissueReason  = handleSelectReissueReason;

        // expose methods for testing
        vm.displayReissueConfirm = displayReissueConfirm;

        //////////////////////

        function confirmReissue() {
            let accountId = UserManager.getUser().billingCompany.accountId;
            LoadingIndicator.begin();

            CardManager.reissue(accountId,
                vm.cardReissueDetails.originalCard.cardId,
                vm.cardReissueDetails.reissueReason,
                vm.cardReissueDetails.selectedShippingMethod.id)
                .then(card => {
                    vm.refreshListDeferredDelegate = $q.defer(); // expose for testing
                    $rootScope.$broadcast( "card:reissued", vm.refreshListDeferredDelegate );

                    vm.refreshListDeferredDelegate.promise.then(() => {
                        vm.cardReissueDetails.reissuedCard = card;
                        $state.go( "card.detail", { cardId: card.cardId, isReissued: true } );
                        LoadingIndicator.complete();
                    });
                })
                .catch(errorResponse => {
                    //TODO - What do we do here?
                    Logger.error("Failed to reissue card: " + errorResponse);
                    LoadingIndicator.complete();
                });
        }

        function isFormComplete() {
            return !_.isEmpty( vm.cardReissueDetails.shippingAddress )
                && !_.isEmpty( vm.cardReissueDetails.selectedShippingMethod )
                && vm.cardReissueDetails.reissueReason;
        }

        function handleReissueConfirm() {
            vm.displayReissueConfirm().then( confirmReissue );
        }

        function handleSelectShippingMethod() {
            let shippingMethods = _.map(vm.cardReissueDetails.shippingMethods, action => {
                return {
                    text: vm.cardReissueDetails.getShippingMethodDisplayName( action ),
                    data: action
                };
            });

            displayActionsheetItems( shippingMethods ).then(shippingMethod => {
                vm.cardReissueDetails.selectedShippingMethod = shippingMethod;
            });
        }

        function handleSelectReissueReason() {
            let config = angular.extend({}, globals.CARD_REISSUE_INPUTS.REISSUE_REASON.CONFIG, globals.CARD);
            let reasons = _.map(config.REISSUE_REASON, action => {
                return {
                    text: vm.cardReissueDetails.getReissueReasonDisplayName( action ),
                    data: action
                };
            });

            displayActionsheetItems( reasons ).then(reason => {
                vm.cardReissueDetails.reissueReason = reason;
            });
        }

        function displayActionsheetItems(actions) {
            if ( !actions && _.isEmpty(actions) ) { return; }

            $ionicActionSheet.show({
                buttons: actions,
                titleText:  'titleText',
                cancelText: 'cancelText',
                cancel() { deferred.reject(); },
                buttonClicked(i, action) {
                    deferred.resolve( action.data );
                    return true;
                },
            });

            let deferred = $q.defer();
            return deferred.promise;
        }

        function displayReissueConfirm() {
            let deferred = $q.defer();
            let content = vm.config.confirmationPopup;

            whenReadyNotification(notification => {
                let handleConfirm = (btnIndex) => {
                    deferred[ btnIndex === 1 ? "reject" : "resolve" ]();
                }

                notification.confirm( content.message, handleConfirm, "", content.buttons );
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
    }

    angular.module("app.components.card")
        .controller("CardReissueFormController", CardReissueFormController);
})();
