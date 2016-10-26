(function () {
    "use strict";

    var _,
        $ionicSideMenuDelegate,
        $q,
        $rootScope,
        LoginManager,
        AnalyticsUtil,
        AuthenticationManager,
        LoadingIndicator,
        LoggerUtil,
        UserManager,
        BrandManager,
        BrandAssetModel,
        Logger,
        Popup,
        userDetails,
        fetchCurrentUserDetailsDeferred,
        updateBrandCacheDeferred,
        rejectHandler,
        resolveHandler;

    describe("A Login Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.user");
            module("app.components.brand");

            //mock dependencies
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", ["setUserId", "startTracker"]);
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["userLoggedIn"]);
            BrandManager = jasmine.createSpyObj("BrandManager", [
                "getGenericBrandAssetBySubtype",
                "getGenericAnalyticsTrackingId",
                "getUserBrandAssetBySubtype",
                "updateBrandCache"
            ]);
            LoadingIndicator = jasmine.createSpyObj("LoadingIndicator", ["begin", "complete"]);
            $ionicSideMenuDelegate = jasmine.createSpyObj("$ionicSideMenuDelegate", ["toggleRight"]);
            Popup = jasmine.createSpyObj("Popup", ["closeAllPopups"]);

            module(function ($provide) {
                $provide.value("AnalyticsUtil", AnalyticsUtil);
                $provide.value("AuthenticationManager", AuthenticationManager);
                $provide.value("BrandManager", BrandManager);
                $provide.value("LoadingIndicator", LoadingIndicator);
                $provide.value("Popup", Popup);
                $provide.value("$ionicSideMenuDelegate", $ionicSideMenuDelegate);
            });

            inject(function (___, _$q_, _$rootScope_, globals, _BrandAssetModel_, _LoggerUtil_, _Logger_, _LoginManager_,
                             UserAccountModel, _UserManager_, UserModel) {
                _ = ___;
                $q = _$q_;
                $rootScope = _$rootScope_;
                LoggerUtil = _LoggerUtil_;
                LoginManager = _LoginManager_;
                UserManager = _UserManager_;
                BrandAssetModel = _BrandAssetModel_;
                Logger = _Logger_;

                userDetails = TestUtils.getRandomUser(UserModel, UserAccountModel, globals.USER.ONLINE_APPLICATION);
            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
            fetchCurrentUserDetailsDeferred = $q.defer();
            updateBrandCacheDeferred = $q.defer();
            spyOn(UserManager, "fetchCurrentUserDetails").and.returnValue(fetchCurrentUserDetailsDeferred.promise);
            spyOn(UserManager, "getUser").and.returnValue(userDetails);
            spyOn(Logger, "error");

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

            it("should call AnalyticsUtil.startTracker with the generic tracker ID", function () {
                expect(AnalyticsUtil.startTracker).toHaveBeenCalledWith(trackingId);
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

            it("should call LoadingIndicator.begin", function () {
                expect(LoadingIndicator.begin).toHaveBeenCalledWith();
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

                    it("should call AnalyticsUtil.startTracker with the user's branded tracker ID", function () {
                        expect(AnalyticsUtil.startTracker).toHaveBeenCalledWith(trackingId.assetValue);
                    });

                    it("should call AnalyticsUtil.setUserId with the expected value", function () {
                        expect(AnalyticsUtil.setUserId).toHaveBeenCalledWith(userDetails.id);
                    });

                    it("should resolve the initialization promise", function () {
                        expect(resolveHandler).toHaveBeenCalled();
                    });

                    it("should call LoadingIndicator.complete", function () {
                        expect(LoadingIndicator.complete).toHaveBeenCalledWith();
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
                        expect(Logger.error).toHaveBeenCalledWith(LoggerUtil.getErrorMessage(error));
                    });

                    it("should call AnalyticsUtil.startTracker with the user's branded tracker ID", function () {
                        expect(AnalyticsUtil.startTracker).toHaveBeenCalledWith(trackingId.assetValue);
                    });

                    it("should call AnalyticsUtil.setUserId with the expected value", function () {
                        expect(AnalyticsUtil.setUserId).toHaveBeenCalledWith(userDetails.id);
                    });

                    it("should resolve the initialization promise", function () {
                        expect(resolveHandler).toHaveBeenCalled();
                    });

                    it("should call LoadingIndicator.complete", function () {
                        expect(LoadingIndicator.complete).toHaveBeenCalledWith();
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

                it("should call LoadingIndicator.complete", function () {
                    TestUtils.digestError($rootScope);

                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });
        });
    });
})();
