(function () {
    "use strict";

    var _,
        $scope,
        ctrl,
        mockCompletedPayments,
        mockPayments,
        mockScheduledPayments;

    describe("A Payment List Controller", function () {

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

            inject(function ($controller, $rootScope, BankModel, CommonService, PaymentModel) {

                _ = CommonService._;

                // setup mock objects
                mockCompletedPayments = getRandomNotScheduledPayments(PaymentModel, BankModel);
                mockScheduledPayments = getRandomScheduledPayments(PaymentModel, BankModel);

                mockPayments = {};
                _.forEach(mockCompletedPayments, function(payment) {
                    mockPayments[payment.id] = payment;
                });
                _.forEach(mockScheduledPayments, function(payment) {
                    mockPayments[payment.id] = payment;
                });

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentListController", {
                    $scope  : $scope,
                    payments: mockPayments
                });

            });

        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the completed payments", function () {
                expect(ctrl.completedPayments).toEqual(_.sortByOrder(mockCompletedPayments, ["scheduledDate"], ["desc"]));
            });

            it("should set the scheduled payments", function () {
                expect(ctrl.scheduledPayments).toEqual(_.sortByOrder(mockScheduledPayments, ["scheduledDate"], ["asc"]));
            });

        });

    });

    function getRandomNotScheduledPayments(PaymentModel, BankModel) {
        var mockPayment1 = TestUtils.getRandomPayment(PaymentModel, BankModel),
            mockPayment2 = TestUtils.getRandomPayment(PaymentModel, BankModel),
            mockPayment3 = TestUtils.getRandomPayment(PaymentModel, BankModel),
            mockPayment4 = TestUtils.getRandomPayment(PaymentModel, BankModel),
            mockPayment5 = TestUtils.getRandomPayment(PaymentModel, BankModel),
            mockPayment6 = TestUtils.getRandomPayment(PaymentModel, BankModel),
            mockPayment7 = TestUtils.getRandomPayment(PaymentModel, BankModel),
            mockPayment8 = TestUtils.getRandomPayment(PaymentModel, BankModel),
            mockPayment9 = TestUtils.getRandomPayment(PaymentModel, BankModel),
            mockPayment10 = TestUtils.getRandomPayment(PaymentModel, BankModel),
            mockPayments = {};

        mockPayments[mockPayment1.id] = mockPayment1;
        mockPayments[mockPayment2.id] = mockPayment2;
        mockPayments[mockPayment3.id] = mockPayment3;
        mockPayments[mockPayment4.id] = mockPayment4;
        mockPayments[mockPayment5.id] = mockPayment5;
        mockPayments[mockPayment6.id] = mockPayment6;
        mockPayments[mockPayment7.id] = mockPayment7;
        mockPayments[mockPayment8.id] = mockPayment8;
        mockPayments[mockPayment9.id] = mockPayment9;
        mockPayments[mockPayment10.id] = mockPayment10;

        return mockPayments;
    }

    function getRandomScheduledPayment(PaymentModel, BankModel) {
        var mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);

        mockPayment.status = "SCHEDULED";

        return mockPayment;
    }

    function getRandomScheduledPayments(PaymentModel, BankModel) {
        var mockPayment1 = getRandomScheduledPayment(PaymentModel, BankModel),
            mockPayment2 = getRandomScheduledPayment(PaymentModel, BankModel),
            mockPayment3 = getRandomScheduledPayment(PaymentModel, BankModel),
            mockPayment4 = getRandomScheduledPayment(PaymentModel, BankModel),
            mockPayment5 = getRandomScheduledPayment(PaymentModel, BankModel),
            mockPayment6 = getRandomScheduledPayment(PaymentModel, BankModel),
            mockPayment7 = getRandomScheduledPayment(PaymentModel, BankModel),
            mockPayments = {};

        mockPayments[mockPayment1.id] = mockPayment1;
        mockPayments[mockPayment2.id] = mockPayment2;
        mockPayments[mockPayment3.id] = mockPayment3;
        mockPayments[mockPayment4.id] = mockPayment4;
        mockPayments[mockPayment5.id] = mockPayment5;
        mockPayments[mockPayment6.id] = mockPayment6;
        mockPayments[mockPayment7.id] = mockPayment7;

        return mockPayments;
    }

}());