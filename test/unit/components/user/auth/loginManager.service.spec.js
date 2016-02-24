(function () {
    "use strict";

    var _,
        $q,
        $rootScope,
        LoginManager,
        AnalyticsUtil,
        CommonService,
        UserManager,
        BrandUtil,
        BrandAssetModel,
        Logger,
        userDetails,
        fetchCurrentUserDetailsDeferred,
        updateBrandCacheDeferred,
        removeExpiredAssetsDeferred,
        rejectHandler,
        resolveHandler;

    describe("A Login Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.user");
            module("app.components.brand");

            //mock dependencies
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", ["setUserId"]);
            BrandUtil = jasmine.createSpyObj("BrandUtil", ["removeExpiredAssets", "updateBrandCache"]);

            module(function ($provide) {
                $provide.value("AnalyticsUtil", AnalyticsUtil);
                $provide.value("BrandUtil", BrandUtil);
            });

            inject(function (_$q_, _$rootScope_, globals,
                             _BrandAssetModel_, _CommonService_, _Logger_, _LoginManager_, UserAccountModel, _UserManager_, UserModel) {
                _ = _CommonService_._;
                $q = _$q_;
                $rootScope = _$rootScope_;
                CommonService = _CommonService_;
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
            removeExpiredAssetsDeferred = $q.defer();
            spyOn(UserManager, "fetchCurrentUserDetails").and.returnValue(fetchCurrentUserDetailsDeferred.promise);
            spyOn(CommonService, "loadingBegin");
            spyOn(CommonService, "loadingComplete");
            spyOn(Logger, "error");

            //setup mocks
            UserManager.fetchCurrentUserDetails.and.returnValue(fetchCurrentUserDetailsDeferred.promise);
            BrandUtil.updateBrandCache.and.returnValue(updateBrandCacheDeferred.promise);
            BrandUtil.removeExpiredAssets.and.returnValue(removeExpiredAssetsDeferred.promise);
        });

        describe("has an activate function that", function () {
            //TODO: figure out how to test this
        });

        describe("has an app:login event listener that", function () {

            describe("when the app:login event is fired", function () {

                beforeEach(function () {
                    $rootScope.$emit("app:login");
                    $rootScope.$digest();
                });

                it("should call CommonService.loadingBegin", function () {
                    expect(CommonService.loadingBegin).toHaveBeenCalledWith();
                });

                it("should call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).toHaveBeenCalledWith();
                });

                describe("when UserManager.fetchCurrentUserDetails succeeds", function () {

                    beforeEach(function () {
                        fetchCurrentUserDetailsDeferred.resolve(userDetails);
                    });

                    it("should call AnalyticsUtil.setUserId with the expected value", function () {
                        $rootScope.$digest();

                        expect(AnalyticsUtil.setUserId).toHaveBeenCalledWith(userDetails.id);
                    });

                    it("should call BrandUtil.removeExpiredAssets with the expected value", function () {
                        $rootScope.$digest();

                        expect(BrandUtil.removeExpiredAssets).toHaveBeenCalledWith(userDetails.brand);
                    });

                    it("should call BrandUtil.updateBrandCache with the expected value", function () {
                        $rootScope.$digest();

                        expect(BrandUtil.updateBrandCache).toHaveBeenCalledWith(userDetails.brand);
                    });

                    describe("when BrandUtil.updateBrandCache succeeds", function () {

                        beforeEach(function () {
                            LoginManager.waitForCompletedLogin()
                                .then(resolveHandler)
                                .catch(rejectHandler);

                            updateBrandCacheDeferred.resolve();
                            $rootScope.$digest();
                        });

                        it("should resolve the initialization promise", function () {
                            expect(resolveHandler).toHaveBeenCalled();
                        });

                        it("should call CommonService.loadingComplete", function () {
                            expect(CommonService.loadingComplete).toHaveBeenCalledWith();
                        });

                        //TODO: Figure out how to test this without using LoginManager.waitForCompletedLogin
                    });

                    describe("when BrandUtil.updateBrandCache fails", function () {
                        var error;

                        beforeEach(function () {
                            LoginManager.waitForCompletedLogin()
                                .then(resolveHandler)
                                .catch(rejectHandler);
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            updateBrandCacheDeferred.reject(error);
                            TestUtils.digestError($rootScope);
                        });

                        it("should log the error", function () {
                            expect(Logger.error).toHaveBeenCalledWith(CommonService.getErrorMessage(error));
                        });

                        it("should resolve the initialization promise", function () {
                            expect(resolveHandler).toHaveBeenCalled();
                        });

                        it("should call CommonService.loadingComplete", function () {
                            expect(CommonService.loadingComplete).toHaveBeenCalledWith();
                        });

                        //TODO: Figure out how to test this without using LoginManager.waitForCompletedLogin
                    });

                    describe("when BrandUtil.removeExpiredAssets fails", function () {
                        var error;

                        beforeEach(function () {
                            LoginManager.waitForCompletedLogin()
                                .then(resolveHandler)
                                .catch(rejectHandler);
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            removeExpiredAssetsDeferred.reject(error);
                            TestUtils.digestError($rootScope);
                        });

                        it("should not reject the initialization promise", function () {
                            expect(rejectHandler).not.toHaveBeenCalled();
                        });

                        //TODO: Figure out how to test this without using LoginManager.waitForCompletedLogin
                    });
                });

                describe("when UserManager.fetchCurrentUserDetails fails", function () {
                    var error,
                        expectedError;

                    beforeEach(function () {
                        LoginManager.waitForCompletedLogin()
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        expectedError = "Failed to complete login initialization: " + CommonService.getErrorMessage(error);

                        fetchCurrentUserDetailsDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrowError(expectedError);
                    });

                    it("should reject the initialization promise", function () {
                        TestUtils.digestError($rootScope);

                        expect(rejectHandler).toHaveBeenCalledWith(error);
                    });

                    it("should call CommonService.loadingComplete", function () {
                        TestUtils.digestError($rootScope);

                        expect(CommonService.loadingComplete).toHaveBeenCalledWith();
                    });

                    //TODO: Figure out how to test this without using LoginManager.waitForCompletedLogin
                });
            });
        });

        describe("has an app:logout event listener that", function () {

            describe("when the app:logout event is fired", function () {

                beforeEach(function () {
                    $rootScope.$emit("app:logout");
                    $rootScope.$digest();
                });

                it("should call clearCachedValues", function () {
                    //TODO: Figure out how to test this
                });
            });
        });

        describe("has a waitForCompletedLogin function that", function () {

            beforeEach(function () {
                LoginManager.waitForCompletedLogin()
                    .then(resolveHandler)
                    .catch(rejectHandler);
                $rootScope.$digest();
            });

            describe("when the app:login event has been fired", function () {

                beforeEach(function () {
                    $rootScope.$emit("app:login");
                    $rootScope.$digest();
                });

                describe("when login initialization has been completed", function () {

                    beforeEach(function () {
                        fetchCurrentUserDetailsDeferred.resolve(userDetails);
                        updateBrandCacheDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalled();
                    });
                });

                describe("when login initialization has NOT been completed", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        fetchCurrentUserDetailsDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "Failed to complete login initialization: " + CommonService.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });

                    it("should NOT resolve", function () {
                        expect(resolveHandler).not.toHaveBeenCalled();
                    });
                });
            });

            describe("when the app:login event has NOT been fired", function () {

                it("should NOT resolve", function () {
                    expect(resolveHandler).not.toHaveBeenCalled();
                });
            });
        });

        describe("has a logOut function that", function () {

            beforeEach(function () {
                spyOn($rootScope, "$emit");

                LoginManager.logOut()
                    .then(resolveHandler)
                    .catch(rejectHandler);
                $rootScope.$digest();
            });

            it("should emit an app:logout event", function () {
                expect($rootScope.$emit).toHaveBeenCalledWith("app:logout");
            });

            it("should resolve", function () {
                expect(resolveHandler).toHaveBeenCalled();
            });
        });

        describe("has a logIn function that", function () {

            beforeEach(function () {
                spyOn($rootScope, "$emit").and.callThrough();

                LoginManager.logIn()
                    .then(resolveHandler)
                    .catch(rejectHandler);
                $rootScope.$digest();
            });

            it("should emit an app:login event", function () {
                expect($rootScope.$emit).toHaveBeenCalledWith("app:login");
            });

            describe("when the app:login event has been fired", function () {

                beforeEach(function () {
                    $rootScope.$emit("app:login");
                    $rootScope.$digest();
                });

                describe("when login initialization has been completed", function () {

                    beforeEach(function () {
                        fetchCurrentUserDetailsDeferred.resolve(userDetails);
                        updateBrandCacheDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalled();
                    });
                });

                describe("when login initialization has NOT been completed", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        fetchCurrentUserDetailsDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "Failed to complete login initialization: " + CommonService.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });

                    it("should NOT resolve", function () {
                        expect(resolveHandler).not.toHaveBeenCalled();
                    });
                });
            });

            describe("when the app:login event has NOT been fired", function () {

                it("should NOT resolve", function () {
                    expect(resolveHandler).not.toHaveBeenCalled();
                });
            });
        });
    });
})();