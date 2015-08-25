(function () {
    "use strict";

    var ctrl,
        scope,
        $ionicHistory,
        bankModel1,
        bankModel2,
        bankModel3,
        mockBankAccounts,
        mockPayment,
        mockGlobals = {
            PAYMENT_MAINTENANCE_FORM: {
                "INPUTS": {
                    "BANK_ACCOUNT": {
                        "CONFIG": {
                            "title"            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "instructionalText": TestUtils.getRandomStringThatIsAlphaNumeric(30)
                        }
                    }
                }
            },

            BUTTONS: {
                "CONFIG": {
                    "cancel": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                }
            }
        },
        BankModel;

    describe("A Payment Maintenance Bank Account Input Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components");

            module(function ($provide, sharedGlobals) {
                $provide.value("globals", angular.extend({}, mockGlobals, sharedGlobals));
            });

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            //mock dependencies:
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["goBack"]);

            inject(function ($rootScope, $controller, $filter, globals, _BankModel_, PaymentModel) {

                scope = $rootScope.$new();

                BankModel = _BankModel_;

                mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);

                bankModel1 = TestUtils.getRandomBank(BankModel);
                bankModel2 = TestUtils.getRandomBank(BankModel);
                bankModel3 = TestUtils.getRandomBank(BankModel);

                mockBankAccounts = {};
                mockBankAccounts[bankModel1.id] = bankModel1;
                mockBankAccounts[bankModel2.id] = bankModel2;
                mockBankAccounts[bankModel3.id] = bankModel3;

                ctrl = $controller("PaymentMaintenanceBankAccountInputController", {
                    $ionicHistory: $ionicHistory,
                    $scope       : scope,
                    bankAccounts : mockBankAccounts,
                    globals      : globals,
                    payment      : mockPayment
                });

            });
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the bank accounts", function () {
                expect(ctrl.bankAccounts).toEqual(mockBankAccounts);
            });
        });

        describe("has a selectBank function that", function () {

            describe("when the amount is greater than 0 but less than the current balance", function () {

                var selectedBankModel;

                beforeEach(function () {
                    selectedBankModel = TestUtils.getRandomBank(BankModel);

                    ctrl.selectBank(selectedBankModel);
                });

                it("should update the payment with the selected bank", function () {
                    expect(mockPayment.bankAccount).toEqual(selectedBankModel);
                });

                it("should go back to the previous page", function () {
                    expect($ionicHistory.goBack).toHaveBeenCalledWith();
                });

            });

        });

    });

}());