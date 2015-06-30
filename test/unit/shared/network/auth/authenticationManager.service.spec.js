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
        user = {
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
                TOKEN_URL = _globals_.AUTH_API.BASE_URL + "/" + "uaa/oauth/token";
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
                    "username": user.username,
                    "password": user.password,
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
                    AuthenticationManager.authenticate(user.username, user.password);
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

                        AuthenticationManager.authenticate(user.username, user.password)
                            .then(resolveHandler, rejectHandler);
                        $httpBackend.flush();
                    });

                    it("should set the profile on the User", function () {
                        expect(UserManager.setProfile).toHaveBeenCalledWith(user.username, mockData);
                    });

                    it("should resolve with the expected response data", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockData);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });
                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getTokenRequest.respond(200, null);

                        AuthenticationManager.authenticate(user.username, user.password)
                            .then(resolveHandler, rejectHandler);

                        try {
                            $httpBackend.flush();
                        }
                        catch (error) {
                        }
                    });

                    it("should NOT set the profile on the User", function () {
                        expect(UserManager.setProfile).not.toHaveBeenCalled();
                    });

                    it("should throw an error", function () {
                        expect($httpBackend.flush).toThrow();
                    });

                });
            });

            describe("when retrieving the token fails", function () {

                var mockData = "There was an error";

                beforeEach(function () {
                    getTokenRequest.respond(500, mockData);

                    AuthenticationManager.authenticate(user.username, user.password)
                        .then(resolveHandler, rejectHandler);

                    try {
                        $httpBackend.flush();
                    }
                    catch (error) {
                    }
                });

                it("should NOT set the profile on the User", function () {
                    expect(UserManager.setProfile).not.toHaveBeenCalled();
                });

                it("should throw an error", function () {
                    expect($httpBackend.flush).toThrow();
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
                    "username": user.username,
                    "oauth": {
                        refresh_token: rawParams.refresh_token
                    },
                    logOut: logoutSpy
                });
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
                        expect(UserManager.setProfile).toHaveBeenCalledWith(user.username, mockData);
                    });

                    it("should resolve with the expected data", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockData);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });
                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getTokenRequest.respond(200, null);

                        AuthenticationManager.refreshAuthentication()
                            .then(resolveHandler, rejectHandler);

                        try {
                            $httpBackend.flush();
                        }
                        catch (error) {
                        }
                    });

                    it("should NOT set the profile on the User", function () {
                        expect(UserManager.setProfile).not.toHaveBeenCalled();
                    });

                    it("should throw an error", function () {
                        expect($httpBackend.flush).toThrow();
                    });

                });
            });

            describe("when retrieving the token fails", function () {

                var mockData = "There was an error";

                beforeEach(function () {
                    getTokenRequest.respond(500, mockData);

                    AuthenticationManager.refreshAuthentication()
                        .then(resolveHandler, rejectHandler);

                    try {
                        $httpBackend.flush();
                    }
                    catch (error) {
                    }
                });

                it("should NOT set the profile on the User", function () {
                    expect(UserManager.setProfile).not.toHaveBeenCalled();
                });

                it("should throw an error", function () {
                    expect($httpBackend.flush).toThrow();
                });

            });

        });

        describe("has a userLoggedIn function that", function () {

            describe("when the user is logged in", function () {

                beforeEach(function () {
                    UserManager.getProfile.and.returnValue({
                        isLoggedIn: function () {
                            return {
                                refresh_token: "1349758ukdafgn975",
                                access_token : "as;kv987145oihkfdp9u"
                            };
                        }
                    });
                });

                it("should return true", function () {
                    expect(AuthenticationManager.userLoggedIn()).toBeTruthy();
                });

            });

            describe("when the user is NOT logged in", function () {

                beforeEach(function () {
                    UserManager.getProfile.and.returnValue({
                        isLoggedIn: function () {
                            return {};
                        }
                    });
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