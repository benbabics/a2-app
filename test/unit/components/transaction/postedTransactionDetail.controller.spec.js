(function () {
    "use strict";

    var $scope,
        ctrl,
        mockPostedTransaction;

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

            inject(function ($controller, $rootScope, PostedTransactionModel) {

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                mockPostedTransaction = TestUtils.getRandomPostedTransaction(PostedTransactionModel);

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