(function () {
    "use strict";

    var _,
        $ionicSideMenuDelegate,
        ctrl,
        Navigation,
        $state,
        appGlobals,
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
        };

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
            Navigation = jasmine.createSpyObj("Navigation", ["goToCards", "goToContactUs", "goToHome", "goToLogOut", "goToMakePayment",
                                                             "goToPaymentActivity", "goToPrivacyPolicy", "goToTermsOfUse", "goToTransactionActivity"]);
            $ionicSideMenuDelegate = jasmine.createSpyObj("$ionicSideMenuDelegate", ["toggleRight"]);
            $state = {
                current : {
                    name : ""
                }
            };
            inject(function ($controller, ___, _appGlobals_) {
                _ = ___;
                appGlobals = _appGlobals_;

                ctrl = $controller("MenuController", {
                    $ionicSideMenuDelegate: $ionicSideMenuDelegate,
                    $state                : $state,
                    Navigation            : Navigation
                });
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

        describe("has a goToCards function that", function () {

            beforeEach(function () {
                ctrl.goToCards();
            });

            it("should navigate to the card list page", function () {
                expect(Navigation.goToCards).toHaveBeenCalledWith();
            });

        });

        describe("has a goToContactUs function that", function () {

            beforeEach(function () {
                ctrl.goToContactUs();
            });

            it("should navigate to the contact us page", function () {
                expect(Navigation.goToContactUs).toHaveBeenCalledWith();
            });

        });

        describe("has a goToHome function that", function () {

            beforeEach(function () {
                ctrl.goToHome();
            });

            it("should navigate to the home page", function () {
                expect(Navigation.goToHome).toHaveBeenCalledWith();
            });

        });

        describe("has a goToLogOut function that", function () {

            beforeEach(function () {
                ctrl.goToLogOut();
            });

            it("should navigate to the login page", function () {
                expect(Navigation.goToLogOut).toHaveBeenCalledWith();
            });

        });

        describe("has a goToMakePayment function that", function () {

            beforeEach(function () {
                ctrl.goToMakePayment();
            });

            it("should navigate to the make payment page", function () {
                expect(Navigation.goToMakePayment).toHaveBeenCalledWith();
            });

        });

        describe("has a goToPaymentActivity function that", function () {

            beforeEach(function () {
                ctrl.goToPaymentActivity();
            });

            it("should navigate to the payment list page", function () {
                expect(Navigation.goToPaymentActivity).toHaveBeenCalledWith();
            });

        });

        describe("has a goToPrivacyPolicy function that", function () {

            beforeEach(function () {
                ctrl.goToPrivacyPolicy();
            });

            it("should navigate to the privacy policy page", function () {
                expect(Navigation.goToPrivacyPolicy).toHaveBeenCalledWith();
            });

        });

        describe("has a goToTermsOfUse function that", function () {

            beforeEach(function () {
                ctrl.goToTermsOfUse();
            });

            it("should navigate to the terms of use page", function () {
                expect(Navigation.goToTermsOfUse).toHaveBeenCalledWith();
            });

        });

        describe("has a goToTransactionActivity function that", function () {

            beforeEach(function () {
                ctrl.goToTransactionActivity();
            });

            it("should navigate to the transaction activity list page", function () {
                expect(Navigation.goToTransactionActivity).toHaveBeenCalledWith();
            });

        });

        describe("has a currentStateHasRoot function that", function () {

            describe("when the current state does begin with the passed root", function () {

                it("should return TRUE", function () {

                    _.forEach(appGlobals.MENU.CONFIG.rootStates, function (root) {
                        $state.current.name = root + "." + TestUtils.getRandomStringThatIsAlphaNumeric(12);
                        expect(ctrl.currentStateHasRoot(root)).toBe(true);
                    });
                });
            });

            describe("when the current state does NOT begin with the passed root", function () {

                it("should return FALSE", function () {

                    _.forEach(appGlobals.MENU.CONFIG.rootStates, function (root) {
                        $state.current.name = TestUtils.getRandomStringThatIsAlphaNumeric(root.length - 1) + "." + root;
                        expect(ctrl.currentStateHasRoot(root)).toBe(false);
                    });
                });
            });
        });
    });
}());
