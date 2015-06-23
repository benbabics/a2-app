(function () {
    "use strict";

    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    var AuthenticationManager,
        FormEncoder,
        UserManager,
        AuthenticationErrorInterceptor,
        $base64,
        $rootScope,
        $httpBackend,
        globals,
        CREDENTIALS = {
            username: "IVREXXMS2",
            password: "Tester12"
        },
        TOKEN_URL,
        getTokenRequest,
        resolveHandler,
        rejectHandler;

    describe("An Authentication Manager", function () {

        beforeEach(function () {

            module("app.shared");

            // mock dependencies
            FormEncoder = jasmine.createSpyObj("FormEncoder", ["encode"]);
            UserManager = jasmine.createSpyObj("UserManager", ["setProfile", "getProfile"]);
            AuthenticationErrorInterceptor = jasmine.createSpyObj("AuthenticationErrorInterceptor", ["responseError"]);

            module(function($provide) {
                $provide.value("FormEncoder", FormEncoder);
                $provide.value("UserManager", UserManager);

                // Stub interceptors
                $provide.value("AuthorizationHeaderRequestInterceptor", {});
                $provide.value("AuthenticationErrorInterceptor", AuthenticationErrorInterceptor);
            });

            inject(function (_AuthenticationManager_, _$base64_, _$rootScope_, _$httpBackend_, _globals_) {
                AuthenticationManager = _AuthenticationManager_;
                $base64 = _$base64_;
                $rootScope = _$rootScope_;
                $httpBackend = _$httpBackend_;
                globals = _globals_;
                TOKEN_URL = globals.AUTH_API.BASE_URL + "/" + "uaa/oauth/token";
            });

            // set up spies
            getTokenRequest = $httpBackend.when("POST", TOKEN_URL).respond(200, "");
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
                    "username": CREDENTIALS.username,
                    "password": CREDENTIALS.password,
                    "scope": "read"
                };
                encodedParams = "grant_type=" + rawParams.grant_type +
                    "&username=" + rawParams.username +
                    "&password=" + rawParams.password +
                    "&scope=" + rawParams.scope;
                headers = {
                    "Content-Type"    : "application/x-www-form-urlencoded",
                    "Authorization"   : "Basic " + $base64.encode("@@@STRING_REPLACE_AUTH_CLIENT_ID@@@:@@@STRING_REPLACE_AUTH_CLIENT_SECRET@@@"),
                    "Accept"          : "application/json, text/plain, */*",
                    "X-Requested-With": "XMLHttpRequest"
                };

                spyOn(AuthenticationManager, "getUserCredentials").and.returnValue({
                    "username": CREDENTIALS.username,
                    "password": CREDENTIALS.password
                });
                FormEncoder.encode.and.returnValue(encodedParams);
            });

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("when getting an authentication token", function () {

                beforeEach(function () {
                    AuthenticationManager.authenticate();
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

                        AuthenticationManager.authenticate()
                            .then(resolveHandler, rejectHandler);
                        $httpBackend.flush();
                    });

                    it("should set the profile on the User", function () {
                        expect(UserManager.setProfile).toHaveBeenCalledWith(CREDENTIALS.username, mockData);
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalled();
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });
                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getTokenRequest.respond(200, null);

                        AuthenticationManager.authenticate()
                            .then(resolveHandler, rejectHandler);
                        $httpBackend.flush();
                    });

                    it("should NOT set the profile on the User", function () {
                        expect(UserManager.setProfile).not.toHaveBeenCalled();
                    });

                    it("should reject", function () {
                        expect(resolveHandler).not.toHaveBeenCalled();
                        expect(rejectHandler).toHaveBeenCalled();
                    });

                });
            });

            describe("when retrieving the token fails", function () {

                var mockData = "There was an error";

                beforeEach(function () {
                    getTokenRequest.respond(500, mockData);

                    AuthenticationManager.authenticate()
                        .then(resolveHandler, rejectHandler);
                    $httpBackend.flush();
                });

                it("should NOT set the profile on the User", function () {
                    expect(UserManager.setProfile).not.toHaveBeenCalled();
                });

                it("should reject", function () {
                    expect(resolveHandler).not.toHaveBeenCalled();
                    expect(rejectHandler).toHaveBeenCalledWith(jasmine.objectContaining({data: mockData}));
                });

            });

        });

        describe("has a refreshAuthentication function that", function () {

            var rawParams = {},
                encodedParams,
                headers = {},
                logoutSpy;

            beforeEach(function () {
                rawParams = {
                    "grant_type": "refresh_token",
                    "refresh_token": "asdf97q324oi5ukjhdg9872q345"
                };
                encodedParams = "grant_type=" + rawParams.grant_type +
                    "&refresh_token=" + rawParams.refresh_token;
                headers = {
                    "Content-Type"    : "application/x-www-form-urlencoded",
                    "Authorization"   : "Basic " + $base64.encode("@@@STRING_REPLACE_AUTH_CLIENT_ID@@@:@@@STRING_REPLACE_AUTH_CLIENT_SECRET@@@"),
                    "Accept"          : "application/json, text/plain, */*",
                    "X-Requested-With": "XMLHttpRequest"
                };
                logoutSpy = jasmine.createSpy("logOut");

                UserManager.getProfile.and.returnValue({
                    "username": CREDENTIALS.username,
                    "oauth": {
                        refresh_token: rawParams.refresh_token
                    },
                    logOut: logoutSpy
                });
                FormEncoder.encode.and.returnValue(encodedParams);
            });

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("when refreshing an authentication token", function () {

                beforeEach(function () {
                    AuthenticationManager.refreshAuthentication();
                });

                afterEach(function () {
                    $httpBackend.flush();
                });

                it("should log the user out", function () {
                    expect(logoutSpy).toHaveBeenCalled();
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

                        AuthenticationManager.refreshAuthentication()
                            .then(resolveHandler, rejectHandler);
                        $httpBackend.flush();
                    });

                    it("should set the profile on the User", function () {
                        expect(UserManager.setProfile).toHaveBeenCalledWith(CREDENTIALS.username, mockData);
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalled();
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });
                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getTokenRequest.respond(200, null);

                        AuthenticationManager.refreshAuthentication()
                            .then(resolveHandler, rejectHandler);
                        $httpBackend.flush();
                    });

                    it("should NOT set the profile on the User", function () {
                        expect(UserManager.setProfile).not.toHaveBeenCalled();
                    });

                    it("should reject", function () {
                        expect(resolveHandler).not.toHaveBeenCalled();
                        expect(rejectHandler).toHaveBeenCalled();
                    });

                });
            });

            describe("when retrieving the token fails", function () {

                var mockData = "There was an error";

                beforeEach(function () {
                    getTokenRequest.respond(500, mockData);

                    AuthenticationManager.refreshAuthentication()
                        .then(resolveHandler, rejectHandler);
                    $httpBackend.flush();
                });

                it("should NOT set the profile on the User", function () {
                    expect(UserManager.setProfile).not.toHaveBeenCalled();
                });

                it("should reject", function () {
                    expect(resolveHandler).not.toHaveBeenCalled();
                    expect(rejectHandler).toHaveBeenCalledWith(jasmine.objectContaining({data: mockData}));
                });

            });

        });

        describe("has a getUserCredentials function that", function () {

            var mockCredentials = {
                    username: "someName",
                    password: "somePassword"
                },
                realCredentials;

            beforeEach(function () {
                realCredentials = globals.USER.CREDENTIALS;
                globals.USER.CREDENTIALS = mockCredentials;
            });

            afterEach(function () {
                globals.USER.CREDENTIALS = realCredentials;
            });

            it("should return the user credentials", function () {
                expect(AuthenticationManager.getUserCredentials()).toEqual(mockCredentials);
            });

        });

        describe("has a userLoggedIn function that", function () {

            describe("when the user is logged in", function () {

                beforeEach(function () {
                    UserManager.getProfile.and.returnValue({loggedIn: {
                        refresh_token: "1349758ukdafgn975",
                        access_token: "as;kv987145oihkfdp9u"
                    }});
                });

                it("should return true", function () {
                    expect(AuthenticationManager.userLoggedIn()).toBeTruthy();
                });

            });

            describe("when the user is NOT logged in", function () {

                beforeEach(function () {
                    UserManager.getProfile.and.returnValue({loggedIn: {}});
                });

                it("should return false", function () {
                    expect(AuthenticationManager.userLoggedIn()).toBeFalsy();
                });

            });

        });

        describe("has a hasRefreshToken function that", function () {

            describe("when there is a refreshToken", function () {

                beforeEach(function () {
                    UserManager.getProfile.and.returnValue({oauth: {
                        refresh_token: "1349758ukdafgn975",
                        access_token: "as;kv987145oihkfdp9u"
                    }});
                });

                it("should return true", function () {
                    expect(AuthenticationManager.hasRefreshToken()).toBeTruthy();
                });

            });

            describe("when the refreshToken is null", function () {

                beforeEach(function () {
                    UserManager.getProfile.and.returnValue({oauth: {
                        refresh_token: null,
                        access_token: "as;kv987145oihkfdp9u"
                    }});
                });

                it("should return false", function () {
                    expect(AuthenticationManager.hasRefreshToken()).toBeFalsy();
                });

            });

            describe("when the refreshToken is empty", function () {

                beforeEach(function () {
                    UserManager.getProfile.and.returnValue({oauth: {
                        refresh_token: "",
                        access_token: "as;kv987145oihkfdp9u"
                    }});
                });

                it("should return false", function () {
                    expect(AuthenticationManager.hasRefreshToken()).toBeFalsy();
                });

            });

            describe("when the refreshToken is undefined", function () {

                beforeEach(function () {
                    UserManager.getProfile.and.returnValue({oauth: {
                        access_token: "as;kv987145oihkfdp9u"
                    }});
                });

                it("should return false", function () {
                    expect(AuthenticationManager.hasRefreshToken()).toBeFalsy();
                });

            });

        });

    });

})();