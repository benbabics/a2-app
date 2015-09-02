(function () {
    "use strict";

    var $scope,
        ctrl,
        mockPostedTransaction = {
            transactionId     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            transactionDate   : TestUtils.getRandomDate(),
            postDate          : TestUtils.getRandomDate(),
            accountNumber     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            accountName       : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            cardNumber        : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            driverFirstName   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            driverMiddleName  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            driverLastName    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            customVehicleId   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            merchantBrand     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            merchantName      : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            merchantAddress   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            merchantCity      : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            merchantState     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            merchantZipCode   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            productDescription: TestUtils.getRandomStringThatIsAlphaNumeric(10),
            grossCost         : TestUtils.getRandomNumber(1, 9999),
            netCost           : TestUtils.getRandomNumber(1, 9999)
        };

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

            inject(function ($controller, $rootScope) {

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PostedTransactionDetailController", {
                    $scope           : $scope,
                    postedTransaction: mockPostedTransaction
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