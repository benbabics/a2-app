(function () {
    "use strict";

    var $ionicHistory,
        $ionicSideMenuDelegate,
        $q,
        $rootScope,
        ctrl,
        LoginManager,
        $state,
        $location,
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
            LOCALSTORAGE : {
                "CONFIG": {
                    "keyPrefix": "FLEET_MANAGER-"
                },
                "KEYS": {
                    "LAST_BRAND_UPDATE_DATE": "LAST_BRAND_UPDATE_DATE"
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
            PAYMENT: {
                STATUS: {
                    "CANCELLED": "CANCELLED",
                    "COMPLETE" : "COMPLETE",
                    "SCHEDULED": "SCHEDULED",
                    "PENDING"  : "PENDING",
                    "UNKNOWN"  : "UNKNOWN"
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
            GOOGLE_ANALYTICS: {
                TRACKING_ID: TestUtils.getRandomStringThatIsAlphaNumeric(10)
            }
        },
        rejectHandler,
        resolveHandler;

    describe("A Menu Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");

            module("app.components", function ($provide, sharedGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, mockGlobals));
            });

            module(function ($provide, sharedGlobals, appGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, appGlobals, mockGlobals));
            });

            // mock dependencies
            LoginManager = jasmine.createSpyObj("LoginManager", ["logOut"]);
            $state = jasmine.createSpyObj("state", ["go"]);
            $location = jasmine.createSpyObj("$location", ["url"]);
            $ionicSideMenuDelegate = jasmine.createSpyObj("$ionicSideMenuDelegate", ["toggleRight"]);

            inject(function ($controller, _$ionicHistory_, _$q_, _$rootScope_) {
                $ionicHistory = _$ionicHistory_;
                $q = _$q_;
                $rootScope = _$rootScope_;

                ctrl = $controller("MenuController", {
                    LoginManager          : LoginManager,
                    $location             : $location,
                    $state                : $state,
                    $ionicSideMenuDelegate: $ionicSideMenuDelegate
                });
            });

            //setup spies
            LoginManager.logOut.and.returnValue($q.resolve());
            $state.go.and.returnValue($q.resolve());
            spyOn($ionicHistory, "clearCache").and.returnValue($q.resolve());
            rejectHandler = jasmine.createSpy("rejectHandler");
            resolveHandler = jasmine.createSpy("resolveHandler");
        });

        describe("has a goToHome function that", function () {

            beforeEach(function () {
                ctrl.goToHome()
                    .then(resolveHandler)
                    .catch(rejectHandler);

                $rootScope.$digest();
            });

            it("should navigate to the landing page", function () {
                expect($state.go).toHaveBeenCalledWith("landing");
            });

            it("should call the resolve handler", function () {
                expect(resolveHandler).toHaveBeenCalled();
            });
        });

        describe("has a goToMakePayment function that", function () {

            beforeEach(function () {
                ctrl.goToMakePayment()
                    .then(resolveHandler)
                    .catch(rejectHandler);

                $rootScope.$digest();
            });

            it("should navigate to /payment/add/verify", function () {
                expect($location.url).toHaveBeenCalledWith("/payment/add/verify");
            });

            it("should call the resolve handler", function () {
                expect(resolveHandler).toHaveBeenCalled();
            });
        });

        describe("has a goToPaymentActivity function that", function () {

            beforeEach(function () {
                ctrl.goToPaymentActivity()
                    .then(resolveHandler)
                    .catch(rejectHandler);

                $rootScope.$digest();
            });

            it("should call $ionicHistory.clearCache", function () {
                expect($ionicHistory.clearCache).toHaveBeenCalledWith();
            });

            it("should navigate to the payment list page and reload it", function () {
                expect($state.go).toHaveBeenCalledWith("payment.list.view", null, {
                    reload : true,
                    inherit: false,
                    notify : true
                });
            });

            it("should call the resolve handler", function () {
                expect(resolveHandler).toHaveBeenCalled();
            });
        });

        describe("has a goToTransactionActivity function that", function () {

            beforeEach(function () {
                ctrl.goToTransactionActivity()
                    .then(resolveHandler)
                    .catch(rejectHandler);

                $rootScope.$digest();
            });

            it("should navigate to the transaction list page", function () {
                expect($state.go).toHaveBeenCalledWith("transaction.list");
            });

            it("should call the resolve handler", function () {
                expect(resolveHandler).toHaveBeenCalled();
            });
        });

        describe("has a goToCards function that", function () {

            beforeEach(function () {
                ctrl.goToCards()
                    .then(resolveHandler)
                    .catch(rejectHandler);

                $rootScope.$digest();
            });

            it("should call $ionicHistory.clearCache", function () {
                expect($ionicHistory.clearCache).toHaveBeenCalledWith();
            });

            it("should navigate to the card list page and reload it", function () {
                expect($state.go).toHaveBeenCalledWith("card.list", null, {
                    reload : true,
                    inherit: false,
                    notify : true
                });
            });

            it("should call the resolve handler", function () {
                expect(resolveHandler).toHaveBeenCalled();
            });
        });

        describe("has a goToContactUs function that", function () {

            beforeEach(function () {
                ctrl.goToContactUs()
                    .then(resolveHandler)
                    .catch(rejectHandler);

                $rootScope.$digest();
            });

            it("should navigate to the contact us page", function () {
                expect($state.go).toHaveBeenCalledWith("contactUs");
            });

            it("should call the resolve handler", function () {
                expect(resolveHandler).toHaveBeenCalled();
            });
        });

        describe("has a goToTermsOfUse function that", function () {

            beforeEach(function () {
                ctrl.goToTermsOfUse()
                    .then(resolveHandler)
                    .catch(rejectHandler);

                $rootScope.$digest();
            });

            it("should navigate to the terms of use page", function () {
                expect($state.go).toHaveBeenCalledWith("termsOfUse");
            });

            it("should call the resolve handler", function () {
                expect(resolveHandler).toHaveBeenCalled();
            });
        });

        describe("has a goToPrivacyPolicy function that", function () {

            beforeEach(function () {
                ctrl.goToPrivacyPolicy()
                    .then(resolveHandler)
                    .catch(rejectHandler);

                $rootScope.$digest();
            });

            it("should navigate to the privacy policy page", function () {
                expect($state.go).toHaveBeenCalledWith("privacyPolicy");
            });

            it("should call the resolve handler", function () {
                expect(resolveHandler).toHaveBeenCalled();
            });
        });

        describe("has a goToLogOut function that", function () {

            beforeEach(function () {
                ctrl.goToLogOut()
                    .then(resolveHandler)
                    .catch(rejectHandler);

                $rootScope.$digest();
            });

            it("should log out the User", function () {
                expect(LoginManager.logOut).toHaveBeenCalledWith();
            });

            it("should navigate to the login page", function () {
                expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE);
            });

            it("should call the resolve handler", function () {
                expect(resolveHandler).toHaveBeenCalled();
            });
        });

        describe("has a closeMenu function that", function () {

            beforeEach(function () {
                ctrl.closeMenu();
            });

            it("should close the menu", function () {
                expect($ionicSideMenuDelegate.toggleRight).toHaveBeenCalledWith(false);
            });
        });

    });

}());
