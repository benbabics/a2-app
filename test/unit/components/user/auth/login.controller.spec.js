(function () {
    "use strict";

    var $rootScope,
        $scope,
        ctrl,
        AuthenticationManager,
        CommonService,
        UserManager,
        globals,
        deferred,
        newUser = {
            username : "",
            password : ""
        },
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
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["authenticate"]);
            CommonService = jasmine.createSpyObj("CommonService", ["loadingBegin", "loadingComplete"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getNewUser"]);
            $state = jasmine.createSpyObj("state", ["go"]);

            UserManager.getNewUser.and.returnValue(newUser);

            inject(function (_$rootScope_, $controller, $q, _globals_) {
                $scope = _$rootScope_.$new();
                deferred = $q.defer();
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
            it("should get a New User", function () {
                expect(UserManager.getNewUser).toHaveBeenCalledWith();
                expect(ctrl.user).toEqual(newUser);
            });

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
                AuthenticationManager.authenticate.and.returnValue(deferred.promise);

                ctrl.user = mockUser;
                ctrl.authenticateUser();
            });

            it("should authenticate the User", function () {
                expect(AuthenticationManager.authenticate).toHaveBeenCalledWith(ctrl.user.username, ctrl.user.password);
            });

            describe("when the User is Authenticated successfully", function () {

                beforeEach(function () {
                    //return a promise object and resolve it
                    deferred.resolve();
                    $scope.$digest();
                });

                it("should NOT have an error message", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                //TODO
                //it("should navigate to the landing page", function () {
                //    expect($state.go).toHaveBeenCalledWith("");
                //});

            });

            describe("when the User is NOT Authenticated successfully", function () {

                var errorReason = "AUTHENTICATION_FAILED";

                beforeEach(function () {
                    //reject with an error message
                    deferred.reject(errorReason);
                    $scope.$digest();
                });

                //TODO - remove this once error messages have been coded
                it("should NOT have an error message", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                //it("should have an error message", function () {
                //    expect(ctrl.globalError).toEqual(ctrl.config.serverErrors[errorReason]);
                //});

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

            });

        });

    });

}());