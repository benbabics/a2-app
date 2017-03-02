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
            mocks.brandId = TestUtils.getRandomStringThatIsAlphaNumeric(10);

            module(function ($provide) {
                $provide.value("BrandsResource", mocks.BrandsResource);
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
            mocks.user.brand = mocks.brandId;
            mocks.UserManager.getUser.and.returnValue(mocks.user);
        }));

        afterEach(function () {
            //reset all mocks
            _.forEach(mocks, TestUtils.resetMock);
        });

        afterAll(function () {
            mocks = null;
        });


        describe("has a fetchBrandAssets function that", function () {

            var alreadyCalled,
                mockError = {
                    status: ""
                };

            beforeEach(function () {

                mocks.getBrandAssetsFirstCallDeferred = mocks.$q.defer();

                mocks.BrandsResource.fetchBrandLogo.and.callFake(function () {
                    return mocks.getBrandAssetsFirstCallDeferred.promise;
                });

                mocks.BrandManager.fetchBrandLogo()
                    .then(mocks.resolveHandler);
            });

            afterAll(function () {
                alreadyCalled = null;
                mockError = null;
            });

            describe("when getting the brand logo", function () {

                // it("should call mocks.BrandsResource.fetchBrandLogo", function () {
                //     expect(mocks.BrandsResource.fetchBrandLogo).toHaveBeenCalledWith(mocks.brandId);
                // });

            });

        });


    });

})();