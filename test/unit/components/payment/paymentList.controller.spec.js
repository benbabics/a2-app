(function () {
    "use strict";

    var _,
        $scope,
        CommonService,
        ctrl,
        mockCompletedPayments,
        mockPayments,
        mockScheduledPayments,
        mockGlobals = {
            "PAYMENT_LIST": {
                "CONFIG"        : {
                    "ANALYTICS"                 : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "title"                     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "scheduledPaymentsHeading"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "noScheduledPaymentsMessage": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "completedPaymentsHeading"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "noCompletedPaymentsMessage": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                },
                "SEARCH_OPTIONS": {
                    "PAGE_NUMBER": TestUtils.getRandomInteger(0, 20),
                    "PAGE_SIZE"  : TestUtils.getRandomInteger(1, 100)
                }
            }
        },
        mockConfig = mockGlobals.PAYMENT_LIST.CONFIG;

    // TODO: Fix this test by mocking indexedDB
    xdescribe("A Payment List Controller", function () {

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

            inject(function ($controller, $rootScope, $q, BankModel, PaymentModel, _CommonService_) {

                CommonService = _CommonService_;
                _ = CommonService._;

                // setup mock objects
                mockCompletedPayments = getRandomNotScheduledPayments(PaymentModel, BankModel);
                mockScheduledPayments = getRandomScheduledPayments(PaymentModel, BankModel);
                mockPayments = _.union(mockCompletedPayments, mockScheduledPayments);

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentListController", {
                    $scope  : $scope,
                    payments: mockPayments,
                    globals : mockGlobals
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
        var i,
            mockPaymentCollection,
            numModels;

        mockPaymentCollection = [];
        numModels = TestUtils.getRandomInteger(1, 100);
        for (i = 0; i < numModels; ++i) {
            mockPaymentCollection.push(TestUtils.getRandomPayment(PaymentModel, BankModel));
        }

        return mockPaymentCollection;
    }

    function getRandomScheduledPayment(PaymentModel, BankModel) {
        var mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);

        mockPayment.status = "SCHEDULED";

        return mockPayment;
    }

    function getRandomScheduledPayments(PaymentModel, BankModel) {
        var i,
            mockPaymentCollection,
            numModels;

        mockPaymentCollection = [];
        numModels = TestUtils.getRandomInteger(1, 100);
        for (i = 0; i < numModels; ++i) {
            mockPaymentCollection.push(getRandomScheduledPayment(PaymentModel, BankModel));
        }

        return mockPaymentCollection;
    }

}());