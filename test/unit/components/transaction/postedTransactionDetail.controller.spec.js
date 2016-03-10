(function () {
    "use strict";

    var $scope,
        ctrl,
        mockPostedTransaction,
        mockGlobals = {
            "POSTED_TRANSACTION_DETAIL": {
                "CONFIG": {
                    "ANALYTICS"           : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "cardNumber"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "customVehicleAssetId": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "driverFirstName"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "driverLastName"      : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "grossCost"           : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "merchantName"        : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "merchantCityState"   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "netCost"             : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "postedDate"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "productDescription"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "title"               : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "transactionDate"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "transactionId"       : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                }
            }
        },
        mockConfig = mockGlobals.POSTED_TRANSACTION_DETAIL.CONFIG;

    describe("A Posted Transaction Detail Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components");

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            inject(function ($controller, $rootScope, $q, PostedTransactionModel) {

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                mockPostedTransaction = TestUtils.getRandomPostedTransaction(PostedTransactionModel);

                ctrl = $controller("PostedTransactionDetailController", {
                    $scope                 : $scope,
                    postedTransaction      : mockPostedTransaction,
                    globals                : mockGlobals
                });

            });

        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the posted transaction", function () {
                expect(ctrl.postedTransaction).toEqual(mockPostedTransaction);
            });

        });

    });

}());