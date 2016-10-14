(function () {
    "use strict";

    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    var AuthorizationHeaderRequestInterceptor,
        AuthenticationManager,
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
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["userLoggedIn", "getAuthorizationHeader"]);

            module(function($provide) {
                $provide.value("AuthenticationManager", AuthenticationManager);
            });

            inject(function (_$rootScope_, _AuthorizationHeaderRequestInterceptor_, globals) {
                $rootScope = _$rootScope_;
                AuthorizationHeaderRequestInterceptor = _AuthorizationHeaderRequestInterceptor_;
                TOKEN_URL = globals.AUTH_API.BASE_URL + "/" + "oauth/token";
            });

        });

        describe("has a request function that", function () {

            describe("when the user is logged in", function () {

                var mockAuthorizationHeader = "Mock Authorization Header",
                    interceptedRequest,
                    mockHeaders = {};

                beforeEach(function () {
                    AuthenticationManager.userLoggedIn.and.returnValue(true);
                    AuthenticationManager.getAuthorizationHeader.and.returnValue(mockAuthorizationHeader);

                    interceptedRequest = AuthorizationHeaderRequestInterceptor.request(mockHeaders);
                    $rootScope.$digest();
                });

                it("should set the Authorization Header", function () {
                    expect(interceptedRequest.headers.Authorization).toMatch(mockAuthorizationHeader);
                });

            });

            describe("when the user is NOT logged in", function () {

                var mockAuthorizationHeader = null,
                    interceptedRequest,
                    mockHeaders = {};

                beforeEach(function () {
                    AuthenticationManager.userLoggedIn.and.returnValue(false);
                    AuthenticationManager.getAuthorizationHeader.and.returnValue(mockAuthorizationHeader);

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