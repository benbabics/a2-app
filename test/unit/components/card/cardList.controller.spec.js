(function () {
    "use strict";

    var $rootScope,
        $scope,
        $q,
        CommonService,
        CardManager,
        UserManager,
        UserModel,
        AccountModel,
        CardModel,
        ctrl,
        resolveHandler,
        rejectHandler,
        mockUser,
        mockGlobals = {
            CARD_LIST: {
                "CONFIG"        : {
                    "title"         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "reloadDistance": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                },
                "SEARCH_OPTIONS": {
                    "MAX_DAYS" : TestUtils.getRandomInteger(1, 100),
                    "PAGE_SIZE": TestUtils.getRandomInteger(1, 100)
                }
            }
        };

    describe("A Transaction List Controller", function () {

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

            //mock dependencies:
            CardManager = jasmine.createSpyObj("CardManager", ["fetchCards"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);

            inject(function (_$rootScope_, _$q_, $controller,
                             _CommonService_, _UserModel_, _AccountModel_, _CardModel_) {
                $rootScope = _$rootScope_;
                $q = _$q_;
                UserModel = _UserModel_;
                AccountModel = _AccountModel_;
                CommonService = _CommonService_;
                CardModel = _CardModel_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("CardListController", {
                    $scope       : $scope,
                    globals      : mockGlobals,
                    CardManager  : CardManager,
                    CommonService: CommonService,
                    UserManager  : UserManager
                });

            });

            //setup spies
            spyOn(CommonService, "loadingBegin");
            spyOn(CommonService, "loadingComplete");

            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            //setup mocks
            mockUser = TestUtils.getRandomUser(UserModel, AccountModel);
            UserManager.getUser.and.returnValue(mockUser);
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            // Doesn't do anything yet

        });

    });

}());