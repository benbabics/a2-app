(function () {
    "use strict";

    describe("A Payment Module Route Config", function () {

        var _,
            $injector,
            $location,
            $q,
            $rootScope,
            $state,
            mockBankAccounts,
            mockGlobals = {
                PAYMENT_MAINTENANCE: {
                    STATES: {
                        "ADD"   : "add",
                        "UPDATE": "update"
                    },
                    WARNINGS: {
                        BANK_ACCOUNTS_NOT_SETUP  : "Banks Not Setup",
                        DIRECT_DEBIT_SETUP       : "Direct Debit Enabled",
                        NO_BALANCE_DUE           : "No Current Balance",
                        PAYMENT_ALREADY_SCHEDULED: "Payment Already Scheduled",
                        DEFAULT                  : "We are unable to process your changes at this time."
                    }
                },
                LOCALSTORAGE : {
                    "CONFIG": {
                        "keyPrefix": "FLEET_MANAGER-"
                    },
                    "KEYS": {
                        "LAST_BRAND_UPDATE_DATE": "LAST_BRAND_UPDATE_DATE"
                    }
                },
                PAYMENT_MAINTENANCE_FORM: {
                    "CONFIG": {
                        "invoiceNumber"            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "invoiceNumberNotAvailable": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "paymentDueDate"           : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "currentBalance"           : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "statementBalance"         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "enterAmount"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "amount"                   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "bankAccount"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "scheduledDate"            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "scheduledDatePickerTitle" : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "submitButton"             : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "INPUTS": {
                        "AMOUNT"      : {
                            "CONFIG": {
                                "title": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            },
                            "ERRORS": {
                                "zeroPayment"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                "paymentTooLarge": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            },
                            "ADD"   : {
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
                        },
                        "DATE"        : {
                            "CONFIG": {
                                "maxFutureDays": TestUtils.getRandomInteger(1, 360)
                            }
                        },
                        "BANK_ACCOUNT": {
                            "CONFIG": {
                                "title"            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                "instructionalText": TestUtils.getRandomStringThatIsAlphaNumeric(20)
                            },
                            "ADD"   : {
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
                    },
                    "ADD"   : {
                        "CONFIG": {
                            "ANALYTICS": {
                                "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            },
                            "title"    : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    },
                    "UPDATE": {
                        "CONFIG": {
                            "ANALYTICS": {
                                "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            },
                            "title"    : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                },

                PAYMENT_LIST: {
                    "CONFIG"        : {
                        "ANALYTICS"                 : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "events"  : {
                                "paymentAddBankAccountsNotSetup"   : [
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                ],
                                "paymentAddDirectDebitSetup"       : [
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                ],
                                "paymentAddNoBalanceDue"           : [
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                ],
                                "paymentAddPaymentAlreadyScheduled": [
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                ]
                            }
                        },
                        "title"                     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "scheduledPaymentsHeading"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "noScheduledPaymentsMessage": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "completedPaymentsHeading"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "noCompletedPaymentsMessage": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "SEARCH_OPTIONS": {
                        "PAGE_NUMBER": TestUtils.getRandomInteger(0, 20),
                        "PAGE_SIZE"  : TestUtils.getRandomInteger(10, 100)
                    }
                },

                PAYMENT_VIEW: {
                    CONFIG: {
                        ANALYTICS: {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                },

                PAYMENT_MAINTENANCE_CONFIRMATION: {
                    "CONFIG": {
                        "title"           : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "confirmationText": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "amount"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "bankAccount"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "scheduledDate"   : TestUtils.getRandomDate(),
                        "activityButton"  : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "ADD"   : {
                        "CONFIG": {
                            "ANALYTICS"                 : {
                                "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            }
                        }
                    },

                    "UPDATE": {
                        "CONFIG": {
                            "ANALYTICS"                 : {
                                "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            }
                        }
                    }
                },

                PAYMENT_MAINTENANCE_SUMMARY: {
                    "CONFIG"  : {
                        "title"                : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "processingWarning"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "amount"               : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "bankAccount"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "scheduledDate"        : TestUtils.getRandomDate(),
                        "cancelButton"         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "submitButton"         : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "WARNINGS": {
                        "PAYMENT_AMOUNT_LESS_THAN_MINIMUM": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "PAYMENT_DATE_PAST_DUE_DATE"      : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "ADD"     : {
                        "CONFIG": {
                            "ANALYTICS"                 : {
                                "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            }
                        }
                    },
                    "UPDATE"  : {
                        "CONFIG": {
                            "ANALYTICS"                 : {
                                "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            }
                        }
                    }
                },

                "USER_LOGIN": {
                    "CONFIG": {
                        "ANALYTICS": {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "events"  : {
                                "successfulLogin"       : [
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                ],
                                "inactiveStatus"        : [
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                ],
                                "accountNotReadyStatus" : [
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                ],
                                "wrongCredentialsStatus": [
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                ],
                                "lockedPasswordStatus"  : [
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                ]
                            }
                        }
                    }
                },

                BUTTONS: {
                    "CONFIG": {
                        "cancel": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "done"  : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                },

                GOOGLE_ANALYTICS: {
                    TRACKING_ID: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                }
            },
            mockPayment,
            mockPayments,
            mockUser,
            BankManager,
            BankModel,
            PaymentManager,
            PaymentModel,
            InvoiceManager,
            InvoiceSummaryModel,
            Logger,
            UserManager,
            mockDefaultBank,
            mockHasMultipleBanks,
            mockInvoiceSummary,
            AnalyticsUtil,
            AuthenticationManager,
            LoginManager,
            Navigation,
            PaymentMaintenanceUtil;

        beforeEach(function () {

            module("app.shared");
            module("app.components", function ($provide, sharedGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, mockGlobals));
            });

            module(function ($provide, sharedGlobals, appGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, appGlobals, mockGlobals));
            });

            module("app.html");

            // mock dependencies
            BankManager = jasmine.createSpyObj("BankManager", ["getActiveBanks", "hasMultipleBanks", "getDefaultBank"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["fetchPayment", "fetchPaymentAddAvailability", "fetchPayments", "isPaymentEditable"]);
            Logger = jasmine.createSpyObj("Logger", ["debug", "enabled", "error"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", ["startTracker", "trackView", "trackEvent"]);
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["logOut", "userLoggedIn"]);
            LoginManager = jasmine.createSpyObj("LoginManager", ["logOut"]);
            Navigation = jasmine.createSpyObj("Navigation", ["goToPaymentActivity", "isUnsecuredState"]);

            module(function ($provide) {
                $provide.value("BankManager", BankManager);
                $provide.value("InvoiceManager", InvoiceManager);
                $provide.value("Logger", Logger);
                $provide.value("PaymentManager", PaymentManager);
                $provide.value("UserManager", UserManager);
                $provide.value("AnalyticsUtil", AnalyticsUtil);
                $provide.value("AuthenticationManager", AuthenticationManager);
                $provide.value("LoginManager", LoginManager);
                $provide.value("Navigation", Navigation);
            });

            inject(function (___, _$injector_, _$location_, _$q_, _$rootScope_, _$state_, _BankModel_, _InvoiceSummaryModel_,
                             _PaymentModel_, _PaymentMaintenanceUtil_, UserAccountModel, UserModel) {
                _ = ___;
                $injector = _$injector_;
                $location = _$location_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
                BankModel = _BankModel_;
                PaymentModel = _PaymentModel_;
                InvoiceSummaryModel = _InvoiceSummaryModel_;
                PaymentMaintenanceUtil = _PaymentMaintenanceUtil_;

                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);
            });

            // setup mock objects
            mockBankAccounts = getRandomBanks(BankModel);
            mockPayments = getRandomPayments(PaymentModel, BankModel);
            mockPayment = TestUtils.getRandomValueFromArray(mockPayments);
            mockHasMultipleBanks = TestUtils.getRandomBoolean();
            mockDefaultBank = TestUtils.getRandomBank(BankModel);
            mockInvoiceSummary = TestUtils.getRandomInvoiceSummary(InvoiceSummaryModel);

            BankManager.getActiveBanks.and.returnValue(mockBankAccounts);
            BankManager.getDefaultBank.and.returnValue($q.when(mockDefaultBank));
            PaymentManager.fetchPayment.and.returnValue($q.when(mockPayment));
            UserManager.getUser.and.returnValue(mockUser);
            BankManager.hasMultipleBanks.and.returnValue($q.when(mockHasMultipleBanks));
            InvoiceManager.getInvoiceSummary.and.returnValue(mockInvoiceSummary);
            AuthenticationManager.userLoggedIn.and.returnValue(true);

            //setup spies
            spyOn(PaymentMaintenanceUtil, "showPaymentError");

        });

        describe("has a payment state that", function () {
            var state,
                stateName = "payment";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/payment");
            });

            it("should have the expected template", function () {
                expect(state.template).toEqual("<ion-nav-view name='view'></ion-nav-view>");
            });
        });

        describe("has a payment.activity.list state that", function () {
            var state,
                stateName = "payment.activity.list";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/list");
            });

            it("should define a payment view", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment"]).toBeDefined();
                expect(state.views["view@payment"].template).toEqual("<ion-nav-view></ion-nav-view>");
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/payment/activity/list");
            });
        });

        describe("has a payment.activity.list.view state that", function () {
            var state,
                stateName = "payment.activity.list.view";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should be cached", function () {
                expect(state.cache).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("");
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/payment/activity/list");
            });
        });

        describe("has a payment.activity.detail state that", function () {
            var state,
                stateName = "payment.activity.detail";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/detail/:paymentId");
            });

            it("should define a view@payment", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName, {paymentId: "1234"})).toEqual("#/payment/activity/detail/1234");
            });

            describe("when navigated to", function () {

                var fetchPaymentDeferred,
                    fetchIsPaymentEditableDeferred,
                    mockPaymentId = TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    mockIsPaymentEditable = TestUtils.getRandomBoolean();

                beforeEach(function () {
                    fetchPaymentDeferred = $q.defer();
                    PaymentManager.fetchPayment.and.returnValue(fetchPaymentDeferred.promise);

                    fetchIsPaymentEditableDeferred = $q.defer();
                    PaymentManager.isPaymentEditable.and.returnValue(fetchIsPaymentEditableDeferred.promise);

                    UserManager.getUser.and.returnValue(mockUser);

                    $state.go(stateName, {paymentId: mockPaymentId});

                    fetchPaymentDeferred.resolve(mockPayment);
                    fetchIsPaymentEditableDeferred.resolve(mockIsPaymentEditable);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPayment", function () {
                    expect(PaymentManager.fetchPayment).toHaveBeenCalledWith(mockPaymentId);
                });

                it("should call PaymentManager.isPaymentEditable", function () {
                    expect(PaymentManager.isPaymentEditable).toHaveBeenCalledWith(mockUser.billingCompany.accountId, mockPayment);
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve the payment", function () {
                    $injector.invoke($state.current.views["view@payment"].resolve.payment)
                        .then(function (payment) {
                            expect(payment).toEqual(mockPayment);
                        });
                });

                it("should resolve isPaymentEditable", function () {
                    $injector.invoke($state.current.views["view@payment"].resolve.isPaymentEditable, null, {payment: mockPayment})
                        .then(function (isPaymentEditable) {
                            expect(isPaymentEditable).toEqual(mockIsPaymentEditable);
                        });
                });

                it("should call AnalyticsUtil.trackView", function () {
                    expect(AnalyticsUtil.trackView).toHaveBeenCalledWith(mockGlobals.PAYMENT_VIEW.CONFIG.ANALYTICS.pageName);
                });

            });

        });

        describe("has a payment.add state that", function () {
            var state,
                stateName = "payment.add";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should NOT be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/add");
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    $state.go(stateName);
                    $rootScope.$digest();
                });

                it("should transition to the payment.maintenance.form page in the add state", function () {
                    expect($state.current.name).toBe("payment.maintenance.form");

                    $injector.invoke(function ($stateParams) {
                        expect($stateParams).toEqual(jasmine.objectContaining({
                            maintenanceState: mockGlobals.PAYMENT_MAINTENANCE.STATES.ADD
                        }));
                    });
                });
            });
        });

        describe("has a payment.update state that", function () {
            var state,
                stateName = "payment.update";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should NOT be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/update/:paymentId");
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    $state.go(stateName, {paymentId: mockPayment.id});
                    $rootScope.$digest();
                });

                it("should transition to the payment.maintenance.form page in the update state", function () {
                    expect($state.current.name).toBe("payment.maintenance.form");

                    $injector.invoke(function ($stateParams) {
                        expect($stateParams).toEqual(jasmine.objectContaining({
                            maintenanceState: mockGlobals.PAYMENT_MAINTENANCE.STATES.UPDATE,
                            paymentId: mockPayment.id
                        }));
                    });
                });
            });
        });

        describe("has a payment.maintenance state that", function () {
            var state,
                stateName = "payment.maintenance";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should NOT be cached", function () {
                expect(state.cache).toBeDefined();
                expect(state.cache).toBeFalsy();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/maintenance/:maintenanceState?paymentId");
            });

            describe("when a child state is navigated to", function () {

                var maintenanceState,
                    childStateName = "payment.maintenance.confirmation";

                describe("when the maintenance state is ADD", function () {

                    beforeEach(function () {
                        maintenanceState = mockGlobals.PAYMENT_MAINTENANCE.STATES.ADD;

                        $state.go(childStateName, {
                            maintenanceState: maintenanceState,
                            paymentId       : mockPayment.id
                        });
                        $rootScope.$digest();
                    });

                    it("should set the maintenanceState data attribute to the expected state", function () {
                        expect($state.$current.data.maintenanceState).toEqual(maintenanceState);
                    });

                    it("should resolve a payment object as a new PaymentModel", function () {
                        $injector.invoke($state.$current.parent.resolve.payment)
                            .then(function (payment) {
                                expect(payment).toEqual(new PaymentModel());
                            });
                    });

                    describe("when the defaultBank is able to be resolved", function () {

                        beforeEach(function () {
                            BankManager.getDefaultBank.and.returnValue($q.when(mockDefaultBank));
                        });

                        it("should resolve defaultBank to the expected bank for the view", function () {
                            $injector.invoke($state.$current.parent.views["view@payment"].resolve.defaultBank)
                                .then(function (defaultBank) {
                                    expect(defaultBank).toEqual(mockDefaultBank);
                                });
                        });
                    });

                    describe("when the defaultBank is NOT able to be resolved", function () {
                        beforeEach(function () {
                            BankManager.getDefaultBank.and.returnValue($q.reject());

                            $injector.invoke($state.$current.parent.views["view@payment"].resolve.defaultBank);
                            $rootScope.$digest();
                        });

                        it("should redirect to the payment activity page", function () {
                            expect(Navigation.goToPaymentActivity).toHaveBeenCalledWith();
                        });
                    });
                });

                describe("when the maintenance state is UPDATE", function () {

                    beforeEach(function () {
                        maintenanceState = mockGlobals.PAYMENT_MAINTENANCE.STATES.UPDATE;

                        $state.go(childStateName, {
                            maintenanceState: maintenanceState,
                            paymentId       : mockPayment.id
                        });
                        $rootScope.$digest();
                    });

                    it("should set the maintenanceState data attribute to the expected state", function () {
                        expect($state.$current.data.maintenanceState).toEqual(maintenanceState);
                    });

                    describe("when the payment is able to be resolved", function () {

                        beforeEach(function () {
                            PaymentManager.fetchPayment.and.returnValue($q.when(mockPayment));
                        });

                        it("should resolve a payment object as a new PaymentModel", function () {
                            $injector.invoke($state.$current.parent.resolve.payment)
                                .then(function (payment) {
                                    expect(payment).toEqual(new PaymentModel());
                                });
                        });
                    });

                    describe("when the payment is NOT able to be resolved", function () {

                        beforeEach(function () {
                            PaymentManager.fetchPayment.and.returnValue($q.reject());

                            $injector.invoke($state.$current.parent.resolve.payment);
                            $rootScope.$digest();
                        });

                        it("should redirect to the payment activity page", function () {
                            expect(Navigation.goToPaymentActivity).toHaveBeenCalledWith();
                        });
                    });

                    describe("when the defaultBank is able to be resolved", function () {

                        beforeEach(function () {
                            BankManager.getDefaultBank.and.returnValue($q.when(mockDefaultBank));
                        });

                        it("should resolve defaultBank to the expected bank for the view", function () {
                            $injector.invoke($state.$current.parent.views["view@payment"].resolve.defaultBank)
                                .then(function (defaultBank) {
                                    expect(defaultBank).toEqual(mockDefaultBank);
                                });
                        });
                    });

                    describe("when the defaultBank is NOT able to be resolved", function () {

                        beforeEach(function () {
                            BankManager.getDefaultBank.and.returnValue($q.reject());

                            $injector.invoke($state.$current.parent.views["view@payment"].resolve.defaultBank);
                            $rootScope.$digest();
                        });

                        it("should redirect to the payment activity page", function () {
                            expect(Navigation.goToPaymentActivity).toHaveBeenCalledWith();
                        });
                    });
                });
            });
        });

        describe("has a payment.maintenance.form state that", function () {
            var state,
                stateName = "payment.maintenance.form";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/form");
            });

            it("should define a view@payment.maintenance", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment.maintenance"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toMatch(/#\/payment\/maintenance\/.*\/form/);
            });

            describe("when navigated to", function () {
                var maintenanceState;

                beforeEach(function () {
                    maintenanceState = getRandomMaintenanceState();

                    $state.go(stateName, {maintenanceState: maintenanceState});
                    $rootScope.$digest();
                });

                it("should call BankManager.hasMultipleBanks", function () {
                    expect(BankManager.hasMultipleBanks).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should call AnalyticsUtil.trackView", function () {
                    expect(AnalyticsUtil.trackView).toHaveBeenCalledWith(
                        PaymentMaintenanceUtil.getConfig(mockGlobals.PAYMENT_MAINTENANCE_FORM, maintenanceState).ANALYTICS.pageName
                    );
                });

            });

        });

        describe("has a payment.maintenance.summary state that", function () {
            var state,
                stateName = "payment.maintenance.summary";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/summary");
            });

            it("should define a view@payment.maintenance", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment.maintenance"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toMatch(/#\/payment\/maintenance\/.*\/summary/);
            });

            describe("when navigated to", function () {
                var maintenanceState;

                beforeEach(function () {
                    maintenanceState = getRandomMaintenanceState();

                    $state.go(stateName, {maintenanceState: maintenanceState});
                    $rootScope.$digest();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should call AnalyticsUtil.trackView", function () {
                    expect(AnalyticsUtil.trackView).toHaveBeenCalledWith(
                        PaymentMaintenanceUtil.getConfig(mockGlobals.PAYMENT_MAINTENANCE_SUMMARY, maintenanceState).ANALYTICS.pageName
                    );
                });

            });

        });

        describe("has a payment.maintenance.confirmation state that", function () {
            var state,
                stateName = "payment.maintenance.confirmation";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/confirmation");
            });

            it("should define a view@payment.maintenance", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment.maintenance"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toMatch(/#\/payment\/maintenance\/.*\/confirmation/);
            });

            describe("when navigated to", function () {
                var maintenanceState;

                beforeEach(function () {
                    maintenanceState = getRandomMaintenanceState();

                    $state.go(stateName, {maintenanceState: maintenanceState});
                    $rootScope.$digest();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should call AnalyticsUtil.trackView", function () {
                    expect(AnalyticsUtil.trackView).toHaveBeenCalledWith(
                        PaymentMaintenanceUtil.getConfig(mockGlobals.PAYMENT_MAINTENANCE_CONFIRMATION, maintenanceState).ANALYTICS.pageName
                    );
                });
            });

        });

        describe("has a payment.maintenance.input state that", function () {
            var state,
                stateName = "payment.maintenance.input";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should NOT be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect($state.href(stateName)).toMatch(/#\/payment\/maintenance\/.*\/input/);
            });
        });

        describe("has a payment.maintenance.input.amount state that", function () {
            var state,
                stateName = "payment.maintenance.input.amount";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should NOT be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should NOT be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/amount");
            });

            it("should define a view on the payment.maintenance view container", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment.maintenance"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toMatch(/#\/payment\/maintenance\/.*\/input\/amount/);
            });

            describe("when navigated to", function () {
                var maintenanceState;

                beforeEach(function () {
                    maintenanceState = getRandomMaintenanceState();

                    $state.go(stateName, {maintenanceState: maintenanceState});
                    $rootScope.$digest();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve invoiceSummary to the expected value", function () {
                    expect($injector.invoke($state.current.views["view@payment.maintenance"].resolve.invoiceSummary)).toEqual(mockInvoiceSummary);
                });

                it("should call AnalyticsUtil.trackView", function () {
                    expect(AnalyticsUtil.trackView).toHaveBeenCalledWith(
                        PaymentMaintenanceUtil.getConfig(mockGlobals.PAYMENT_MAINTENANCE_FORM.INPUTS.AMOUNT, maintenanceState).ANALYTICS.pageName
                    );
                });
            });
        });

        describe("has a payment.maintenance.input.bankAccount state that", function () {
            var state,
                stateName = "payment.maintenance.input.bankAccount";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should NOT be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should NOT be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/bankAccount");
            });

            it("should define a view on the payment.maintenance view container", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@payment.maintenance"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toMatch(/#\/payment\/maintenance\/.*\/input\/bankAccount/);
            });

            describe("when navigated to", function () {
                var maintenanceState;

                beforeEach(function () {
                    maintenanceState = getRandomMaintenanceState();

                    $state.go(stateName, {maintenanceState: maintenanceState});
                    $rootScope.$digest();
                });

                it("should call BankManager.getActiveBanks", function () {
                    expect(BankManager.getActiveBanks).toHaveBeenCalledWith();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should call AnalyticsUtil.trackView", function () {
                    expect(AnalyticsUtil.trackView).toHaveBeenCalledWith(
                        PaymentMaintenanceUtil.getConfig(mockGlobals.PAYMENT_MAINTENANCE_FORM.INPUTS.BANK_ACCOUNT, maintenanceState).ANALYTICS.pageName
                    );
                });

                describe("when the payment does not have a bank account", function () {

                    beforeEach(function () {
                        mockPayment.bankAccount = null;

                        $state.go(stateName);
                        $rootScope.$digest();
                    });

                    it("should resolve the bankAccounts", function () {
                        var expectedBankAccounts = _.sortBy(mockBankAccounts, "name");

                        expect($injector.invoke($state.current.views["view@payment.maintenance"].resolve.bankAccounts, null, {payment: mockPayment}))
                            .toEqual(expectedBankAccounts);
                    });

                });

                describe("when the payment has a bank account NOT in the collection", function () {

                    beforeEach(function () {
                        mockPayment.bankAccount = TestUtils.getRandomBank(BankModel);

                        $state.go(stateName);
                        $rootScope.$digest();
                    });

                    it("should resolve the bankAccounts", function () {
                        var expectedBankAccounts = _.sortBy(mockBankAccounts, "name");

                        expect($injector.invoke($state.current.views["view@payment.maintenance"].resolve.bankAccounts, null, {payment: mockPayment}))
                            .toEqual(expectedBankAccounts);
                    });

                });

                describe("when the payment has a bank account in the collection", function () {

                    beforeEach(function () {
                        mockPayment.bankAccount = TestUtils.getRandomValueFromArray(mockBankAccounts);

                        $state.go(stateName);
                        $rootScope.$digest();
                    });

                    it("should resolve the bankAccounts", function () {
                        var expectedBankAccounts;

                        _.remove(mockBankAccounts, function (bank) {
                            return bank.id === mockPayment.bankAccount.id;
                        });

                        expectedBankAccounts = _.sortBy(mockBankAccounts, "name");

                        expect($injector.invoke($state.current.views["view@payment.maintenance"].resolve.bankAccounts, null, {payment: mockPayment}))
                            .toEqual(expectedBankAccounts);
                    });

                });

            });

        });

        describe("has a URL handler for '/payment/add/verify' that", function () {

            var paymentAddVerifyPath = "/payment/add/verify",
                paymentAddAvailability = {},
                fetchPaymentAddAvailabilityDeferred;

            beforeEach(function () {
                fetchPaymentAddAvailabilityDeferred = $q.defer();
                PaymentManager.fetchPaymentAddAvailability.and.returnValue(fetchPaymentAddAvailabilityDeferred.promise);

                UserManager.getUser.and.returnValue(mockUser);
            });

            describe("when bank accounts have NOT been setup", function () {

                beforeEach(function () {
                    paymentAddAvailability = {
                        makePaymentAllowed                    : false,
                        shouldDisplayCurrentBalanceDueMessage : false,
                        shouldDisplayBankAccountSetupMessage  : true,
                        shouldDisplayDirectDebitEnabledMessage: false,
                        shouldDisplayOutstandingPaymentMessage: false
                    };

                    fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);
                });

                beforeEach(function () {
                    UserManager.getUser.and.returnValue(mockUser);
                    PaymentManager.fetchPayments.and.returnValue($q.when(mockPayments));

                    $location.path(paymentAddVerifyPath);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                    expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should call PaymentMaintenanceUtil.showPaymentError with the expected values", function () {
                    expect(PaymentMaintenanceUtil.showPaymentError).toHaveBeenCalledWith(
                        mockGlobals.PAYMENT_MAINTENANCE.WARNINGS.BANK_ACCOUNTS_NOT_SETUP,
                        mockGlobals.PAYMENT_LIST.CONFIG.ANALYTICS.events.paymentAddBankAccountsNotSetup
                    );
                });
            });

            describe("when direct debit has been setup", function () {

                beforeEach(function () {
                    paymentAddAvailability = {
                        makePaymentAllowed                    : false,
                        shouldDisplayCurrentBalanceDueMessage : false,
                        shouldDisplayBankAccountSetupMessage  : false,
                        shouldDisplayDirectDebitEnabledMessage: true,
                        shouldDisplayOutstandingPaymentMessage: false
                    };

                    fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);
                });

                beforeEach(function () {
                    UserManager.getUser.and.returnValue(mockUser);
                    PaymentManager.fetchPayments.and.returnValue($q.when(mockPayments));


                    $location.path(paymentAddVerifyPath);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                    expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should call PaymentMaintenanceUtil.showPaymentError with the expected values", function () {
                    expect(PaymentMaintenanceUtil.showPaymentError).toHaveBeenCalledWith(
                        mockGlobals.PAYMENT_MAINTENANCE.WARNINGS.DIRECT_DEBIT_SETUP,
                        mockGlobals.PAYMENT_LIST.CONFIG.ANALYTICS.events.paymentAddDirectDebitSetup
                    );
                });
            });

            describe("when a payment has already been scheduled", function () {

                beforeEach(function () {
                    paymentAddAvailability = {
                        makePaymentAllowed                    : false,
                        shouldDisplayCurrentBalanceDueMessage : false,
                        shouldDisplayBankAccountSetupMessage  : false,
                        shouldDisplayDirectDebitEnabledMessage: false,
                        shouldDisplayOutstandingPaymentMessage: true
                    };

                    fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);
                });

                beforeEach(function () {
                    UserManager.getUser.and.returnValue(mockUser);
                    PaymentManager.fetchPayments.and.returnValue($q.when(mockPayments));

                    $location.path(paymentAddVerifyPath);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                    expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should call PaymentMaintenanceUtil.showPaymentError with the expected values", function () {
                    expect(PaymentMaintenanceUtil.showPaymentError).toHaveBeenCalledWith(
                        mockGlobals.PAYMENT_MAINTENANCE.WARNINGS.PAYMENT_ALREADY_SCHEDULED,
                        mockGlobals.PAYMENT_LIST.CONFIG.ANALYTICS.events.paymentAddPaymentAlreadyScheduled
                    );
                });
            });

            describe("when the current balance due message should be displayed", function () {

                beforeEach(function () {
                    paymentAddAvailability = {
                        makePaymentAllowed                    : false,
                        shouldDisplayCurrentBalanceDueMessage : true,
                        shouldDisplayBankAccountSetupMessage  : false,
                        shouldDisplayDirectDebitEnabledMessage: false,
                        shouldDisplayOutstandingPaymentMessage: false
                    };

                    fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);
                });

                beforeEach(function () {
                    UserManager.getUser.and.returnValue(mockUser);
                    PaymentManager.fetchPayments.and.returnValue($q.when(mockPayments));

                    $location.path(paymentAddVerifyPath);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                    expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should call PaymentMaintenanceUtil.showPaymentError with the expected values", function () {
                    expect(PaymentMaintenanceUtil.showPaymentError).toHaveBeenCalledWith(
                        mockGlobals.PAYMENT_MAINTENANCE.WARNINGS.NO_BALANCE_DUE,
                        mockGlobals.PAYMENT_LIST.CONFIG.ANALYTICS.events.paymentAddNoBalanceDue
                    );
                });
            });

            describe("when no messages should be displayed", function () {
                var paymentAddState = "payment.add";

                beforeEach(function () {
                    paymentAddAvailability = {
                        makePaymentAllowed                    : true,
                        shouldDisplayCurrentBalanceDueMessage : false,
                        shouldDisplayBankAccountSetupMessage  : false,
                        shouldDisplayDirectDebitEnabledMessage: false,
                        shouldDisplayOutstandingPaymentMessage: false
                    };

                    fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);
                });

                beforeEach(function () {
                    UserManager.getUser.and.returnValue(mockUser);
                    PaymentManager.fetchPayments.and.returnValue($q.when(mockPayments));

                    spyOn($state, "go");

                    $location.path(paymentAddVerifyPath);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                    expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should redirect to the payment add state", function () {
                    expect($state.go).toHaveBeenCalledWith(paymentAddState);
                });

                it("should NOT call PaymentMaintenanceUtil.showPaymentError", function () {
                    expect(PaymentMaintenanceUtil.showPaymentError).not.toHaveBeenCalled();
                });

            });

            describe("when determining the payment add availability throws an error", function () {

                var errorResponse;

                beforeEach(function () {
                    errorResponse = TestUtils.getRandomStringThatIsAlphaNumeric(20);

                    fetchPaymentAddAvailabilityDeferred.reject(errorResponse);

                    $location.path(paymentAddVerifyPath);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                    expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should log the error", function () {
                    expect(Logger.error).toHaveBeenCalledWith("Failed to determine payment add availability: " + errorResponse);
                });

                it("should call Navigation.goToPaymentActivity", function () {
                    expect(Navigation.goToPaymentActivity).toHaveBeenCalledWith();
                });

            });

        });

        function getRandomBanks(BankModel) {
            var i,
                mockBankCollection,
                numModels;

            mockBankCollection = [];
            numModels = TestUtils.getRandomInteger(1, 100);
            for (i = 0; i < numModels; ++i) {
                mockBankCollection.push(TestUtils.getRandomBank(BankModel));
            }

            return mockBankCollection;
        }

        function getRandomMaintenanceState() {
            return TestUtils.getRandomValueFromMap(mockGlobals.PAYMENT_MAINTENANCE.STATES);
        }

        function getRandomPayments(PaymentModel, BankModel) {
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
    });

})();
