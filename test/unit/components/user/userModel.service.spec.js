(function () {
    "use strict";

    describe("A User Model Service", function () {

        var _,
            $q,
            $rootScope,
            user,
            BRAND,
            ONLINE_APPLICATION,
            BrandManager,
            brandAssets;

        beforeEach(function () {
            module("app.shared");
            module("app.components.account");
            module("app.components.user");
            module("app.components.brand");
            module("app.html");

            //mock dependencies:
            BrandManager = jasmine.createSpyObj("BrandManager", ["fetchBrandAssets", "getBrandAssetsByBrand"]);

            module(function ($provide) {
                $provide.value("BrandManager", BrandManager);
            });

            inject(function (sharedGlobals, _$rootScope_, _$q_, BrandAssetModel, CommonService, UserModel) {
                _ = CommonService._;
                BRAND = sharedGlobals.BRAND;
                ONLINE_APPLICATION = sharedGlobals.USER.ONLINE_APPLICATION;
                $q = _$q_;
                $rootScope = _$rootScope_;
                user = new UserModel();

                var numAssets = TestUtils.getRandomInteger(1, 10);
                brandAssets = {};
                for (var i = 0; i < numAssets; ++i) {
                    brandAssets[TestUtils.getRandomStringThatIsAlphaNumeric(10)] = TestUtils.getRandomBrandAsset(BrandAssetModel);
                }
            });
        });

        describe("has a set function that", function () {

            var userResource,
                userModelKeys,
                userResourceKeys;

            beforeEach(inject(function (UserModel, UserAccountModel) {
                userResource = angular.extend(TestUtils.getRandomUser(UserModel, UserAccountModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

                // set all values to "default" to more easily detect any changes
                for (var property in user) {
                    if (_.has(user, property)) {
                        user[property] = "default";
                    }
                }

                userModelKeys = _.keys(user);
                userResourceKeys = _.keys(userResource);
            }));

            it("should set the UserModel object with the fields from the passed in userResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(userModelKeys, userResourceKeys);

                user.set(userResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(user[key]).toEqual(userResource[key]);
                }
            });

            it("should NOT change the UserModel object fields that the userResource object does not have", function () {
                var key,
                    keysDifference = _.difference(userModelKeys, userResourceKeys);

                user.set(userResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(user[key]).toEqual("default");
                }
            });

            it("should extend the UserModel object with the fields from the passed in userResource object that the UserModel does not have", function () {
                var key,
                    keysDifference = _.difference(userResourceKeys, userModelKeys);

                user.set(userResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(user, key)).toBeTruthy();
                    expect(user[key]).toEqual(userResource[key]);
                }
            });

            it("should set the UserModel brand with 'GENERIC' when the passed in userResource object is empty", function () {
                userResource.brand = "";

                user.set(userResource);

                expect(user.brand).toEqual(BRAND.GENERIC);
            });

            it("should set the UserModel brand with 'GENERIC' when the passed in userResource object is null", function () {
                userResource.brand = null;

                user.set(userResource);

                expect(user.brand).toEqual(BRAND.GENERIC);
            });

            it("should set the UserModel brand with 'GENERIC' when the passed in userResource object is undefined", function () {
                delete userResource.brand;

                user.set(userResource);

                expect(user.brand).toEqual(BRAND.GENERIC);
            });

        });

        describe("has a getDisplayAccountNumber function that", function () {

            describe("when the online application type is WOL_NP", function () {

                beforeEach(function () {
                    user.onlineApplication = ONLINE_APPLICATION.WOL_NP;
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });

            describe("when the online application type is CLASSIC", function () {

                beforeEach(function () {
                    user.onlineApplication = ONLINE_APPLICATION.CLASSIC;
                });

                it("should return the wexAccountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.wexAccountNumber);
                });
            });

            describe("when the online application type is unrecognized", function () {

                beforeEach(function () {
                    user.onlineApplication = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });

            describe("when the online application type is empty", function () {

                beforeEach(function () {
                    user.onlineApplication = "";
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });

            describe("when the online application type is null", function () {

                beforeEach(function () {
                    user.onlineApplication = null;
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });

            describe("when the online application type is undefined", function () {

                beforeEach(function () {
                    delete user.onlineApplication;
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });
        });

        describe("has a fetchBrandAssets function that", function () {

            describe("when the user has a brand", function () {

                beforeEach(function () {
                    user.brand = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                describe("when BrandManager.fetchBrandAssets resolves", function () {
                    var promise,
                        result;

                    beforeEach(function () {
                        promise = $q.resolve(brandAssets);
                        BrandManager.fetchBrandAssets.and.returnValue(promise);
                    });

                    beforeEach(function () {
                        result = user.fetchBrandAssets();
                    });

                    it("should call BrandManager.fetchBrandAssets with the expected values", function () {
                        expect(BrandManager.fetchBrandAssets).toHaveBeenCalledWith(user.brand);
                    });

                    it("should return a promise that resolves with the brandAssets", function (done) {
                        result.then(function (resultAssets) {
                            expect(resultAssets).toEqual(brandAssets);

                            done();
                        });

                        $rootScope.$digest();
                    });
                });

                describe("when BrandManager.fetchBrandAssets rejects", function () {
                    var error,
                        promise,
                        result;

                    beforeEach(function () {
                        error = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                        promise = $q.reject(error);
                        BrandManager.fetchBrandAssets.and.returnValue(promise);
                    });

                    beforeEach(function () {
                        result = user.fetchBrandAssets();
                    });

                    it("should call BrandManager.fetchBrandAssets with the expected values", function () {
                        expect(BrandManager.fetchBrandAssets).toHaveBeenCalledWith(user.brand);
                    });

                    it("should return a promise that rejects with the error", function (done) {
                        result.catch(function (errorResult) {
                            expect(errorResult).toEqual(error);

                            done();
                        });

                        $rootScope.$digest();
                    });
                });
            });

            describe("when the user does NOT have a brand", function () {
                var result;

                beforeEach(function () {
                    delete user.brand;
                });

                beforeEach(function () {
                    result = user.fetchBrandAssets();
                });

                it("should return a promise that rejects", function (done) {
                    var expectedError = "User does not have any brand assets";

                    result.catch(function (errorResult) {
                        expect(errorResult).toEqual(expectedError);

                        done();
                    });

                    $rootScope.$digest();
                });
            });
        });

        describe("has a getBrandAssetBySubtype function that", function () {
            var assetSubtypeId;

            beforeEach(function () {
                spyOn(user, "getBrandAssets").and.returnValue(brandAssets);
            });

            describe("when the user has a brand", function () {

                beforeEach(function () {
                    user.brand = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                describe("when the given assetSubtypeId is found in the list of brand assets", function () {
                    var brandAsset;

                    beforeEach(function () {
                        brandAsset = TestUtils.getRandomValueFromMap(brandAssets);
                        assetSubtypeId = brandAsset.assetSubtypeId;
                    });

                    it("should return the brandAsset with that assetSubtypeId", function () {
                        expect(user.getBrandAssetBySubtype(assetSubtypeId)).toEqual(brandAsset);
                    });
                });

                describe("when the given assetSubtypeId is NOT found in the list of brand assets", function () {

                    beforeEach(function () {
                        do {
                            assetSubtypeId = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                        }
                        while (!!_.find(brandAssets, {assetSubtypeId: assetSubtypeId}));
                    });

                    it("should return undefined", function () {
                        expect(user.getBrandAssetBySubtype(assetSubtypeId)).not.toBeDefined();
                    });
                });
            });

            describe("when the user does NOT have a brand", function () {

                beforeEach(function () {
                    delete user.brand;
                });

                it("should return null", function () {
                    expect(user.getBrandAssetBySubtype(assetSubtypeId)).toBeNull();
                });
            });
        });

        describe("has a getBrandAssets function that", function () {

            describe("when the user has a brand", function () {
                var result;

                beforeEach(function () {
                    user.brand = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                describe("when there are brand assets associated with this brand", function () {

                    beforeEach(function () {
                        BrandManager.getBrandAssetsByBrand.and.returnValue(brandAssets);

                        result = user.getBrandAssets();
                    });

                    it("should call BrandManager.getBrandAssetsByBrand with the expected value", function () {
                        expect(BrandManager.getBrandAssetsByBrand).toHaveBeenCalledWith(user.brand);
                    });

                    it("should return the brandAsset with that assetSubtypeId", function () {
                        expect(result).toEqual(brandAssets);
                    });
                });

                describe("when there are NOT brand assets associated with this brand", function () {

                    beforeEach(function () {
                        BrandManager.getBrandAssetsByBrand.and.returnValue(null);

                        result = user.getBrandAssets();
                    });

                    it("should call BrandManager.getBrandAssetsByBrand with the expected value", function () {
                        expect(BrandManager.getBrandAssetsByBrand).toHaveBeenCalledWith(user.brand);
                    });

                    it("should return null", function () {
                        expect(result).toBeNull();
                    });
                });
            });

            describe("when the user does NOT have a brand", function () {

                beforeEach(function () {
                    delete user.brand;
                });

                it("should return null", function () {
                    expect(user.getBrandAssets()).toBeNull();
                });
            });
        });
    });

})();