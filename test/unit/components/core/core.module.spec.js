(function () {
    "use strict";

    describe("A Core Module run block", function () {

        var $q,
            $rootScope,
            $state,
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
                PAYMENT_MAINTENANCE            : {
                    WARNINGS: {
                        BANK_ACCOUNTS_NOT_SETUP  : "Banks Not Setup",
                        DIRECT_DEBIT_SETUP       : "Direct Debit Enabled",
                        NO_BALANCE_DUE           : "No Current Balance",
                        PAYMENT_ALREADY_SCHEDULED: "Payment Already Scheduled",
                        DEFAULT                  : "We are unable to process your changes at this time."
                    }
                },
                BRANDS: {
                    "GENERIC": [
                        {
                            "assetSubtypeId" : "GOOGLE_ANALYTICS_TRACKING_ID",
                            "assetTypeId"    : "TEXT",
                            "assetValue"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "clientBrandName": "GENERIC",
                            "links": []
                        }
                    ],
                    "WEX"    : [
                        {
                            "assetSubtypeId" : "BRAND_LOGO",
                            "assetTypeId"    : "FILE",
                            "assetValue"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "clientBrandName": "WEX",
                            "links": [
                                {
                                    "rel": "self",
                                    "href": TestUtils.getRandomStringThatIsAlphaNumeric(15)
                                }
                            ]
                        },
                        {
                            "assetSubtypeId" : "GOOGLE_ANALYTICS_TRACKING_ID",
                            "assetTypeId"    : "TEXT",
                            "assetValue"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "clientBrandName": "WEX",
                            "links": []
                        }
                    ]
                }
            },
            AuthenticationManager,
            BankManager,
            PaymentMaintenance,
            Popup,
            FlowUtil,
            LoadingIndicator,
            PaymentManager,
            UserManager,
            AnalyticsUtil,
            LoginManager,
            BrandManager,
            VersionUtil,
            $cordovaDevice,
            $ionicPlatform,
            genericTrackingId,
            doBackButtonAction;

        beforeEach(function () {

            //mock dependencies:
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["logOut", "userLoggedIn"]);
            BankManager = jasmine.createSpyObj("BankManager", ["clearCachedValues", "getActiveBanks", "hasMultipleBanks"]);
            PaymentMaintenance = jasmine.createSpyObj("PaymentMaintenance", ["getOrCreatePaymentAdd"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["clearCachedValues", "fetchPaymentAddAvailability"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", ["startTracker", "trackView"]);
            LoginManager = jasmine.createSpyObj("LoginManager", ["logOut"]);
            BrandManager = jasmine.createSpyObj("BrandManager", ["getGenericAnalyticsTrackingId", "loadBundledBrand"]);
            $cordovaDevice = jasmine.createSpyObj("$cordovaDevice", ["getPlatform"]);
            $ionicPlatform = jasmine.createSpyObj("$ionicPlatform", ["ready", "registerBackButtonAction"]);
            Popup = jasmine.createSpyObj("Popup", ["closeAllPopups"]);
            FlowUtil = jasmine.createSpyObj("FlowUtil", ["exitApp", "goToBackState"]);
            LoadingIndicator = jasmine.createSpyObj("LoadingIndicator", ["begin", "complete"]);
            VersionUtil = jasmine.createSpyObj("VersionUtil", ["determineVersionStatus"]);

            module("app.shared");

            module("app.components", function ($provide) {
                $provide.constant("globals", mockGlobals);
                $provide.value("AuthenticationManager", AuthenticationManager);
                $provide.value("BankManager", BankManager);
                $provide.value("PaymentMaintenance", PaymentMaintenance);
                $provide.value("PaymentManager", PaymentManager);
                $provide.value("UserManager", UserManager);
                $provide.value("AnalyticsUtil", AnalyticsUtil);
                $provide.value("LoginManager", LoginManager);
                $provide.value("BrandManager", BrandManager);
                $provide.value("$cordovaDevice", $cordovaDevice);
                $provide.value("$ionicPlatform", $ionicPlatform);
                $provide.value("Popup", Popup);
                $provide.value("FlowUtil", FlowUtil);
                $provide.value("LoadingIndicator", LoadingIndicator);
                $provide.value("VersionUtil", VersionUtil);

                //setup mocks:
                genericTrackingId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                BrandManager.getGenericAnalyticsTrackingId.and.returnValue(genericTrackingId);
                $ionicPlatform.ready.and.callFake(function (readyCallback) {
                    if (readyCallback) {
                        readyCallback();
                    }

                    return TestUtils.resolvedPromise();
                });
                $ionicPlatform.registerBackButtonAction.and.callFake(function (callback) {
                    doBackButtonAction = callback;
                });
            });

            module(function ($provide, globals, appGlobals, sharedGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, appGlobals, globals));
            });

            module("app.shared");
            module("app.html");

            inject(function (_$q_, _$rootScope_, _$state_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;

                spyOn($rootScope, "$on").and.callThrough();
            });
        });

        it("should set the app to fullscreen with a status bar", function () {
            //TODO - figure out how to test this
        });

        it("should call AnalyticsUtil.startTracker with the expected tracking ID", function () {
            expect(AnalyticsUtil.startTracker).toHaveBeenCalledWith(genericTrackingId);
        });

        describe("when running the app from Chrome", function () {

            it("should call webkitRequestFileSystem with the expected values", function () {
                //TODO - Figure out how to test this
            });
        });

        describe("when there are bundled brand assets", function () {

            it("should call BrandManager.loadBundledBrand for each bundled brand", function () {
                _.forOwn(mockGlobals.BRANDS, function (brandResource, brandId) {
                    expect(BrandManager.loadBundledBrand).toHaveBeenCalledWith(brandId, brandResource);
                });
            });
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

                describe("when the user is navigating to the exit state", function () {

                    beforeEach(function () {
                        $state.go("app.exit");
                        $rootScope.$digest();
                    });

                    it("should continue to the state", function () {
                        expect($state.current.name).toEqual("app.exit");
                    });
                });

                describe("when the user is navigating to the version status state", function () {

                    var determineVersionStatusDeferred;

                    beforeEach(function () {
                        determineVersionStatusDeferred = $q.defer();
                        VersionUtil.determineVersionStatus.and.returnValue(determineVersionStatusDeferred.promise);

                        $state.go("version.status");

                        determineVersionStatusDeferred.resolve();

                        $rootScope.$digest();
                    });

                    it("should continue to the state", function () {
                        expect($state.current.name).toEqual("version.status");
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

                describe("when the user is navigating to the exit state", function () {

                    beforeEach(function () {
                        $state.go("app.exit");
                        $rootScope.$digest();
                    });

                    it("should continue to the state", function () {
                        expect($state.current.name).toEqual("app.exit");
                    });
                });

                describe("when the user is navigating to the version status state", function () {

                    var determineVersionStatusDeferred;

                    beforeEach(function () {
                        determineVersionStatusDeferred = $q.defer();
                        VersionUtil.determineVersionStatus.and.returnValue(determineVersionStatusDeferred.promise);

                        $state.go("version.status");

                        determineVersionStatusDeferred.resolve();

                        $rootScope.$digest();
                    });

                    it("should continue to the state", function () {
                        expect($state.current.name).toEqual("version.status");
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

        describe("has an app:logout event handler function that", function () {

            beforeEach(function() {
                $rootScope.$emit("app:logout");
            });

            it("should call logOut", function () {
                expect(AuthenticationManager.logOut).toHaveBeenCalledWith();
            });

        });

        describe("has a hardware back button action that", function () {

            it("should be registered with $ionicPlatform.registerBackButtonAction with the expected priority", function () {
                expect($ionicPlatform.registerBackButtonAction).toHaveBeenCalledWith(jasmine.any(Function), 101);
            });

            describe("when the hardware back button is pressed", function () {

                beforeEach(function () {
                    doBackButtonAction();
                });

                it("should call FlowUtil.goToBackState", function () {
                    expect(FlowUtil.goToBackState).toHaveBeenCalledWith();
                });
            });
        });
    });
})();
