(function () {
    "use strict";

    describe("A Core Module run block", function () {

        var $q,
            $rootScope,
            $state,
            mockGlobals = {
                LOGIN_STATE: "user.auth.login",
                AUTH_API: {
                    BASE_URL: "/someUrl",
                    AUTH: {
                        TOKENS: "uaa/oauth/token",
                        ME: "uaa/me"
                    },
                    CLIENT_CREDENTIALS: {
                        CLIENT_ID    : "Some_Client_Id",
                        CLIENT_SECRET: "Some_Client_Secret"
                    }
                },
                ACCOUNT_MAINTENANCE_API: {
                    BASE_URL: "/someAMRestUrl",
                    CARDS: {
                        BASE: "Cards_Base",
                        STATUS: "Status",
                        CHECK_STATUS_CHANGE: "Status_Change"
                    },
                    ACCOUNTS: {
                        BASE: "Accounts_Base"
                    },
                    BANKS: {
                        ACTIVE_BANKS: "Active_Banks"
                    },
                    INVOICES: {
                        CURRENT_INVOICE_SUMMARY: "Current_Invoice_Summary"
                    },
                    PAYMENTS: {
                        PAYMENT_ADD_AVAILABILITY: "Make_Payment_Availability"
                    },
                    USERS   : {
                        BASE   : "User_Base",
                        CURRENT: "Current_User"
                    }
                },
                NOTIFICATIONS: {
                    "serverConnectionError": "Server connection error",
                    "networkError"         : "Network error"
                },
                LOGGING: {
                    ENABLED: false
                },
                MENU: {
                    CONFIG: {
                        options: {
                        }
                    }
                },
                PAYMENT_ADD: {
                    CONFIG  : {},
                    WARNINGS: {
                        BANK_ACCOUNTS_NOT_SETUP  : "Banks Not Setup",
                        DIRECT_DEBIT_SETUP       : "Direct Debit Enabled",
                        PAYMENT_ALREADY_SCHEDULED: "Payment Already Scheduled"
                    }
                }
            },
            mockUser = {
                newField1: "some value",
                newField2: "some other value",
                newField3: "yet another value",
                email    : "email address value",
                firstName: "first name value",
                username : "username value",
                company  : {
                    accountId    : "company account id value",
                    accountNumber: "company account number value",
                    name         : "company name value"
                },
                billingCompany: {
                    accountId    : "billing company account id value",
                    accountNumber: "billing company account number value",
                    name         : "billing company name value"
                }
            },
            AuthenticationManager,
            PaymentAdd,
            CommonService,
            PaymentManager,
            UserManager;

        beforeEach(function () {

            spyOn(ionic.Platform, "fullScreen").and.callThrough();

            module("app.shared");

            module(function ($provide) {
                $provide.constant("globals", mockGlobals);
            });

            module("app.components");
            module("app.shared");
            module("app.html");

            // mock dependencies
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["logOut", "userLoggedIn"]);
            PaymentAdd = jasmine.createSpyObj("PaymentAdd", ["getOrCreatePaymentAdd"]);
            CommonService = jasmine.createSpyObj("CommonService", ["closeAlert", "displayAlert", "loadingBegin", "loadingComplete"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["fetchPaymentAddAvailability"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);

            module(function($provide) {
                $provide.value("AuthenticationManager", AuthenticationManager);
                $provide.value("PaymentAdd", PaymentAdd);
                $provide.value("CommonService", CommonService);
                $provide.value("PaymentManager", PaymentManager);
                $provide.value("UserManager", UserManager);
            });

            inject(function (_$q_, _$rootScope_, _$state_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;

                spyOn($rootScope, "$on").and.callThrough();
            });

        });

        it("should set the app to fullscreen with a status bar", function() {
            expect(ionic.Platform.fullScreen).toHaveBeenCalledWith(true, true);
        });

        describe("should set a $stateChangeStart event handler that", function () {
            var landingRoute = "landing",
                paymentAddRoute = "payment.add";

            //TODO - the module's run block finishes before the spy can be injected into $rootScope
            //Figure out how to test this
            xit("should be set on the $stateChangeStart event", function () {
                expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeStart", jasmine.any(Function));
            });

            describe("when the user is logged in", function () {

                beforeEach(function () {
                    AuthenticationManager.userLoggedIn.and.returnValue(true);
                });

                describe("when the user is navigating to the login page", function () {

                    beforeEach(function () {
                        $state.go(mockGlobals.LOGIN_STATE);
                        $rootScope.$digest();
                    });

                    it("should continue to the page", function () {
                        expect($state.current.name).toEqual(mockGlobals.LOGIN_STATE);
                    });
                });

                describe("when the user is navigating to the landing page", function () {

                    beforeEach(function () {
                        $state.go(landingRoute);
                        $rootScope.$digest();
                    });

                    //TODO - figure out why this doesn't work. The resolve method does not seem to be getting called
                    xit("should continue to the page", function () {
                        expect($state.current.name).toEqual(landingRoute);
                    });
                });

                describe("when the user is navigating to the payment add page", function () {
                    var activeBanks = [],
                        paymentAddAvailability = {},
                        getOrFetchPaymentAddDeferred,
                        fetchPaymentAddAvailabilityDeferred;

                    describe("when bank accounts have NOT been setup", function () {

                        beforeEach(function () {
                            paymentAddAvailability = {
                                makePaymentAllowed: false,
                                shouldDisplayBankAccountSetupMessage: true,
                                shouldDisplayDirectDebitEnabledMessage: false,
                                shouldDisplayOutstandingPaymentMessage: false
                            };

                            fetchPaymentAddAvailabilityDeferred = $q.defer();
                            PaymentManager.fetchPaymentAddAvailability.and.returnValue(fetchPaymentAddAvailabilityDeferred.promise);
                            fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);

                            UserManager.getUser.and.returnValue(mockUser);

                            $state.go(paymentAddRoute);
                            $rootScope.$digest();
                        });

                        it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                            expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                        });

                        it("should call CommonService.displayAlert", function () {
                            expect(CommonService.displayAlert).toHaveBeenCalledWith({
                                cssClass: "wex-warning-popup",
                                content: mockGlobals.PAYMENT_ADD.WARNINGS.BANK_ACCOUNTS_NOT_SETUP,
                                buttonCssClass: "button-submit"
                            });
                        });
                    });

                    describe("when direct debit has been setup", function () {

                        beforeEach(function () {
                            paymentAddAvailability = {
                                makePaymentAllowed: false,
                                shouldDisplayBankAccountSetupMessage: false,
                                shouldDisplayDirectDebitEnabledMessage: true,
                                shouldDisplayOutstandingPaymentMessage: false
                            };

                            fetchPaymentAddAvailabilityDeferred = $q.defer();
                            PaymentManager.fetchPaymentAddAvailability.and.returnValue(fetchPaymentAddAvailabilityDeferred.promise);
                            fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);

                            UserManager.getUser.and.returnValue(mockUser);

                            $state.go(paymentAddRoute);
                            $rootScope.$digest();
                        });

                        it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                            expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                        });

                        it("should call CommonService.displayAlert", function () {
                            expect(CommonService.displayAlert).toHaveBeenCalledWith({
                                cssClass: "wex-warning-popup",
                                content: mockGlobals.PAYMENT_ADD.WARNINGS.DIRECT_DEBIT_SETUP,
                                buttonCssClass: "button-submit"
                            });
                        });
                    });

                    describe("when a payment has already been scheduled", function () {

                        beforeEach(function () {
                            paymentAddAvailability = {
                                makePaymentAllowed: false,
                                shouldDisplayBankAccountSetupMessage: false,
                                shouldDisplayDirectDebitEnabledMessage: false,
                                shouldDisplayOutstandingPaymentMessage: true
                            };

                            fetchPaymentAddAvailabilityDeferred = $q.defer();
                            PaymentManager.fetchPaymentAddAvailability.and.returnValue(fetchPaymentAddAvailabilityDeferred.promise);
                            fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);

                            UserManager.getUser.and.returnValue(mockUser);

                            $state.go(paymentAddRoute);
                            $rootScope.$digest();
                        });

                        it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                            expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                        });

                        it("should call CommonService.displayAlert", function () {
                            expect(CommonService.displayAlert).toHaveBeenCalledWith({
                                cssClass: "wex-warning-popup",
                                content: mockGlobals.PAYMENT_ADD.WARNINGS.PAYMENT_ALREADY_SCHEDULED,
                                buttonCssClass: "button-submit"
                            });
                        });
                    });

                    describe("when no messages should be displayed", function () {

                        beforeEach(function () {
                            paymentAddAvailability = {
                                makePaymentAllowed: true,
                                shouldDisplayBankAccountSetupMessage: false,
                                shouldDisplayDirectDebitEnabledMessage: false,
                                shouldDisplayOutstandingPaymentMessage: false
                            };

                            fetchPaymentAddAvailabilityDeferred = $q.defer();
                            PaymentManager.fetchPaymentAddAvailability.and.returnValue(fetchPaymentAddAvailabilityDeferred.promise);
                            fetchPaymentAddAvailabilityDeferred.resolve(paymentAddAvailability);

                            getOrFetchPaymentAddDeferred = $q.defer();
                            PaymentAdd.getOrCreatePaymentAdd.and.returnValue(getOrFetchPaymentAddDeferred.promise);
                            getOrFetchPaymentAddDeferred.resolve(activeBanks);

                            UserManager.getUser.and.returnValue(mockUser);

                            $state.go(paymentAddRoute);
                            $rootScope.$digest();
                        });

                        it("should call PaymentAdd.getOrCreatePaymentAdd", function () {
                            expect(PaymentAdd.getOrCreatePaymentAdd).toHaveBeenCalledWith();
                        });

                        it("should call PaymentManager.fetchPaymentAddAvailability", function () {
                            expect(PaymentManager.fetchPaymentAddAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                        });

                        it("should continue to the page", function () {
                            expect($state.current.name).toEqual(paymentAddRoute);
                        });

                    });

                });
            });

            describe("when the user is NOT logged in", function () {

                beforeEach(function () {
                    AuthenticationManager.userLoggedIn.and.returnValue(false);
                });

                describe("when the user is navigating to the login page", function () {

                    beforeEach(function () {
                        $state.go(mockGlobals.LOGIN_STATE);
                        $rootScope.$digest();
                    });

                    it("should continue to the page", function () {
                        expect($state.current.name).toEqual(mockGlobals.LOGIN_STATE);
                    });
                });

                describe("when the user is navigating to the landing page", function () {

                    beforeEach(function () {
                        $state.go(landingRoute);
                        $rootScope.$digest();
                    });

                    it("should redirect to the login page", function () {
                        expect($state.current.name).toEqual(mockGlobals.LOGIN_STATE);
                    });
                });

                describe("when the user is navigating to the payment add page", function () {

                    beforeEach(function () {
                        $state.go(paymentAddRoute);
                        $rootScope.$digest();
                    });

                    it("should redirect to the login page", function () {
                        expect($state.current.name).toEqual(mockGlobals.LOGIN_STATE);
                    });
                });
            });
        });

        describe("has a cordovaPause event handler function that", function () {

            beforeEach(function() {
                $rootScope.$broadcast("cordovaPause");
            });

            it("should log out the User", function () {
                expect(AuthenticationManager.logOut).toHaveBeenCalledWith();
            });

        });

        describe("has a cordovaResume event handler function that", function () {

            beforeEach(function() {
                spyOn($state, "go");

                $rootScope.$broadcast("cordovaResume");
            });

            it("should close an alert", function () {
                expect(CommonService.closeAlert).toHaveBeenCalledWith();
            });

            it("should redirect to the login page", function () {
                expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE);
            });

        });
    });
})();