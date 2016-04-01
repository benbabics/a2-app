(function () {
    "use strict";

    var $ionicHistory,
        $q,
        $rootScope,
        Navigation,
        LoginManager,
        AnalyticsUtil,
        $state,
        $location,
        mockGlobals = {
            LOGIN_STATE            : "user.auth.login",
            AUTH_API               : {
                BASE_URL          : "/someUrl",
                AUTH              : {
                    TOKENS: "uaa/oauth/token",
                    ME    : "uaa/me"
                },
                CLIENT_CREDENTIALS: {
                    CLIENT_ID    : "Some_Client_Id",
                    CLIENT_SECRET: "Some_Client_Secret"
                }
            },
            LOCALSTORAGE           : {
                "CONFIG": {
                    "keyPrefix": "FLEET_MANAGER-"
                },
                "KEYS"  : {
                    "LAST_BRAND_UPDATE_DATE": "LAST_BRAND_UPDATE_DATE"
                }
            },
            ACCOUNT_MAINTENANCE_API: {
                BASE_URL: "/someAMRestUrl",
                CARDS   : {
                    BASE               : "Cards_Base",
                    STATUS             : "Status",
                    CHECK_STATUS_CHANGE: "Status_Change"
                },
                ACCOUNTS: {
                    BASE: "Accounts_Base"
                },
                BANKS   : {
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
            PAYMENT                : {
                STATUS: {
                    "CANCELLED": "CANCELLED",
                    "COMPLETE" : "COMPLETE",
                    "SCHEDULED": "SCHEDULED",
                    "PENDING"  : "PENDING",
                    "UNKNOWN"  : "UNKNOWN"
                }
            },
            NOTIFICATIONS          : {
                "serverConnectionError": "Server connection error",
                "networkError"         : "Network error"
            },
            LOGGING                : {
                ENABLED: false
            },
            MENU                   : {
                CONFIG: {
                    options: {}
                }
            },
            GOOGLE_ANALYTICS       : {
                TRACKING_ID: TestUtils.getRandomStringThatIsAlphaNumeric(10)
            }
        },
        rejectHandler,
        resolveHandler;

    describe("A Navigation Service", function () {

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
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", [
                "getActiveTrackerId",
                "hasActiveTracker",
                "setUserId",
                "startTracker",
                "trackEvent",
                "trackView"
            ]);

            module(function ($provide) {
                $provide.value("LoginManager", LoginManager);
                $provide.value("$state", $state);
                $provide.value("$location", $location);
                $provide.value("AnalyticsUtil", AnalyticsUtil);
            });

            inject(function ($controller, _$ionicHistory_, _$q_, _$rootScope_, _Navigation_) {
                $ionicHistory = _$ionicHistory_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                Navigation = _Navigation_;
            });

            //setup spies
            LoginManager.logOut.and.returnValue($q.resolve());
            $state.go.and.returnValue($q.resolve());
            spyOn($ionicHistory, "clearCache").and.returnValue($q.resolve());
            rejectHandler = jasmine.createSpy("rejectHandler");
            resolveHandler = jasmine.createSpy("resolveHandler");
        });

        describe("has a goToCards function that", function () {

            describe("when given params", function () {
                var params;

                beforeEach(function () {
                    params = TestUtils.getRandomMap();
                });

                beforeEach(function () {
                    Navigation.goToCards(params)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should call $ionicHistory.clearCache", function () {
                    expect($ionicHistory.clearCache).toHaveBeenCalledWith();
                });

                it("should navigate to the card list page and reload it", function () {
                    expect($state.go).toHaveBeenCalledWith("card.list", params, {
                        reload : true,
                        inherit: false,
                        notify : true
                    });
                });

                it("should call the resolve handler", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });
            });

            describe("when NOT given params", function () {

                beforeEach(function () {
                    Navigation.goToCards()
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should call $ionicHistory.clearCache", function () {
                    expect($ionicHistory.clearCache).toHaveBeenCalledWith();
                });

                it("should navigate to the card list page and reload it", function () {
                    expect($state.go).toHaveBeenCalledWith("card.list", undefined, {
                        reload : true,
                        inherit: false,
                        notify : true
                    });
                });

                it("should call the resolve handler", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });
            });
        });

        describe("has a goToContactUs function that", function () {

            beforeEach(function () {
                Navigation.goToContactUs()
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

        describe("has a goToHome function that", function () {

            beforeEach(function () {
                Navigation.goToHome()
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

        describe("has a goToLogOut function that", function () {

            describe("when given params", function () {
                var params;

                beforeEach(function () {
                    params = TestUtils.getRandomMap();
                });

                beforeEach(function () {
                    Navigation.goToLogOut(params)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should log out the User", function () {
                    expect(LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should navigate to the login page", function () {
                    expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE, params);
                });

                it("should call the resolve handler", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });
            });

            describe("when NOT given params", function () {

                beforeEach(function () {
                    Navigation.goToLogOut()
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should log out the User", function () {
                    expect(LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should navigate to the login page", function () {
                    expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE, undefined);
                });

                it("should call the resolve handler", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });
            });
        });

        describe("has a goToMakePayment function that", function () {

            beforeEach(function () {
                Navigation.goToMakePayment()
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

            describe("when given params", function () {
                var params;

                beforeEach(function () {
                    params = TestUtils.getRandomMap();
                });

                beforeEach(function () {
                    Navigation.goToPaymentActivity(params)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should call $ionicHistory.clearCache", function () {
                    expect($ionicHistory.clearCache).toHaveBeenCalledWith();
                });

                it("should navigate to the payment list page and reload it", function () {
                    expect($state.go).toHaveBeenCalledWith("payment.list.view", params, {
                        reload : true,
                        inherit: false,
                        notify : true
                    });
                });

                it("should call the resolve handler", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });
            });

            describe("when NOT given params", function () {

                beforeEach(function () {
                    Navigation.goToPaymentActivity()
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should call $ionicHistory.clearCache", function () {
                    expect($ionicHistory.clearCache).toHaveBeenCalledWith();
                });

                it("should navigate to the payment list page and reload it", function () {
                    expect($state.go).toHaveBeenCalledWith("payment.list.view", undefined, {
                        reload : true,
                        inherit: false,
                        notify : true
                    });
                });

                it("should call the resolve handler", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });
            });
        });

        describe("has a goToPrivacyPolicy function that", function () {

            beforeEach(function () {
                Navigation.goToPrivacyPolicy()
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

        describe("has a goToTermsOfUse function that", function () {

            beforeEach(function () {
                Navigation.goToTermsOfUse()
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

        describe("has a goToTransactionActivity function that", function () {

            describe("when given params", function () {
                var params;

                beforeEach(function () {
                    params = TestUtils.getRandomMap();
                });

                beforeEach(function () {
                    Navigation.goToTransactionActivity(params)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should call $ionicHistory.clearCache", function () {
                    expect($ionicHistory.clearCache).toHaveBeenCalledWith();
                });

                it("should navigate to the transaction list page and reload it", function () {
                    expect($state.go).toHaveBeenCalledWith("transaction.list", params, {
                        reload : true,
                        inherit: false,
                        notify : true
                    });
                });

                it("should call the resolve handler", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });
            });

            describe("when NOT given params", function () {

                beforeEach(function () {
                    Navigation.goToTransactionActivity()
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should call $ionicHistory.clearCache", function () {
                    expect($ionicHistory.clearCache).toHaveBeenCalledWith();
                });

                it("should navigate to the transaction list page and reload it", function () {
                    expect($state.go).toHaveBeenCalledWith("transaction.list", undefined, {
                        reload : true,
                        inherit: false,
                        notify : true
                    });
                });

                it("should call the resolve handler", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });
            });
        });

        describe("has an isSecuredState function that", function () {
            var stateName;

            describe("when the given state is the login state", function () {

                beforeEach(function () {
                    stateName = mockGlobals.LOGIN_STATE;
                });

                it("should return false", function () {
                    expect(Navigation.isSecuredState(stateName)).toBeFalsy();
                });
            });

            describe("when the given state is the version.status state", function () {

                beforeEach(function () {
                    stateName = "version.status";
                });

                it("should return false", function () {
                    expect(Navigation.isSecuredState(stateName)).toBeFalsy();
                });
            });

            describe("when the given state is the app.exit state", function () {

                beforeEach(function () {
                    stateName = "app.exit";
                });

                it("should return false", function () {
                    expect(Navigation.isSecuredState(stateName)).toBeFalsy();
                });
            });

            describe("when the given state is NOT an unsecured state", function () {

                beforeEach(function () {
                    stateName = "card.list";
                });

                it("should return true", function () {
                    expect(Navigation.isSecuredState(stateName)).toBeTruthy();
                });
            });
        });

    });

}());
