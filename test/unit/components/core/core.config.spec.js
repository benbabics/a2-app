(function () {
    "use strict";

    describe("A Core Module config", function () {

        var $rootScope,
            $state,
            $compileProvider,
            $ionicConfigProvider,
            $urlRouterProvider,
            IdleProvider,
            ionicDatePickerProvider,
            appGlobals,
            AuthenticationManager,
            sharedGlobals;

        beforeAll(function () {
            this.deferIncludes = true;
            this.includeHtml = true;
        });

        beforeEach(function () {
            module("app.shared", function (_$compileProvider_, _$ionicConfigProvider_, _$urlRouterProvider_, _IdleProvider_, _ionicDatePickerProvider_) {
                $ionicConfigProvider = _$ionicConfigProvider_;
                $urlRouterProvider = _$urlRouterProvider_;
                $compileProvider = _$compileProvider_;
                IdleProvider = _IdleProvider_;
                ionicDatePickerProvider = _ionicDatePickerProvider_;

                $compileProvider.imgSrcSanitizationWhitelist = jasmine.createSpy("imgSrcSanitizationWhitelist");
                $urlRouterProvider.otherwise = jasmine.createSpy("otherwise");
                $ionicConfigProvider.backButton.text = jasmine.createSpy("text");
                $ionicConfigProvider.backButton.previousTitleText = jasmine.createSpy("previousTitleText");
                IdleProvider.idle = jasmine.createSpy("idle");
                IdleProvider.timeout = jasmine.createSpy("timeout");
                ionicDatePickerProvider.configDatePicker = jasmine.createSpy("configDatePicker");
            });

            this.includeDependencies();

            // mock deps:
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["logOut", "userLoggedIn"]);

            inject(function(_$rootScope_, _$state_, _appGlobals_, _sharedGlobals_) {
                $rootScope = _$rootScope_;
                $state = _$state_;
                appGlobals = _appGlobals_;
                sharedGlobals = _sharedGlobals_;

                spyOn( $rootScope, "$on" ).and.callThrough();
                spyOn( $urlRouterProvider, "rule" ).and.callThrough();
            });

            appGlobals.LOGIN_STATE = "user.auth.login";
        });

        it("should set the default route to the expected value", function () {
            expect($urlRouterProvider.otherwise).toHaveBeenCalledWith(appGlobals.DEFAULT_ROUTE);
        });

        it("should set the back button text to the expected value", function () {
            expect($ionicConfigProvider.backButton.text).toHaveBeenCalledWith("");
        });

        it("should set the previous title text to be false", function () {
            expect($ionicConfigProvider.backButton.previousTitleText).toHaveBeenCalledWith(false);
        });

        it("should set the img-src sanitization whitelist to the expected value", function () {
            expect($compileProvider.imgSrcSanitizationWhitelist).toHaveBeenCalledWith(/^\s*(https?|file|blob|cdvfile):|data:image\//);
        });

        it("should set the idle timeout length to the expected value", function () {
            expect(IdleProvider.idle).toHaveBeenCalledWith(appGlobals.USER_IDLE_TIMEOUT);
        });

        it("should disable user timeout warning response", function () {
            expect(IdleProvider.timeout).toHaveBeenCalledWith(false);
        });

        it("should set the expected properties for the date picker", function () {
            expect(ionicDatePickerProvider.configDatePicker).toHaveBeenCalledWith(sharedGlobals.DATE_PICKER);
        });

        describe("should set a $urlRouterProvider rule handler that", function () {
            var loginRoute      = "user.auth.login",
                landingRoute    = "landing",
                paymentAddRoute = "payment.add";

            describe("when the user is logged in", function () {
                beforeEach(function () {
                    AuthenticationManager.userLoggedIn.and.returnValue(true);
                });

                describe("when the user is navigating to the login page", function () {
                    beforeEach(function () {
                        $state.go(loginRoute);
                        $rootScope.$digest();
                    });

                    it("should continue to the page", function () {
                        expect($state.current.name).toEqual(loginRoute);
                    });
                });

            });

            describe("when the user is NOT logged in", function () {
                beforeEach(function () {
                    AuthenticationManager.userLoggedIn.and.returnValue(false);
                });

                describe("when the user is navigating to the login page", function () {
                    beforeEach(function () {
                        $state.go(loginRoute);
                        $rootScope.$digest();
                    });

                    it("should continue to the page", function () {
                        expect($state.current.name).toEqual(loginRoute);
                    });
                });
            });
        });

    });

})();
