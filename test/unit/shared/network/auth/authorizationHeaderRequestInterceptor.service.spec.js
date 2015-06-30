(function () {
    "use strict";

    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    var AuthorizationHeaderRequestInterceptor,
        UserManager,
        $rootScope,
        TOKEN_URL;

    describe("A AuthorizationHeader Request Interceptor", function () {

        beforeEach(function () {

            module("app.shared");

            // stub the routing and template loading
            module(function($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });
            module(function($provide) {
                $provide.value("$ionicTemplateCache", function (){ });
            });

            // mock dependencies
            UserManager = jasmine.createSpyObj("UserManager", ["setProfile", "getProfile"]);

            module(function($provide) {
                $provide.value("UserManager", UserManager);
            });

            inject(function (_$rootScope_, _AuthorizationHeaderRequestInterceptor_, globals) {
                $rootScope = _$rootScope_;
                AuthorizationHeaderRequestInterceptor = _AuthorizationHeaderRequestInterceptor_;
                TOKEN_URL = globals.AUTH_API.BASE_URL + "/" + "oauth/token";
            });

        });

        describe("has a request function that", function () {

            describe("when the user is logged in", function () {

                var mockOauth = {
                        refresh_token: "1349758ukdafgn975",
                        access_token: "as;kv987145oihkfdp9u"
                    },
                    interceptedRequest,
                    mockHeaders = {};

                beforeEach(function () {
                    UserManager.getProfile.and.returnValue({
                        isLoggedIn: function () {
                            return mockOauth;
                        },
                        oauth: mockOauth
                    });

                    interceptedRequest = AuthorizationHeaderRequestInterceptor.request(mockHeaders);
                    $rootScope.$digest();
                });

                it("should set the Authorization Header with a Bearer type token", function () {
                    expect(interceptedRequest.headers.Authorization).toMatch(/^Bearer/);
                });

                it("should set the Bearer token with the user's Oauth Access Token", function () {
                    expect(interceptedRequest.headers.Authorization).toMatch(mockOauth.access_token);
                });

            });

            describe("when the user is NOT logged in", function () {

                var mockOauth = null,
                    interceptedRequest,
                    mockHeaders = {};

                beforeEach(function () {
                    UserManager.getProfile.and.returnValue({
                        isLoggedIn: function () {
                            return mockOauth;
                        },
                        oauth: mockOauth
                    });

                    interceptedRequest = AuthorizationHeaderRequestInterceptor.request(mockHeaders);
                    $rootScope.$digest();
                });

                it("should NOT set the Authorization header", function () {
                    expect(interceptedRequest.headers.Authorization).toBeUndefined();
                });

            });

        });

    });

})();