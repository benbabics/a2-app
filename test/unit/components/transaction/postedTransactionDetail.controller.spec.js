(function () {
    "use strict";

    var $scope,
        $cordovaGoogleAnalytics,
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

            //mock dependencies:
            $cordovaGoogleAnalytics = jasmine.createSpyObj("$cordovaGoogleAnalytics", ["trackView"]);

            inject(function ($controller, $rootScope, $q, PostedTransactionModel, CommonService) {

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                mockPostedTransaction = TestUtils.getRandomPostedTransaction(PostedTransactionModel);

                ctrl = $controller("PostedTransactionDetailController", {
                    $scope                 : $scope,
                    $cordovaGoogleAnalytics: $cordovaGoogleAnalytics,
                    postedTransaction      : mockPostedTransaction,
                    globals                : mockGlobals
                });

                //setup spies:
                spyOn(CommonService, "waitForCordovaPlatform").and.callFake(function(callback) {
                    //just execute the callback directly
                    return $q.when((callback || function() {})());
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

            it("should call $cordovaGoogleAnalytics.trackView", function () {
                expect($cordovaGoogleAnalytics.trackView).toHaveBeenCalledWith(mockConfig.ANALYTICS.pageName);
            });

        });

    });

}());