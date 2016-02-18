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
        userDetails,
        fetchCurrentUserDetailsDeferred,
        fetchBrandAssetsDeferred,
        updateBrandCacheDeferred,
        rejectHandler,
        resolveHandler;

    // TODO: Fix this test by mocking indexedDB
    xdescribe("A Login Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.user");
            module("app.components.brand");

            //mock dependencies
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", ["setUserId"]);
            BrandUtil = jasmine.createSpyObj("BrandUtil", ["updateBrandCache"]);

            module(function ($provide) {
                $provide.value("AnalyticsUtil", AnalyticsUtil);
                $provide.value("BrandUtil", BrandUtil);
            });

            inject(function (_$q_, _$rootScope_, globals,
                             _BrandAssetModel_, _CommonService_, _LoginManager_, UserAccountModel, _UserManager_, UserModel) {
                _ = _CommonService_._;
                $q = _$q_;
                $rootScope = _$rootScope_;
                CommonService = _CommonService_;
                LoginManager = _LoginManager_;
                UserManager = _UserManager_;
                BrandAssetModel = _BrandAssetModel_;

                userDetails = TestUtils.getRandomUser(UserModel, UserAccountModel, globals.USER.ONLINE_APPLICATION);
            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
            fetchCurrentUserDetailsDeferred = $q.defer();
            fetchBrandAssetsDeferred = $q.defer();
            updateBrandCacheDeferred = $q.defer();
            spyOn(userDetails, "fetchBrandAssets").and.returnValue(fetchBrandAssetsDeferred.promise);
            spyOn(UserManager, "fetchCurrentUserDetails").and.returnValue(fetchCurrentUserDetailsDeferred.promise);

            //setup mocks
            UserManager.fetchCurrentUserDetails.and.returnValue(fetchCurrentUserDetailsDeferred.promise);
            BrandUtil.updateBrandCache.and.returnValue(updateBrandCacheDeferred.promise);
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

                it("should call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).toHaveBeenCalledWith();
                });

                describe("when UserManager.fetchCurrentUserDetails succeeds", function () {

                    beforeEach(function () {
                        fetchCurrentUserDetailsDeferred.resolve(userDetails);
                        $rootScope.$digest();
                    });

                    it("should call AnalyticsUtil.setUserId with the expected value", function () {
                        expect(AnalyticsUtil.setUserId).toHaveBeenCalledWith(userDetails.id);
                    });

                    it("should call userDetails.fetchBrandAssets", function () {
                        expect(userDetails.fetchBrandAssets).toHaveBeenCalledWith();
                    });

                    describe("when userDetails.fetchBrandAssets succeeds", function () {
                        var brandAssets;

                        beforeEach(function () {
                            brandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);

                            fetchBrandAssetsDeferred.resolve(brandAssets);
                            $rootScope.$digest();
                        });

                        it("should call BrandUtil.updateBrandCache with the expected values", function () {
                            expect(BrandUtil.updateBrandCache).toHaveBeenCalledWith(brandAssets);
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

                            //TODO: Figure out how to test this without using LoginManager.waitForCompletedLogin
                        });

                        describe("when BrandUtil.updateBrandCache fails", function () {
                            var error;

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                updateBrandCacheDeferred.reject(error);
                            });

                            it("should throw an error", function () {
                                var expectedError = "Failed to complete login initialization: " + CommonService.getErrorMessage(error);

                                expect($rootScope.$digest).toThrowError(expectedError);
                            });
                        });
                    });

                    describe("when userDetails.fetchBrandAssets fails", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            fetchBrandAssetsDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = "Failed to complete login initialization: " + CommonService.getErrorMessage(error);

                            expect($rootScope.$digest).toThrowError(expectedError);
                        });
                    });
                });

                describe("when UserManager.fetchCurrentUserDetails fails", function () {
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
                        fetchBrandAssetsDeferred.resolve();
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
                        fetchBrandAssetsDeferred.reject(error);
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
                        fetchBrandAssetsDeferred.resolve();
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
                        fetchBrandAssetsDeferred.reject(error);
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