(function () {
    "use strict";

    var mocks = {};

    describe("A Brand Manager", function () {

        module.sharedInjector();

        beforeAll(function () {
            this.includeDependencies({
                commonSharedMockExclusions: ["PlatformUtil"],
                mocks: mocks
            }, this);

            // mock dependencies
            mocks.BrandsResource = jasmine.createSpyObj("BrandsResource", ["fetchBrandLogo"]);
            mocks.UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);

            module(function ($provide) {
                $provide.value("UserManager", mocks.UserManager);
                $provide.value("BrandUtil", mocks.BrandUtil);
            });

            inject(function (___, _$q_, _$rootScope_, _$state_, _globals_, _moment_, _BrandManager_, _LoggerUtil_) {
                mocks._ = ___;
                mocks.LoggerUtil = _LoggerUtil_;
                mocks.$q = _$q_;
                mocks.$rootScope = _$rootScope_;
                mocks.$state = _$state_;
                mocks.moment = _moment_;
                mocks.globals = _globals_;
                mocks.BrandManager = _BrandManager_;

                spyOn(mocks.$state, "transitionTo");
            });

            // set up spies
            mocks.resolveHandler = jasmine.createSpy("mocks.resolveHandler");
            mocks.rejectHandler = jasmine.createSpy("mocks.rejectHandler");
        });

        beforeEach(inject(function (UserModel, UserAccountModel) {
            // set up mocks
            mocks.user = TestUtils.getRandomUser(UserModel, UserAccountModel, mocks.globals.ONLINE_APPLICATION);
            mocks.UserManager.getUser.and.returnValue(mocks.user);
            mocks.BrandManager.setBrandAssets(mocks.mockBrandAssetCollection);
        }));

        afterEach(function () {
            //reset all mocks
            _.forEach(mocks, TestUtils.resetMock);
        });

        afterAll(function () {
            mocks = null;
        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a fetchBrandAssets function that", function () {

            var alreadyCalled,
                brandAssets,
                brandAssetsObject,
                ifModifiedSince,
                mockError = {
                    status: ""
                };

            beforeEach(function () {
                alreadyCalled = false;
                brandAssets = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);
                brandAssetsObject = {};
                brandAssetsObject[mocks.brandId] = brandAssets;
                ifModifiedSince = TestUtils.getRandomDate();

                mocks.getBrandAssetsFirstCallDeferred = mocks.$q.defer();
                mocks.getBrandAssetsSecondCallDeferred = mocks.$q.defer();

                mocks.BrandsResource.getBrandAssets.and.callFake(function () {
                    if (alreadyCalled) {
                        return mocks.getBrandAssetsSecondCallDeferred.promise;
                    }

                    alreadyCalled = true;
                    return mocks.getBrandAssetsFirstCallDeferred.promise;
                });
                mocks.mockBrandAssetCollection[mocks.brandId] = [];
                mocks.mockBrandAssetCollection.find.and.returnValue(brandAssets);
                mocks.mockBrandAssetCollection.insert.and.callFake(mocks._.bind(Array.prototype.push, mocks.mockBrandAssetCollection[mocks.brandId], mocks._));

                mocks.BrandManager.fetchBrandAssets(mocks.brandId, ifModifiedSince)
                    .then(mocks.resolveHandler, mocks.rejectHandler);
            });

            afterAll(function () {
                alreadyCalled = null;
                brandAssets = null;
                brandAssetsObject = null;
                ifModifiedSince =  null;
                mockError = null;
            });

            describe("when getting the brand logo", function () {

                it("should call mocks.BrandsResource.getBrandAssets", function () {
                    expect(mocks.BrandsResource.fetchBrandLogo).toHaveBeenCalledWith(mocks.brandId, ifModifiedSince);
                });

            });

        });


    });

})();