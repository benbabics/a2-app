(function () {
    "use strict";

    var $ionicHistory,
        $rootScope,
        $scope,
        $state,
        $stateParams = {},
        authenticateDeferred,
        ctrl,
        fetchCurrentUserDeferred,
        globals,
        AuthenticationManager,
        CommonService,
        UserManager;

    describe("A Login Controller", function () {

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

            // mock dependencies
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["authenticate"]);
            UserManager = jasmine.createSpyObj("UserManager", ["fetchCurrentUserDetails"]);
            $state = jasmine.createSpyObj("state", ["go"]);

            inject(function (_$rootScope_, $controller, _$ionicHistory_, $q, _globals_, _CommonService_) {
                $ionicHistory = _$ionicHistory_;
                $scope = _$rootScope_.$new();
                authenticateDeferred = $q.defer();
                fetchCurrentUserDeferred = $q.defer();
                globals = _globals_;
                $rootScope = _$rootScope_;
                CommonService = _CommonService_;

                ctrl = $controller("LoginController", {
                    $scope: $scope,
                    $state: $state,
                    $stateParams: $stateParams,
                    globals: globals,
                    AuthenticationManager: AuthenticationManager,
                    CommonService: CommonService,
                    UserManager: UserManager
                });

                spyOn(CommonService, "logOut");

            });

        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function() {
                spyOn($ionicHistory, "clearHistory");

                //setup an existing values to test them being modified
                ctrl.globalError = "This is a previous error";
            });

            describe("when $stateParams.reason is TOKEN_EXPIRED", function () {

                beforeEach(function() {
                    $stateParams.reason = "TOKEN_EXPIRED";

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should set the error", function () {
                    expect(ctrl.globalError).toEqual("Your session has expired. Please login again.");
                });

            });

            describe("when $stateParams.reason is an object", function () {

                beforeEach(function() {
                    $stateParams.reason = {
                        randomProperty       : "Property value",
                        anotherRandomProperty: "Another property value"
                    };

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

            });

            describe("when $stateParams.reason is empty string", function () {

                beforeEach(function() {
                    $stateParams.reason = "";

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

            });

            describe("when $stateParams.reason is null", function () {

                beforeEach(function() {
                    $stateParams.reason = null;

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

            });

            describe("when $stateParams.reason is undefined", function () {

                beforeEach(function() {
                    delete $stateParams.reason;

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

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

                    it("should call CommonService.logOut", function () {
                        expect(CommonService.logOut).toHaveBeenCalledWith();
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

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
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

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
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

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
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

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
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

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
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

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
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

                it("should call CommonService.logOut", function () {
                    expect(CommonService.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual("We're sorry but you are not able to manage your account via the mobile application at this time. Please use Fleet Manager Online, our full feature site.");
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

            });

        });

    });

}());