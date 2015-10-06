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
            }
        });

        $stateProvider.state("card.reissue", {
            cache: false,
            abstract: true,
            url     : "/reissue/:cardId",
            resolve : {
                cardReissueDetails: function ($stateParams, CardReissueManager, CommonService, UserManager) {
                    var cardId = $stateParams.cardId,
                        accountId = UserManager.getUser().billingCompany.accountId;

                    CommonService.loadingBegin();

                    return CardReissueManager.getOrCreateCardReissueDetails(accountId, cardId)
                        .finally(CommonService.loadingComplete);
                }
            },
            views: {
                "view@card": {
                    template: "<ion-nav-view name='view'></ion-nav-view>",
                    controller: "CardReissueController as vm"
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
            }
        });
    }

    angular.module("app.components.card")
        .config(configureRoutes);
}());