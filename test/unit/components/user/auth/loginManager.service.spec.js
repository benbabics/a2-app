(function () {
    "use strict";

    var _,
        $ionicSideMenuDelegate,
        $q,
        $rootScope,
        LoginManager,
        AuthenticationManager,
        LoggerUtil,
        UserManager,
        BrandManager,
        Popup,
        userDetails,
        fetchCurrentUserDetailsDeferred,
        rejectHandler,
        resolveHandler;

    describe("A Login Manager", function () {

        beforeAll(function () {
            this.commonAppMockExclusions = ["LoginManager"];
        });

        beforeEach(function () {

            //mock dependencies
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["getAuthorizationHeader", "userLoggedIn", "logOut"]);
            BrandManager = jasmine.createSpyObj("BrandManager", ["fetchBrandLogo"]);
            $ionicSideMenuDelegate = jasmine.createSpyObj("$ionicSideMenuDelegate", ["toggleRight"]);
            Popup = jasmine.createSpyObj("Popup", ["closeAllPopups"]);

            module(function ($provide) {
                $provide.value("AuthenticationManager", AuthenticationManager);
                $provide.value("BrandManager", BrandManager);
                $provide.value("Popup", Popup);
                $provide.value("$ionicSideMenuDelegate", $ionicSideMenuDelegate);
            });

            inject(function (___, _$q_, _$rootScope_, globals, _LoggerUtil_, _LoginManager_,
                             UserAccountModel, _UserManager_, UserModel) {
                _ = ___;
                $q = _$q_;
                $rootScope = _$rootScope_;
                LoggerUtil = _LoggerUtil_;
                LoginManager = _LoginManager_;
                UserManager = _UserManager_;

                userDetails = TestUtils.getRandomUser(UserModel, UserAccountModel, globals.USER.ONLINE_APPLICATION);
            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
            fetchCurrentUserDetailsDeferred = $q.defer();
            spyOn(UserManager, "fetchCurrentUserDetails").and.returnValue(fetchCurrentUserDetailsDeferred.promise);
            spyOn(UserManager, "getUser").and.returnValue(userDetails);

            //setup mocks
            UserManager.fetchCurrentUserDetails.and.returnValue(fetchCurrentUserDetailsDeferred.promise);
        });

        describe("has a logOut function that", function () {

            beforeEach(function () {
                AuthenticationManager.userLoggedIn.and.returnValue(false);

                spyOn($rootScope, "$emit");

                LoginManager.logOut()
                    .then(resolveHandler)
                    .catch(rejectHandler);
                $rootScope.$digest();
            });

            it("should emit an app:logout event", function () {
                expect($rootScope.$emit).toHaveBeenCalledWith("app:logout");
            });

            it("should call Popup.closeAllPopups", function () {
                expect(Popup.closeAllPopups).toHaveBeenCalledWith();
            });

            it("should close the side menu", function () {
                expect($ionicSideMenuDelegate.toggleRight).toHaveBeenCalledWith(false);
            });

            it("should resolve", function () {
                expect(resolveHandler).toHaveBeenCalled();
            });
        });

        describe("has a logIn function that", function () {

            beforeEach(function () {
                AuthenticationManager.userLoggedIn.and.returnValue(true);

                spyOn($rootScope, "$emit").and.callThrough();

                LoginManager.logIn()
                    .then(resolveHandler)
                    .catch(rejectHandler);
                $rootScope.$digest();
            });

            it("should call this.LoadingIndicator.begin", function () {
                expect(this.LoadingIndicator.begin).toHaveBeenCalledWith();
            });

            it("should call UserManager.fetchCurrentUserDetails", function () {
                expect(UserManager.fetchCurrentUserDetails).toHaveBeenCalledWith();
            });

            describe("when UserManager.fetchCurrentUserDetails succeeds", function () {
                beforeEach(function () {
                    fetchCurrentUserDetailsDeferred.resolve(userDetails);
                    $rootScope.$digest();
                });

                it("should call this.AnalyticsUtil.setUserId with the expected value", function () {
                    expect(this.AnalyticsUtil.setUserId).toHaveBeenCalledWith(userDetails.id);
                });

                it("should call this.AnalyticsUtil.setUserBrand with the expected value", function () {
                    expect( this.AnalyticsUtil.setUserBrand ).toHaveBeenCalledWith( userDetails.brand );
                });

                it("should resolve the initialization promise", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });

                it("should call this.LoadingIndicator.complete", function () {
                    expect(this.LoadingIndicator.complete).toHaveBeenCalledWith();
                });

                it("should emit an app:login event", function () {
                    expect($rootScope.$emit).toHaveBeenCalledWith("app:login");
                });
            });

            describe("when UserManager.fetchCurrentUserDetails fails", function () {
                var error,
                    expectedError;

                beforeEach(function () {
                    error = {
                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    };

                    expectedError = "Failed to complete login initialization: " + LoggerUtil.getErrorMessage(error);

                    fetchCurrentUserDetailsDeferred.reject(error);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrowError(expectedError);
                });

                it("should reject the initialization promise", function () {
                    TestUtils.digestError($rootScope);

                    expect(rejectHandler).toHaveBeenCalledWith(new Error(expectedError));
                });

                it("should call this.LoadingIndicator.complete", function () {
                    TestUtils.digestError($rootScope);

                    expect(this.LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });
        });
    });
})();
