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
            mocks.WexCache = jasmine.createSpyObj("WexCache", ["storePropertyValue", "clearPropertyValue"]);
            mocks.brandId = TestUtils.getRandomStringThatIsAlphaNumeric(10);

            module(function ($provide) {
                $provide.value("BrandsResource", mocks.BrandsResource);
                $provide.value("UserManager", mocks.UserManager);
                $provide.value("WexCache", mocks.WexCache);
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


        describe("has a fetchBrandLogo function that", function () {

            var alreadyCalled,
                mockError = {
                    status: ""
                };
            var q;

            beforeEach(function () {

                mocks.getBrandLogoCallDeferred = mocks.$q.defer();

                mocks.BrandsResource.fetchBrandLogo.and.callFake(function () {
                    return mocks.getBrandLogoCallDeferred.promise;
                });

                q = mocks.BrandManager.fetchBrandLogo();
                q.then(mocks.resolveHandler);

                mocks.WexCache.storePropertyValue.and.returnValue( "<svg><!-- fake logo --></svg>" );
                mocks.WexCache.clearPropertyValue.and.returnValue(undefined);

            });

            afterAll(function () {
                alreadyCalled = null;
                mockError = null;
            });

            describe("when getting the brand logo", function () {

                it("should call mocks.BrandsResource.fetchBrandLogo", function () {
                    expect(mocks.BrandsResource.fetchBrandLogo).toHaveBeenCalledWith(mocks.brandId);
                });


                it("BrandManager.fetchBrandLogo returns a promise", function () {
                    expect(q).toBeDefined();
                    expect(q).toBeDefined();
                });

            });

        });


    });

})();