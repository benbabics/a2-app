(function () {
    "use strict";

    var $ionicHistory,
        $rootScope,
        $scope,
        ctrl,
        AuthenticationManager,
        CommonService,
        globals,
        authenticateDeferred,
        fetchCurrentUserDeferred,
        UserManager,
        $state;

    describe("A Login Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.core");
            module("app.components.user");
            module("app.components.user.auth");

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            // mock dependencies
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["authenticate", "logOut"]);
            UserManager = jasmine.createSpyObj("UserManager", ["fetchCurrentUserDetails"]);
            CommonService = jasmine.createSpyObj("CommonService", ["loadingBegin", "loadingComplete"]);
            $state = jasmine.createSpyObj("state", ["go"]);

            inject(function (_$rootScope_, $controller, _$ionicHistory_, $q, _globals_) {
                $ionicHistory = _$ionicHistory_;
                $scope = _$rootScope_.$new();
                authenticateDeferred = $q.defer();
                fetchCurrentUserDeferred = $q.defer();
                globals = _globals_;
                $rootScope = _$rootScope_;

                ctrl = $controller("LoginController", {
                    $scope: $scope,
                    globals: globals,
                    AuthenticationManager: AuthenticationManager,
                    CommonService: CommonService,
                    UserManager: UserManager,
                    $state: $state
                });
            });
        });

        describe("has an activate function that", function () {
            it("should clear previous error", function () {
                expect(ctrl.globalError).toBeFalsy();
            });
        });

        describe("has a authenticateUser function that", function () {

            var mockUser = {
                username: "someusername",
                password: "12345adfg"
            };

            beforeEach(function () {
                AuthenticationManager.authenticate.and.returnValue(authenticateDeferred.promise);

                ctrl.user = mockUser;
                ctrl.authenticateUser();
            });

            it("should authenticate the User", function () {
                expect(AuthenticationManager.authenticate).toHaveBeenCalledWith(ctrl.user.username, ctrl.user.password);
            });

            describe("when the User is Authenticated successfully", function () {

                beforeEach(function () {
                    UserManager.fetchCurrentUserDetails.and.returnValue(fetchCurrentUserDeferred.promise);

                    //return a promise object and resolve it
                    authenticateDeferred.resolve();
                });

                describe("when the User Details is fetched successfully", function () {

                    beforeEach(function () {
                        spyOn($ionicHistory, "nextViewOptions");

                        //return a promise object and resolve it
                        fetchCurrentUserDeferred.resolve();
                        $scope.$digest();
                    });

                    it("should call disable backing up to the login page", function () {
                        expect($ionicHistory.nextViewOptions).toHaveBeenCalledWith({disableBack: true});
                    });

                    it("should NOT have an error message", function () {
                        expect(ctrl.globalError).toBeFalsy();
                    });

                    it("should navigate to the landing page", function () {
                        expect($state.go).toHaveBeenCalledWith("landing");
                    });

                });

                describe("when the User Details is NOT fetched successfully", function () {

                    var errorObjectArg = new Error("Something bad happened");

                    beforeEach(function () {
                        //reject with an error message
                        fetchCurrentUserDeferred.reject(errorObjectArg);
                        $scope.$digest();
                    });

                    it("should call AuthenticationManager.logOut", function () {
                        expect(AuthenticationManager.logOut).toHaveBeenCalledWith();
                    });

                    it("should have an error message", function () {
                        expect(ctrl.globalError).toEqual("Invalid login information. Please check your username and password or go online to set up or recover your username and password.");
                    });

                    it("should NOT navigate away from the login page", function () {
                        expect($state.go).not.toHaveBeenCalled();
                    });

                });

            });

            describe("when the User is NOT Authenticated successfully with a BAD_CREDENTIALS error", function () {

                var errorObjectArg = new Error("BAD_CREDENTIALS");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should call AuthenticationManager.logOut", function () {
                    expect(AuthenticationManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual("Invalid login information. Please check your username and password or go online to set up or recover your username and password.");
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_NOT_ACTIVE error", function () {

                var errorObjectArg = new Error("USER_NOT_ACTIVE");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should call AuthenticationManager.logOut", function () {
                    expect(AuthenticationManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual("Invalid login information. Go online to set up or recover your username and password.");
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_MUST_ACCEPT_TERMS error", function () {

                var errorObjectArg = new Error("USER_MUST_ACCEPT_TERMS");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should call AuthenticationManager.logOut", function () {
                    expect(AuthenticationManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual("Invalid login information. Go online to set up or recover your username and password.");
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_MUST_SETUP_SECURITY_QUESTIONS error", function () {

                var errorObjectArg = new Error("USER_MUST_SETUP_SECURITY_QUESTIONS");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should call AuthenticationManager.logOut", function () {
                    expect(AuthenticationManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual("Invalid login information. Go online to set up or recover your username and password.");
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

            });

            describe("when the User is NOT Authenticated successfully with a PASSWORD_EXPIRED error", function () {

                var errorObjectArg = new Error("PASSWORD_EXPIRED");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should call AuthenticationManager.logOut", function () {
                    expect(AuthenticationManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual("Invalid login information. Go online to set up or recover your username and password.");
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_LOCKED error", function () {

                var errorObjectArg = new Error("USER_LOCKED");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should call AuthenticationManager.logOut", function () {
                    expect(AuthenticationManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual("You have exceeded the number of allowable login attempts. You will need to access your online account to retrieve your username and password.");
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

            });

            describe("when the User is NOT Authenticated successfully with a AUTHORIZATION_FAILED error", function () {

                var errorObjectArg = new Error("AUTHORIZATION_FAILED");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should NOT call UserManager.fetchCurrentUserDetails", function () {
                    expect(UserManager.fetchCurrentUserDetails).not.toHaveBeenCalled();
                });

                it("should call AuthenticationManager.logOut", function () {
                    expect(AuthenticationManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual("Your account is not able to be managed via the mobile application at this time.");
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

            });

        });

    });

}());