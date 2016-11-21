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
        BrandAssetModel,
        Popup,
        userDetails,
        fetchCurrentUserDetailsDeferred,
        updateBrandCacheDeferred,
        rejectHandler,
        resolveHandler;

    describe("A Login Manager", function () {

        beforeAll(function () {
            this.commonAppMockExclusions = ["LoginManager"];
        });

        beforeEach(function () {

            //mock dependencies
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["getAuthorizationHeader", "userLoggedIn"]);
            BrandManager = jasmine.createSpyObj("BrandManager", [
                "getGenericBrandAssetBySubtype",
                "getGenericAnalyticsTrackingId",
                "getUserBrandAssetBySubtype",
                "loadBundledBrand",
                "updateBrandCache"
            ]);
            $ionicSideMenuDelegate = jasmine.createSpyObj("$ionicSideMenuDelegate", ["toggleRight"]);
            Popup = jasmine.createSpyObj("Popup", ["closeAllPopups"]);

            module(function ($provide) {
                $provide.value("AuthenticationManager", AuthenticationManager);
                $provide.value("BrandManager", BrandManager);
                $provide.value("Popup", Popup);
                $provide.value("$ionicSideMenuDelegate", $ionicSideMenuDelegate);
            });

            inject(function (___, _$q_, _$rootScope_, globals, _BrandAssetModel_, _LoggerUtil_, _LoginManager_,
                             UserAccountModel, _UserManager_, UserModel) {
                _ = ___;
                $q = _$q_;
                $rootScope = _$rootScope_;
                LoggerUtil = _LoggerUtil_;
                LoginManager = _LoginManager_;
                UserManager = _UserManager_;
                BrandAssetModel = _BrandAssetModel_;

                userDetails = TestUtils.getRandomUser(UserModel, UserAccountModel, globals.USER.ONLINE_APPLICATION);
            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
            fetchCurrentUserDetailsDeferred = $q.defer();
            updateBrandCacheDeferred = $q.defer();
            spyOn(UserManager, "fetchCurrentUserDetails").and.returnValue(fetchCurrentUserDetailsDeferred.promise);
            spyOn(UserManager, "getUser").and.returnValue(userDetails);

            //setup mocks
            UserManager.fetchCurrentUserDetails.and.returnValue(fetchCurrentUserDetailsDeferred.promise);
            BrandManager.updateBrandCache.and.returnValue(updateBrandCacheDeferred.promise);
        });

        describe("has a logOut function that", function () {
            var trackingId;

            beforeEach(function () {
                trackingId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                BrandManager.getGenericAnalyticsTrackingId.and.returnValue(trackingId);
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

            it("should call this.AnalyticsUtil.startTracker with the generic tracker ID", function () {
                expect(this.AnalyticsUtil.startTracker).toHaveBeenCalledWith(trackingId);
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
                var trackingId;

                beforeEach(function () {
                    trackingId = TestUtils.getRandomBrandAsset(BrandAssetModel);
                    BrandManager.getUserBrandAssetBySubtype.and.returnValue(trackingId);

                    fetchCurrentUserDetailsDeferred.resolve(userDetails);
                });

                it("should call BrandManager.updateBrandCache with the expected value", function () {
                    $rootScope.$digest();

                    expect(BrandManager.updateBrandCache).toHaveBeenCalledWith(userDetails.brand);
                });

                describe("when BrandManager.updateBrandCache succeeds", function () {

                    beforeEach(function () {
                        updateBrandCacheDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should call this.AnalyticsUtil.startTracker with the user's branded tracker ID", function () {
                        expect(this.AnalyticsUtil.startTracker).toHaveBeenCalledWith(trackingId.assetValue);
                    });

                    it("should call this.AnalyticsUtil.setUserId with the expected value", function () {
                        expect(this.AnalyticsUtil.setUserId).toHaveBeenCalledWith(userDetails.id);
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

                describe("when BrandManager.updateBrandCache fails", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        updateBrandCacheDeferred.reject(error);
                        TestUtils.digestError($rootScope);
                    });

                    it("should log the error", function () {
                        expect(this.Logger.error).toHaveBeenCalledWith(LoggerUtil.getErrorMessage(error));
                    });

                    it("should call this.AnalyticsUtil.startTracker with the user's branded tracker ID", function () {
                        expect(this.AnalyticsUtil.startTracker).toHaveBeenCalledWith(trackingId.assetValue);
                    });

                    it("should call this.AnalyticsUtil.setUserId with the expected value", function () {
                        expect(this.AnalyticsUtil.setUserId).toHaveBeenCalledWith(userDetails.id);
                    });

                    it("should resolve the initialization promise", function () {
                        expect(resolveHandler).toHaveBeenCalled();
                    });

                    it("should call this.LoadingIndicator.complete", function () {
                        expect(this.LoadingIndicator.complete).toHaveBeenCalledWith();
                    });
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
