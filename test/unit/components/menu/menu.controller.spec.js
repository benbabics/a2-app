(function () {
    "use strict";

    var $ionicHistory,
        $ionicSideMenuDelegate,
        ctrl,
        AuthenticationManager,
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
            }
        };

    describe("A Menu Controller", function () {

        beforeEach(function () {

            module("app.shared");

            module(function ($provide) {
                $provide.constant("globals", mockGlobals);
            });

            module("app.components");

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            // mock dependencies
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["logOut"]);
            $state = jasmine.createSpyObj("state", ["go"]);
            $ionicSideMenuDelegate = jasmine.createSpyObj("$ionicSideMenuDelegate", ["toggleRight"]);

            inject(function ($controller, _$ionicHistory_) {
                $ionicHistory = _$ionicHistory_;

                ctrl = $controller("MenuController", {
                    AuthenticationManager : AuthenticationManager,
                    $state                : $state,
                    $ionicSideMenuDelegate: $ionicSideMenuDelegate
                });
            });
        });

        describe("has an logOut function that", function () {
            beforeEach(function () {
                ctrl.logOut();
            });

            it("should log out the User", function () {
                expect(AuthenticationManager.logOut).toHaveBeenCalledWith();
            });

            it("should navigate to the login page", function () {
                expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE);
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