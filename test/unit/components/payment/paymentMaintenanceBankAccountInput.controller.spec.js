(function () {
    "use strict";

    var ctrl,
        scope,
        $ionicHistory,
        PaymentMaintenanceUtil,
        MockPaymentMaintenanceUtil,
        bankModel1,
        bankModel2,
        bankModel3,
        mockBankAccounts,
        mockPayment,
        mockGlobals = {
            LOCALSTORAGE : {
                "CONFIG": {
                    "keyPrefix": "FLEET_MANAGER-"
                },
                "KEYS": {
                    "LAST_BRAND_UPDATE_DATE": "LAST_BRAND_UPDATE_DATE"
                }
            },
            PAYMENT_MAINTENANCE_FORM: {
                "INPUTS": {
                    "BANK_ACCOUNT": {
                        "CONFIG": {
                            "title"            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "instructionalText": TestUtils.getRandomStringThatIsAlphaNumeric(30)
                        },
                        "ADD": {
                            "CONFIG": {
                                "ANALYTICS": {
                                    "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                }
                            }
                        },
                        "UPDATE": {
                            "CONFIG": {
                                "ANALYTICS": {
                                    "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                }
                            }
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
        maintenanceState,
        BankModel;

    describe("A Payment Maintenance Bank Account Input Controller", function () {

        beforeEach(function () {

            module(function ($provide, sharedGlobals, appGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, appGlobals, mockGlobals));
            });

            //mock dependencies:
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["goBack"]);
            MockPaymentMaintenanceUtil = jasmine.createSpyObj("PaymentMaintenanceUtil", ["getConfig"]);

            inject(function ($rootScope, $controller, $filter, $q, _BankModel_, PaymentModel, appGlobals, _PaymentMaintenanceUtil_) {

                scope = $rootScope.$new();
                BankModel = _BankModel_;
                PaymentMaintenanceUtil = _PaymentMaintenanceUtil_;

                mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);

                bankModel1 = TestUtils.getRandomBank(BankModel);
                bankModel2 = TestUtils.getRandomBank(BankModel);
                bankModel3 = TestUtils.getRandomBank(BankModel);

                mockBankAccounts = {};
                mockBankAccounts[bankModel1.id] = bankModel1;
                mockBankAccounts[bankModel2.id] = bankModel2;
                mockBankAccounts[bankModel3.id] = bankModel3;

                maintenanceState = TestUtils.getRandomValueFromMap(appGlobals.PAYMENT_MAINTENANCE.STATES);

                //mock calls to PaymentMaintenanceUtil to pass the maintenanceState explicitly
                MockPaymentMaintenanceUtil.getConfig.and.callFake(function (constants) {
                    return PaymentMaintenanceUtil.getConfig(constants, maintenanceState);
                });

                ctrl = $controller("PaymentMaintenanceBankAccountInputController", {
                    $ionicHistory         : $ionicHistory,
                    $scope                : scope,
                    PaymentMaintenanceUtil: MockPaymentMaintenanceUtil,
                    bankAccounts          : mockBankAccounts,
                    globals               : mockGlobals,
                    payment               : mockPayment
                });

            });
        });

        it("should set the config to the expected value", function () {
            expect(ctrl.config).toEqual(angular.extend(
                {},
                mockGlobals.BUTTONS.CONFIG,
                PaymentMaintenanceUtil.getConfig(mockGlobals.PAYMENT_MAINTENANCE_FORM.INPUTS.BANK_ACCOUNT, maintenanceState)
            ));
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
