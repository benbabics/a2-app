(function () {
    "use strict";

    var $rootScope,
        $timeout,
        $ionicSideMenuDelegate,
        ctrl,
        Navigation,
        $state,
        appGlobals,
        Fingerprint,
        fingerprintAvailableDeferred,
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

            module(function ($provide, sharedGlobals, appGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, appGlobals, mockGlobals));
            });

            module(["$provide", _.partial(TestUtils.provideCommonMockDependencies, _)]);

            // mock dependencies
            Navigation = jasmine.createSpyObj("Navigation", ["goToCards", "goToContactUs", "goToHome", "goToLogOut", "goToMakePayment",
                                                             "goToPaymentActivity", "goToPrivacyPolicy", "goToSettings", "goToTermsOfUse", "goToTransactionActivity"]);
            $ionicSideMenuDelegate = jasmine.createSpyObj("$ionicSideMenuDelegate", ["toggleRight"]);
            Fingerprint = jasmine.createSpyObj("Fingerprint", ["isAvailable"]);
            $state = {
                current : {
                    name : ""
                }
            };

            inject(function (_$rootScope_, _$timeout_, $q, $controller, _appGlobals_) {
                appGlobals = _appGlobals_;
                $rootScope = _$rootScope_;
                $timeout   = _$timeout_;

                //setup spies:
                fingerprintAvailableDeferred = $q.defer();

                //setup mocks:
                Fingerprint.isAvailable.and.returnValue( fingerprintAvailableDeferred.promise );

                ctrl = $controller("MenuController", {
                    $ionicSideMenuDelegate: $ionicSideMenuDelegate,
                    $state                : $state,
                    Navigation            : Navigation,
                    Fingerprint           : Fingerprint
                });
            });
        });

        describe("has a property vm.fingerprintAuthAvailable that", function () {
            describe("when fingerprint authentication is available", function () {
                beforeEach(function () {
                    $timeout.flush();
                    fingerprintAvailableDeferred.resolve();
                    $rootScope.$digest();
                });

                it("should set to true", function () {
                    expect( ctrl.fingerprintAuthAvailable ).toBe( true );
                });
            });

            describe("when fingerprint authentication is NOT available", function () {
                beforeEach(function () {
                    $timeout.flush();
                    fingerprintAvailableDeferred.reject();
                    $rootScope.$digest();
                });

                it("should set to false", function () {
                    expect( ctrl.fingerprintAuthAvailable ).toBe( false );
                });
            });
        });

        describe("has a navigate function that", function () {

            ["goToCards",
                "goToContactUs",
                "goToHome",
                "goToLogOut",
                "goToMakePayment",
                "goToPaymentActivity",
                "goToPrivacyPolicy",
                "goToSettings",
                "goToTermsOfUse",
                "goToTransactionActivity"
            ].forEach(function (target) {

                it("should navigate to the correct target page: " + target, function () {
                    ctrl.navigate(target);
                    $timeout.flush(100);
                    expect(Navigation[target]).toHaveBeenCalledWith();
                });

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
