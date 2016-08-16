(function () {
    "use strict";

    var AuthenticationErrorInterceptor,
        $rootScope,
        $httpBackend,
        $state,
        MOCK_FAILED_REQUEST_CONFIG = {
            method: "POST",
            url: "http://somedomain.com/someendpoint"
        },
        mockGlobals = {
            LOCALSTORAGE : {
                "CONFIG": {
                    "keyPrefix": "FLEET_MANAGER-"
                },
                "KEYS": {
                    "LAST_BRAND_UPDATE_DATE": "LAST_BRAND_UPDATE_DATE"
                }
            },
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
            LOGGING                : {
                ENABLED: false
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
            GOOGLE_ANALYTICS       : {
                TRACKING_ID: TestUtils.getRandomStringThatIsAlphaNumeric(10)
            },
            "USER_LOGIN"           : {
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
            }
        },
        mockRejection = {
            status: "",
            config: {
                url: ""
            }
        },
        LOGIN_STATE = mockGlobals.LOGIN_STATE,
        LOGIN_STATE_DATA = {"reason": "TOKEN_EXPIRED"},
        AuthorizationHeaderRequestInterceptor,
        AuthenticationManager,
        AnalyticsUtil,
        refreshAuthenticationDeferred,
        authenticationDeferred,
        restangularDeferred,
        restangularResponseHandler;

    describe("An Authentication Error Interceptor", function () {

        beforeEach(function () {

            // mock dependencies
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["userLoggedIn", "hasRefreshToken", "refreshAuthentication", "authenticate", "logOut", "getAuthorizationHeader"]);
            AuthorizationHeaderRequestInterceptor = jasmine.createSpyObj("AuthorizationHeaderRequestInterceptor", ["request"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", [
                "getActiveTrackerId",
                "hasActiveTracker",
                "setUserId",
                "startTracker",
                "trackEvent",
                "trackView"
            ]);

            module("app.shared");

            module("app.components", function ($provide, sharedGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, mockGlobals));

                $provide.value("AuthenticationManager", AuthenticationManager);
                $provide.value("AuthorizationHeaderRequestInterceptor", AuthorizationHeaderRequestInterceptor);
                $provide.value("AnalyticsUtil", AnalyticsUtil);
            });

            module(function ($provide, sharedGlobals, appGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, appGlobals, mockGlobals));
            });

            module("app.html");

            inject(function (_AuthenticationErrorInterceptor_, _$httpBackend_, _$rootScope_, _$state_, $q) {
                AuthenticationErrorInterceptor = _AuthenticationErrorInterceptor_;
                $httpBackend = _$httpBackend_;
                $rootScope = _$rootScope_;
                refreshAuthenticationDeferred = $q.defer();
                authenticationDeferred = $q.defer();
                $state = _$state_;
            });

            // set up spies
            $httpBackend.when(MOCK_FAILED_REQUEST_CONFIG.method, MOCK_FAILED_REQUEST_CONFIG.url).respond(200, "");
            AuthenticationManager.refreshAuthentication.and.returnValue(refreshAuthenticationDeferred.promise);
            AuthenticationManager.authenticate.and.returnValue(authenticationDeferred.promise);
            restangularDeferred = jasmine.createSpyObj("deferred", ["reject"]);
            restangularResponseHandler = jasmine.createSpy("responseHandler");
            spyOn($state, "go");
        });

        describe("has a responseError function that", function () {

            describe("when the status code is 401", function () {

                beforeEach(function () {
                    mockRejection.status = 401;
                });

                it("should return false", function () {
                    var result = AuthenticationErrorInterceptor.responseError(mockRejection, restangularDeferred, restangularResponseHandler);

                    expect(result).toBeFalsy();
                });

                describe("when the user has already authenticated previously and has a valid refresh token", function () {

                    describe("when the Authentication refreshes successfully", function () {

                        beforeEach(function () {
                            AuthenticationManager.userLoggedIn.and.returnValue(true);
                            AuthenticationManager.hasRefreshToken.and.returnValue(true);
                            mockRejection.config = MOCK_FAILED_REQUEST_CONFIG;

                            AuthenticationErrorInterceptor.responseError(mockRejection, restangularDeferred, restangularResponseHandler);
                        });

                        afterEach(function() {
                            $httpBackend.verifyNoOutstandingExpectation();
                            $httpBackend.verifyNoOutstandingRequest();
                        });

                        it("should try to refresh the Authentication", function () {
                            expect(AuthenticationManager.refreshAuthentication).toHaveBeenCalledWith();
                        });

                        //TODO - Figure out why (sometimes) a digest cycle is already in progress here (PhantomJS).
                        xit("should retry the failed request", function () {
                            $httpBackend.expect(MOCK_FAILED_REQUEST_CONFIG.method, MOCK_FAILED_REQUEST_CONFIG.url);

                            refreshAuthenticationDeferred.resolve();
                            $rootScope.$digest();
                            $httpBackend.flush();
                        });

                    });

                    describe("when the Authentication refresh fails", function () {

                        var refreshResponse = {},
                            errorResult;

                        beforeEach(function () {
                            AuthenticationManager.userLoggedIn.and.returnValue(true);
                            AuthenticationManager.hasRefreshToken.and.returnValue(true);
                            mockRejection.config = MOCK_FAILED_REQUEST_CONFIG;
                            refreshResponse.status = 400;

                            errorResult = AuthenticationErrorInterceptor.responseError(mockRejection, restangularDeferred, restangularResponseHandler);
                        });

                        afterEach(function() {
                            /*TODO - Figure out why a digest cycle is already in process here when calling expect($rootScope.$digest).toThrow()
                             and remove the $rootScope.$$phase checks. */
                            $httpBackend.verifyNoOutstandingExpectation(!$rootScope.$$phase);
                            $httpBackend.verifyNoOutstandingRequest(!$rootScope.$$phase);
                        });

                        it("should try to refresh the Authentication", function () {
                            expect(AuthenticationManager.refreshAuthentication).toHaveBeenCalledWith();
                        });

                        describe("when the refresh token has expired", function () {

                            beforeEach(function () {
                                refreshResponse.data = {
                                    error: "invalid_grant",
                                    error_description: "Invalid refresh token: blah blah blah"
                                };

                                refreshAuthenticationDeferred.reject(refreshResponse);
                                $rootScope.$digest();
                            });

                            it("should redirect to the login page with a TOKEN_EXPIRED reason", function () {
                                expect($state.go).toHaveBeenCalledWith(LOGIN_STATE, LOGIN_STATE_DATA);
                            });

                        });

                        describe("when the refresh token has NOT expired", function () {

                            beforeEach(function () {
                                refreshResponse.data = {
                                    error: "unauthorized",
                                    error_description: "Authorization required or whatever"
                                };

                                refreshAuthenticationDeferred.reject(refreshResponse);
                            });

                            it("should throw an error", function () {
                                expect($rootScope.$digest).toThrow();
                            });

                        });

                    });

                });

                describe("when the user has NOT authenticated previously", function () {

                    var errorResult;

                    beforeEach(function () {
                        AuthenticationManager.userLoggedIn.and.returnValue(false);
                        AuthenticationManager.hasRefreshToken.and.returnValue(false);
                        mockRejection.config = MOCK_FAILED_REQUEST_CONFIG;

                        errorResult = AuthenticationErrorInterceptor.responseError(mockRejection, restangularDeferred, restangularResponseHandler);
                    });

                    it("should redirect to the login page with a TOKEN_EXPIRED reason", function () {
                        expect($state.go).toHaveBeenCalledWith(LOGIN_STATE, LOGIN_STATE_DATA);
                    });

                });

                describe("when the user has authenticated previously but the refresh token is not valid", function () {

                    var errorResult;

                    beforeEach(function () {
                        AuthenticationManager.userLoggedIn.and.returnValue(true);
                        AuthenticationManager.hasRefreshToken.and.returnValue(false);
                        mockRejection.config = MOCK_FAILED_REQUEST_CONFIG;

                        errorResult = AuthenticationErrorInterceptor.responseError(mockRejection, restangularDeferred, restangularResponseHandler);
                    });

                    it("should redirect to the login page with a TOKEN_EXPIRED reason", function () {
                        expect($state.go).toHaveBeenCalledWith(LOGIN_STATE, LOGIN_STATE_DATA);
                    });

                });

            });

            describe("when the status code is NOT 401", function () {

                var errorResult;

                beforeEach(function () {
                    mockRejection.status = 500;
                    mockRejection.config = MOCK_FAILED_REQUEST_CONFIG;

                    errorResult = AuthenticationErrorInterceptor.responseError(mockRejection, restangularDeferred, restangularResponseHandler);
                });

                it("should return true", function () {
                    expect(errorResult).toBeTruthy();
                });

            });

        });

    });

})();