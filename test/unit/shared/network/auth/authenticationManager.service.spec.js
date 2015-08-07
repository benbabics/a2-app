(function () {
    "use strict";

    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    var AuthenticationManager,
        FormEncoder,
        AuthenticationErrorInterceptor,
        $base64,
        $rootScope,
        $httpBackend,
        mockUser = {
            username: "IVREXXMS2",
            password: "Tester12"
        },
        getTokenRequest,
        resolveHandler,
        rejectHandler,
        globals = {
            AUTH_API: {
                BASE_URL: "mock base url",
                AUTH: {
                    TOKENS: "mock token url"
                },
                CLIENT_CREDENTIALS: {
                    CLIENT_ID: "mock client id",
                    CLIENT_SECRET: "mock client secret"
                }
            }
        },
        TOKEN_URL = globals.AUTH_API.BASE_URL + "/" + globals.AUTH_API.AUTH.TOKENS;

    describe("An Authentication Manager", function () {

        beforeEach(function () {

            module("app.shared.dependencies");
            module("app.shared.core");

            module(function ($provide) {
                $provide.value("globals", globals);
            });

            module("app.shared.network");
            module("app.shared.auth");
            module("app.shared.api");
            module("app.shared.integration");
            module("app.shared.logger");

            // mock dependencies
            FormEncoder = jasmine.createSpyObj("FormEncoder", ["encode"]);
            AuthenticationErrorInterceptor = jasmine.createSpyObj("AuthenticationErrorInterceptor", ["responseError"]);

            module(function($provide) {
                $provide.value("FormEncoder", FormEncoder);

                // Stub interceptors
                $provide.value("AuthorizationHeaderRequestInterceptor", {});
                $provide.value("AuthenticationErrorInterceptor", AuthenticationErrorInterceptor);
            });

            inject(function (_AuthenticationManager_, _$base64_, _$rootScope_, _$httpBackend_) {
                AuthenticationManager = _AuthenticationManager_;
                $base64 = _$base64_;
                $rootScope = _$rootScope_;
                $httpBackend = _$httpBackend_;
            });

            // set up spies
            getTokenRequest = $httpBackend.when("POST", TOKEN_URL).respond(200, "success");
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
        });

        describe("has an authenticate function that", function () {

            var rawParams = {},
                encodedParams,
                headers = {};

            beforeEach(function () {
                rawParams = {
                    "grant_type": "password",
                    "username": mockUser.username,
                    "password": mockUser.password,
                    "scope": "read"
                };
                encodedParams = "grant_type=" + rawParams.grant_type +
                    "&username=" + rawParams.username +
                    "&password=" + rawParams.password +
                    "&scope=" + rawParams.scope;
                headers = {
                    "Content-Type"    : "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + $base64.encode([
                        globals.AUTH_API.CLIENT_CREDENTIALS.CLIENT_ID,
                        ":",
                        globals.AUTH_API.CLIENT_CREDENTIALS.CLIENT_SECRET
                    ].join("")),
                    "Accept"          : "application/json, text/plain, */*",
                    "X-Requested-With": "XMLHttpRequest"
                };

                FormEncoder.encode.and.returnValue(encodedParams);
            });

            afterEach(function () {
                /*TODO - Figure out why a digest cycle is already in process here when calling expect($httpBackend.flush).toThrow()
                 and remove the $rootScope.$$phase checks. */
                $httpBackend.verifyNoOutstandingExpectation(!$rootScope.$$phase);
                $httpBackend.verifyNoOutstandingRequest(!$rootScope.$$phase);
            });

            describe("when getting an authentication token", function () {

                beforeEach(function () {
                    AuthenticationManager.authenticate(mockUser.username, mockUser.password);
                });

                afterEach(function () {
                    $httpBackend.flush();
                });

                it("should make a POST request to the token URL", function () {
                    $httpBackend.expectPOST(TOKEN_URL);
                });

                it("should use the correct parameters and headers", function () {
                    $httpBackend.expectPOST(TOKEN_URL, encodedParams, headers);
                });

                it("should form encode the parameters", function () {
                    expect(FormEncoder.encode).toHaveBeenCalledWith(rawParams);
                });
            });

            describe("when the token is retrieved successfully", function () {

                describe("when there is data in the response", function () {

                    var mockData = "some data";

                    beforeEach(function () {
                        getTokenRequest.respond(200, mockData);

                        AuthenticationManager.authenticate(mockUser.username, mockUser.password)
                            .then(resolveHandler, rejectHandler);
                        try {
                            $httpBackend.flush();
                        }
                        catch (error) {
                        }
                    });

                    it("should set the username", function () {
                        expect(AuthenticationManager.getUsername()).toEqual(mockUser.username);
                    });

                    it("should log in the user", function () {
                        expect(AuthenticationManager.userLoggedIn()).toBeTruthy();
                    });

                    it("should resolve with the expected response data", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockData);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });
                });

                describe("when there is no data in the response", function () {
                    var initialUsername = "Initial Username";

                    beforeEach(function () {
                        AuthenticationManager.setUsername(initialUsername);

                        getTokenRequest.respond(200, null);

                        AuthenticationManager.authenticate(mockUser.username, mockUser.password)
                            .then(resolveHandler, rejectHandler);

                        try {
                            $httpBackend.flush();
                        }
                        catch (error) {
                        }
                    });

                    it("should NOT update the username", function () {
                        expect(AuthenticationManager.getUsername()).toEqual(initialUsername);
                    });

                    it("should NOT log in the user", function () {
                        expect(AuthenticationManager.userLoggedIn()).toBeFalsy();
                    });

                    it("should throw an error", function () {
                        expect($httpBackend.flush).toThrow();
                    });

                });
            });

            describe("when retrieving the token fails", function () {

                var mockData = "There was an error",
                    initialUsername = "Initial Username";

                beforeEach(function () {
                    AuthenticationManager.setUsername(initialUsername);

                    getTokenRequest.respond(500, mockData);

                    AuthenticationManager.authenticate(mockUser.username, mockUser.password)
                        .then(resolveHandler, rejectHandler);

                    try {
                        $httpBackend.flush();
                    }
                    catch (error) {
                    }
                });

                it("should NOT update the username", function () {
                    expect(AuthenticationManager.getUsername()).toEqual(initialUsername);
                });

                it("should NOT log in the user", function () {
                    expect(AuthenticationManager.userLoggedIn()).toBeFalsy();
                });

                it("should throw an error", function () {
                    expect($httpBackend.flush).toThrow();
                });

            });

        });

        describe("has a refreshAuthentication function that", function () {

            var rawParams = {},
                encodedParams,
                headers = {};

            beforeEach(function () {
                rawParams = {
                    "grant_type": "refresh_token",
                    "refresh_token": "asdf97q324oi5ukjhdg9872q345"
                };
                encodedParams = "grant_type=" + rawParams.grant_type +
                    "&refresh_token=" + rawParams.refresh_token;
                headers = {
                    "Content-Type"    : "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + $base64.encode([
                        globals.AUTH_API.CLIENT_CREDENTIALS.CLIENT_ID,
                        ":",
                        globals.AUTH_API.CLIENT_CREDENTIALS.CLIENT_SECRET
                    ].join("")),
                    "Accept"          : "application/json, text/plain, */*",
                    "X-Requested-With": "XMLHttpRequest"
                };

                FormEncoder.encode.and.returnValue(encodedParams);
            });

            afterEach(function () {
                /*TODO - Figure out why a digest cycle is already in process here when calling expect($httpBackend.flush).toThrow()
                 and remove the $rootScope.$$phase checks. */
                $httpBackend.verifyNoOutstandingExpectation(!$rootScope.$$phase);
                $httpBackend.verifyNoOutstandingRequest(!$rootScope.$$phase);
            });

            describe("when refreshing an authentication token", function () {

                beforeEach(function () {
                    AuthenticationManager.setToken({
                        refresh_token: rawParams.refresh_token,
                        access_token: "as;kv987145oihkfdp9u"
                    });

                    AuthenticationManager.refreshAuthentication();
                });

                afterEach(function () {
                    $httpBackend.flush();
                });

                it("should log the user out", function () {
                    expect(AuthenticationManager.userLoggedIn()).toBeFalsy();
                });

                it("should make a POST request to the token URL", function () {
                    $httpBackend.expectPOST(TOKEN_URL);
                });

                it("should use the correct parameters and headers", function () {
                    $httpBackend.expectPOST(TOKEN_URL, encodedParams, headers);
                });

                it("should form encode the parameters", function () {
                    expect(FormEncoder.encode).toHaveBeenCalledWith(rawParams);
                });
            });

            describe("when the token is retrieved successfully", function () {

                describe("when there is data in the response", function () {

                    var mockData = "some data";

                    beforeEach(function () {
                        AuthenticationManager.setToken({
                            refresh_token: "1349758ukdafgn975",
                            access_token: "as;kv987145oihkfdp9u"
                        });

                        getTokenRequest.respond(200, mockData);

                        AuthenticationManager.setUsername(mockUser.username);

                        AuthenticationManager.refreshAuthentication()
                            .then(resolveHandler, rejectHandler);
                        try {
                            $httpBackend.flush();
                        }
                        catch (error) {
                        }
                    });

                    it("should set the username", function () {
                        expect(AuthenticationManager.getUsername()).toEqual(mockUser.username);
                    });

                    it("should log in the user", function () {
                        expect(AuthenticationManager.userLoggedIn()).toBeTruthy();
                    });

                    it("should resolve with the expected data", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockData);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });
                });

                describe("when there is no data in the response", function () {

                    var initialUsername = "Initial Username";

                    beforeEach(function () {
                        AuthenticationManager.setUsername(initialUsername);

                        AuthenticationManager.setToken({
                            refresh_token: "1349758ukdafgn975",
                            access_token: "as;kv987145oihkfdp9u"
                        });

                        getTokenRequest.respond(200, null);

                        AuthenticationManager.refreshAuthentication()
                            .then(resolveHandler, rejectHandler);

                        try {
                            $httpBackend.flush();
                        }
                        catch (error) {
                        }
                    });

                    it("should NOT update the username", function () {
                        expect(AuthenticationManager.getUsername()).toEqual(initialUsername);
                    });

                    it("should NOT log in the user", function () {
                        expect(AuthenticationManager.userLoggedIn()).toBeFalsy();
                    });

                    it("should throw an error", function () {
                        expect($httpBackend.flush).toThrow();
                    });

                });
            });

            describe("when retrieving the token fails", function () {

                var mockData = "There was an error",
                    initialUsername = "Initial Username";

                beforeEach(function () {
                    AuthenticationManager.setUsername(initialUsername);

                    AuthenticationManager.setToken({
                        refresh_token: "1349758ukdafgn975",
                        access_token: "as;kv987145oihkfdp9u"
                    });

                    getTokenRequest.respond(500, mockData);

                    AuthenticationManager.refreshAuthentication()
                        .then(resolveHandler, rejectHandler);

                    try {
                        $httpBackend.flush();
                    }
                    catch (error) {
                    }
                });

                it("should NOT update the username", function () {
                    expect(AuthenticationManager.getUsername()).toEqual(initialUsername);
                });

                it("should NOT log in the user", function () {
                    expect(AuthenticationManager.userLoggedIn()).toBeFalsy();
                });

                it("should throw an error", function () {
                    expect($httpBackend.flush).toThrow();
                });

            });

        });

        describe("has a userLoggedIn function that", function () {

            describe("when the user is logged in", function () {

                beforeEach(function () {
                    AuthenticationManager.setToken({
                        refresh_token: "1349758ukdafgn975",
                        access_token: "as;kv987145oihkfdp9u"
                    });
                });

                it("should return true", function () {
                    expect(AuthenticationManager.userLoggedIn()).toBeTruthy();
                });

            });

            describe("when the user is NOT logged in", function () {

                beforeEach(function () {
                    AuthenticationManager.setToken(null);
                });

                it("should return false", function () {
                    expect(AuthenticationManager.userLoggedIn()).toBeFalsy();
                });

            });

        });

        describe("has a hasRefreshToken function that", function () {

            describe("when there is a refreshToken", function () {

                beforeEach(function () {
                    AuthenticationManager.setToken({
                        refresh_token: "1349758ukdafgn975",
                        access_token: "as;kv987145oihkfdp9u"
                    });
                });

                it("should return true", function () {
                    expect(AuthenticationManager.hasRefreshToken()).toBeTruthy();
                });

            });

            describe("when the refreshToken is null", function () {

                beforeEach(function () {
                    AuthenticationManager.setToken({
                        refresh_token: null,
                        access_token: "as;kv987145oihkfdp9u"
                    });
                });

                it("should return false", function () {
                    expect(AuthenticationManager.hasRefreshToken()).toBeFalsy();
                });

            });

            describe("when the refreshToken is empty", function () {

                beforeEach(function () {
                    AuthenticationManager.setToken({
                        refresh_token: "",
                        access_token: "as;kv987145oihkfdp9u"
                    });
                });

                it("should return false", function () {
                    expect(AuthenticationManager.hasRefreshToken()).toBeFalsy();
                });

            });

            describe("when the refreshToken is undefined", function () {

                beforeEach(function () {
                    AuthenticationManager.setToken({
                        access_token: "as;kv987145oihkfdp9u"
                    });
                });

                it("should return false", function () {
                    expect(AuthenticationManager.hasRefreshToken()).toBeFalsy();
                });

            });

        });

        describe("has a logOut function that", function () {

            beforeEach(function () {
                AuthenticationManager.setToken({
                    refresh_token: "asdf97q324oi5ukjhdg9872q345",
                    access_token: "as;kv987145oihkfdp9u"
                });

                spyOn($rootScope, "$broadcast");

                AuthenticationManager.logOut();
            });

            it("should log out the user", function () {
                expect(AuthenticationManager.userLoggedIn()).toBeFalsy();
            });

            it("should call $rootScope.$broadcast", function () {
                expect($rootScope.$broadcast).toHaveBeenCalledWith("userLoggedOut");
            });

        });

    });

})();