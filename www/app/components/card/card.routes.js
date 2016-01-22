(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("card", {
            abstract: true,
            url  : "/card",
            views: {
                "@": {
                    template: "<ion-nav-view name='view'></ion-nav-view>"
                }
            }
        });

        $stateProvider.state("card.list", {
            cache: false,
            url  : "/list",
            views: {
                "view@card": {
                    templateUrl: "app/components/card/templates/cardList.html",
                    controller : "CardListController as vm"
                }
            },
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.CARD_LIST.CONFIG.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("card.detail", {
            url  : "/detail/:cardId",
            cache: false,
            views: {
                "view@card": {
                    templateUrl: "app/components/card/templates/cardDetail.html",
                    controller : "CardDetailController as vm",
                    resolve    : {
                        card: function ($stateParams, CardManager, CommonService) {
                            var cardId = $stateParams.cardId;

                            CommonService.loadingBegin();

                            return CardManager.fetchCard(cardId)
                                .finally(function () {
                                    CommonService.loadingComplete();
                                });
                        }
                    }
                }
            },
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.CARD_DETAIL.CONFIG.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("card.changeStatus", {
            abstract: true,
            url     : "/changeStatus/:cardId",
            resolve : {
                card: function ($stateParams, CardManager, CommonService) {
                    var cardId = $stateParams.cardId;

                    CommonService.loadingBegin();

                    return CardManager.fetchCard(cardId)
                        .finally(function () {
                            CommonService.loadingComplete();
                        });
                }
            },
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.CARD_CHANGE_STATUS.CONFIG.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("card.changeStatus.form", {
            cache: false,
            url  : "",
            views: {
                "view@card": {
                    templateUrl: "app/components/card/templates/cardChangeStatus.html",
                    controller : "CardChangeStatusController as vm"
                }
            }
        });

        $stateProvider.state("card.changeStatus.confirmation", {
            cache: false,
            url  : "/confirmation",
            views: {
                "view@card": {
                    templateUrl: "app/components/card/templates/cardChangeStatusConfirmation.html",
                    controller : "CardChangeStatusConfirmationController as vm"
                }
            },
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.CARD_CHANGE_STATUS_CONFIRMATION.CONFIG.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("card.reissue", {
            cache   : false,
            abstract: true,
            url     : "/reissue/:cardId",
            resolve : {
                cardReissueDetails: function(CardReissueModel) {
                    return new CardReissueModel();
                }
            },
            views   : {
                "view@card": {
                    template  : "<ion-nav-view name='view'></ion-nav-view>",
                    controller: "CardReissueController as reissueController",
                    resolve   : {
                        account: function (AccountManager, CommonService, UserManager) {
                            var accountId = UserManager.getUser().billingCompany.accountId;

                            CommonService.loadingBegin();

                            return AccountManager.fetchAccount(accountId)
                                .finally(CommonService.loadingComplete);
                        },
                        card: function ($stateParams, CardManager, CommonService) {
                            var cardId = $stateParams.cardId;

                            CommonService.loadingBegin();

                            return CardManager.fetchCard(cardId)
                                .finally(CommonService.loadingComplete);
                        }
                    }
                }
            }
        });

        $stateProvider.state("card.reissue.form", {
            cache: false,
            url  : "",
            views: {
                "view@card.reissue": {
                    templateUrl: "app/components/card/templates/cardReissue.html",
                    controller : "CardReissueFormController as vm"
                }
            },
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.CARD_REISSUE.CONFIG.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("card.reissue.shippingMethod", {
            cache: false,
            url  : "/shippingMethod",
            views: {
                "view@card.reissue": {
                    templateUrl: "app/components/card/templates/cardReissueShippingMethod.input.html",
                    controller : "CardReissueShippingMethodInputController as vm"
                }
            },
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.CARD_REISSUE_INPUTS.SHIPPING_METHOD.CONFIG.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("card.reissue.reason", {
            cache: false,
            url  : "/reason",
            views: {
                "view@card.reissue": {
                    templateUrl: "app/components/card/templates/cardReissueReason.input.html",
                    controller : "CardReissueReasonInputController as vm"
                }
            },
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.CARD_REISSUE_INPUTS.REISSUE_REASON.CONFIG.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("card.reissue.confirmation", {
            cache: false,
            url  : "/confirmation",
            views: {
                "view@card.reissue": {
                    templateUrl: "app/components/card/templates/cardReissueConfirmation.html",
                    controller : "CardReissueConfirmationController as vm"
                }
            },
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.CARD_REISSUE_CONFIRMATION.CONFIG.ANALYTICS.pageName);
            }
        });
    }

    angular.module("app.components.card")
        .config(configureRoutes);
}());