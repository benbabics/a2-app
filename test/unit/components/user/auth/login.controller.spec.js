(function () {
    "use strict";

    var $ionicHistory,
        $rootScope,
        $scope,
        $state,
        $stateParams = {},
        $cordovaKeyboard,
        AnalyticsUtil,
        authenticateDeferred,
        brandAssets,
        ctrl,
        fetchBrandAssetsDeferred,
        fetchCurrentUserDeferred,
        AuthenticationManager,
        CommonService,
        UserManager,
        mockGlobals = {
            "USER_LOGIN": {
                "CONFIG": {
                    "ANALYTICS"   : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "events"     : {
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
                    },
                    "title"       : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "userName"    : {
                        "label"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "maxLength": TestUtils.getRandomInteger(1, 100)
                    },
                    "password"    : {
                        "label"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "maxLength": TestUtils.getRandomInteger(1, 100)
                    },
                    "submitButton": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "serverErrors": {
                        "AUTHORIZATION_FAILED"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "DEFAULT"                           : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "PASSWORD_EXPIRED"                  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "TOKEN_EXPIRED"                     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "USER_LOCKED"                       : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "USER_MUST_ACCEPT_TERMS"            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "USER_MUST_SETUP_SECURITY_QUESTIONS": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "USER_NOT_ACTIVE"                   : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                }
            }
        },
        mockConfig = mockGlobals.USER_LOGIN.CONFIG,
        userDetails;

    describe("A Login Controller", function () {

        beforeEach(function () {

            module("app.shared");
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
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["authenticate"]);
            UserManager = jasmine.createSpyObj("UserManager", ["fetchCurrentUserDetails"]);
            $state = jasmine.createSpyObj("state", ["go"]);
            $cordovaKeyboard = jasmine.createSpyObj("$cordovaKeyboard", ["isVisible"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", ["setUserId", "trackEvent", "trackView"]);

            inject(function (_$rootScope_, $controller, _$ionicHistory_, $q, _CommonService_, BrandAssetModel, UserAccountModel, UserModel,
                             globals) {
                $ionicHistory = _$ionicHistory_;
                $scope = _$rootScope_.$new();
                authenticateDeferred = $q.defer();
                fetchCurrentUserDeferred = $q.defer();
                fetchBrandAssetsDeferred = $q.defer();
                $rootScope = _$rootScope_;
                CommonService = _CommonService_;

                mockConfig.ANALYTICS.errorEvents = globals.USER_LOGIN.CONFIG.ANALYTICS.errorEvents;
                userDetails = TestUtils.getRandomUser(UserModel, UserAccountModel, globals.USER.ONLINE_APPLICATION);
                brandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);

                ctrl = $controller("LoginController", {
                    $scope                 : $scope,
                    $state                 : $state,
                    $stateParams           : $stateParams,
                    AnalyticsUtil          : AnalyticsUtil,
                    $cordovaKeyboard       : $cordovaKeyboard,
                    globals                : mockGlobals,
                    AuthenticationManager  : AuthenticationManager,
                    CommonService          : CommonService,
                    UserManager            : UserManager
                });

                //setup spies:
                spyOn(CommonService, "logOut");
                spyOn(userDetails, "fetchBrandAssets");

            });

        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function() {
                spyOn($ionicHistory, "clearHistory");

                //setup an existing values to test them being modified
                ctrl.globalError = "This is a previous error";
            });

            describe("when $stateParams.reason is TOKEN_EXPIRED", function () {

                beforeEach(function() {
                    $stateParams.reason = "TOKEN_EXPIRED";

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should set the error", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.TOKEN_EXPIRED);
                });

                it("should NOT call AnalyticsUtil.trackEvent", function () {
                    expect(AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when $stateParams.reason is an object", function () {

                beforeEach(function() {
                    $stateParams.reason = {
                        randomProperty       : "Property value",
                        anotherRandomProperty: "Another property value"
                    };

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                it("should NOT call AnalyticsUtil.trackEvent", function () {
                    expect(AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when $stateParams.reason is empty string", function () {

                beforeEach(function() {
                    $stateParams.reason = "";

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                it("should NOT call AnalyticsUtil.trackEvent", function () {
                    expect(AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when $stateParams.reason is null", function () {

                beforeEach(function() {
                    $stateParams.reason = null;

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                it("should NOT call AnalyticsUtil.trackEvent", function () {
                    expect(AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when $stateParams.reason is undefined", function () {

                beforeEach(function() {
                    delete $stateParams.reason;

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                it("should NOT call AnalyticsUtil.trackEvent", function () {
                    expect(AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

        });

        describe("has a $cordovaKeyboard:show event handler function that", function () {

            beforeEach(function () {
                document.body.classList.remove("keyboard-open");
            });

            beforeEach(function () {
                $rootScope.$broadcast("$cordovaKeyboard:show");
                $rootScope.$digest();
            });

            it("should add the 'keyboard-open' class to the body", function () {
                expect(document.body.classList.contains("keyboard-open")).toBeTruthy();
            });
        });

        describe("has a $cordovaKeyboard:hide event handler function that", function () {

            beforeEach(function () {
                document.body.classList.add("keyboard-open");
            });

            beforeEach(function () {
                $rootScope.$broadcast("$cordovaKeyboard:hide");
                $rootScope.$digest();
            });

            it("should remove the 'keyboard-open' class from the body", function () {
                expect(document.body.classList.contains("keyboard-open")).toBeFalsy();
            });
        });

        describe("has an authenticateUser function that", function () {

            var mockUser = {
                username: "someusername",
                password: "12345adfg"
            };

            beforeEach(function () {
                AuthenticationManager.authenticate.and.returnValue(authenticateDeferred.promise);

                ctrl.user = mockUser;
                ctrl.authenticateUser();
            });

            it("should authenticate the User", function () {
                expect(AuthenticationManager.authenticate).toHaveBeenCalledWith(ctrl.user.username, ctrl.user.password);
            });

            describe("when the User is Authenticated successfully", function () {

                beforeEach(function () {
                    UserManager.fetchCurrentUserDetails.and.returnValue(fetchCurrentUserDeferred.promise);

                    //return a promise object and resolve it
                    authenticateDeferred.resolve();
                });

                describe("when the User Details is fetched successfully", function () {

                    beforeEach(function () {
                        userDetails.fetchBrandAssets.and.returnValue(fetchBrandAssetsDeferred.promise);

                        //return a promise object and resolve it
                        fetchCurrentUserDeferred.resolve(userDetails);
                        $scope.$digest();
                    });

                    it("should call AnalyticsUtil.setUserId with the correct User ID", function () {
                        expect(AnalyticsUtil.setUserId).toHaveBeenCalledWith(userDetails.id);
                    });

                    it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                        verifyEventTracked(mockConfig.ANALYTICS.events.successfulLogin);
                    });

                    describe("when the Brand Assets are fetched successfully", function () {

                        beforeEach(function () {
                            spyOn($ionicHistory, "nextViewOptions");

                            //resolve the promise
                            fetchBrandAssetsDeferred.resolve(brandAssets);
                            $scope.$digest();
                        });

                        it("should call userDetails.fetchBrandAssets", function () {
                            expect(userDetails.fetchBrandAssets).toHaveBeenCalledWith();
                        });

                        it("should call disable backing up to the login page", function () {
                            expect($ionicHistory.nextViewOptions).toHaveBeenCalledWith({disableBack: true});
                        });

                        it("should NOT have an error message", function () {
                            expect(ctrl.globalError).toBeFalsy();
                        });

                        it("should navigate to the landing page", function () {
                            expect($state.go).toHaveBeenCalledWith("landing");
                        });

                    });

                    describe("when the Brand Assets are NOT fetched successfully", function () {

                        var errorObjectArg = new Error("Something bad happened");

                        beforeEach(function () {
                            //reject with an error message
                            fetchBrandAssetsDeferred.reject(errorObjectArg);
                            $scope.$digest();
                        });

                        it("should call CommonService.logOut", function () {
                            expect(CommonService.logOut).toHaveBeenCalledWith();
                        });

                        it("should have an error message", function () {
                            expect(ctrl.globalError).toEqual(mockConfig.serverErrors.DEFAULT);
                        });

                        it("should NOT navigate away from the login page", function () {
                            expect($state.go).not.toHaveBeenCalled();
                        });

                    });

                });

                describe("when the User Details is NOT fetched successfully", function () {

                    var errorObjectArg = new Error("Something bad happened");

                    beforeEach(function () {
                        //reject with an error message
                        fetchCurrentUserDeferred.reject(errorObjectArg);
                        $scope.$digest();
                    });

                    it("should NOT call userDetails.fetchBrandAssets", function () {
                        expect(userDetails.fetchBrandAssets).not.toHaveBeenCalled();
                    });

                    it("should call CommonService.logOut", function () {
                        expect(CommonService.logOut).toHaveBeenCalledWith();
                    });

                    it("should have an error message", function () {
                        expect(ctrl.globalError).toEqual(mockConfig.serverErrors.DEFAULT);
                    });

                    it("should NOT navigate away from the login page", function () {
                        expect($state.go).not.toHaveBeenCalled();
                    });

                    it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                        verifyEventTracked(mockConfig.ANALYTICS.events.wrongCredentialsStatus);
                    });

                });

            });

            describe("when the User is NOT Authenticated successfully with a BAD_CREDENTIALS error", function () {

                var errorObjectArg = new Error("BAD_CREDENTIALS");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should NOT call userDetails.fetchBrandAssets", function () {
                    expect(userDetails.fetchBrandAssets).not.toHaveBeenCalled();
                });

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.DEFAULT);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.wrongCredentialsStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_NOT_ACTIVE error", function () {

                var errorObjectArg = new Error("USER_NOT_ACTIVE");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should NOT call userDetails.fetchBrandAssets", function () {
                    expect(userDetails.fetchBrandAssets).not.toHaveBeenCalled();
                });

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.USER_NOT_ACTIVE);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.inactiveStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_MUST_ACCEPT_TERMS error", function () {

                var errorObjectArg = new Error("USER_MUST_ACCEPT_TERMS");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should NOT call userDetails.fetchBrandAssets", function () {
                    expect(userDetails.fetchBrandAssets).not.toHaveBeenCalled();
                });

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.USER_MUST_ACCEPT_TERMS);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.inactiveStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_MUST_SETUP_SECURITY_QUESTIONS error", function () {

                var errorObjectArg = new Error("USER_MUST_SETUP_SECURITY_QUESTIONS");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should NOT call userDetails.fetchBrandAssets", function () {
                    expect(userDetails.fetchBrandAssets).not.toHaveBeenCalled();
                });

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.USER_MUST_SETUP_SECURITY_QUESTIONS);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.inactiveStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a PASSWORD_EXPIRED error", function () {

                var errorObjectArg = new Error("PASSWORD_EXPIRED");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should NOT call userDetails.fetchBrandAssets", function () {
                    expect(userDetails.fetchBrandAssets).not.toHaveBeenCalled();
                });

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.PASSWORD_EXPIRED);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should NOT call AnalyticsUtil.trackEvent", function () {
                    expect(AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_LOCKED error", function () {

                var errorObjectArg = new Error("USER_LOCKED");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should NOT call userDetails.fetchBrandAssets", function () {
                    expect(userDetails.fetchBrandAssets).not.toHaveBeenCalled();
                });

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.USER_LOCKED);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.lockedPasswordStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a AUTHORIZATION_FAILED error", function () {

                var errorObjectArg = new Error("AUTHORIZATION_FAILED");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should NOT call userDetails.fetchBrandAssets", function () {
                    expect(userDetails.fetchBrandAssets).not.toHaveBeenCalled();
                });

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.AUTHORIZATION_FAILED);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.accountNotReadyStatus);
                });

            });

        });

        describe("has a keyboardIsVisible function that", function () {

            describe("when Cordova is available", function () {

                beforeEach(function () {
                    spyOn(CommonService, "platformHasCordova").and.returnValue(true);
                });

                describe("when the keyboard is visible", function () {

                    beforeEach(function () {
                        $cordovaKeyboard.isVisible.and.returnValue(true);
                    });

                    it("should return true", function () {
                        expect(ctrl.keyboardIsVisible()).toBeTruthy();
                    });
                });

                describe("when the keyboard is NOT visible", function () {

                    beforeEach(function () {
                        $cordovaKeyboard.isVisible.and.returnValue(false);
                    });

                    it("should return false", function () {
                        expect(ctrl.keyboardIsVisible()).toBeFalsy();
                    });
                });
            });

            describe("when Cordova is NOT available", function () {

                beforeEach(function () {
                    spyOn(CommonService, "platformHasCordova").and.returnValue(false);
                });

                it("should return false", function () {
                    expect(ctrl.keyboardIsVisible()).toBeFalsy();
                });
            });
        });

    });

    function verifyEventTracked(event) {
        expect(AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(event);
    }

}());