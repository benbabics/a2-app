(function () {
    "use strict";

    var $q,
        $rootScope,
        $scope,
        $state,
        ctrl,
        globals,
        mockGlobals = {
            LOGIN_STATE: "user.auth.login",
            VERSION_STATUS: {
                APP_STORES: {

                }
            }
        },
        versionStatus,
        PlatformUtil,
        VersionStatusModel;

    describe("A VersionStatus Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.version");

            module("app.components", function ($provide, sharedGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, mockGlobals));
            });

            module(function ($provide, sharedGlobals, appGlobals) {
                globals = angular.merge({}, sharedGlobals, appGlobals, mockGlobals);
                $provide.constant("globals", globals);
            });

            // mock dependencies
            $state = jasmine.createSpyObj("$state", [
                "go"
            ]);
            PlatformUtil = jasmine.createSpyObj("PlatformUtil", [
                "getPlatform",
                "platformSupportsAppVersion",
                "waitForCordovaPlatform"
            ]);

            inject(function ($controller, _$q_, _$rootScope_, _VersionStatusModel_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                $scope = $rootScope.$new();
                VersionStatusModel = _VersionStatusModel_;

                versionStatus = TestUtils.getRandomVersionStatus(VersionStatusModel);

                ctrl = $controller("VersionStatusController", {
                    $scope       : $scope,
                    $state       : $state,
                    versionStatus: versionStatus,
                    PlatformUtil : PlatformUtil
                });
            });

            //setup spies
            PlatformUtil.waitForCordovaPlatform.and.callFake(function(callback) {
                //just execute the callback directly
                return $q.when((callback || function() {})());
            });

        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            describe("when versionStatus is a VersionStatusModel", function () {

                describe("when versionStatus.status is 'warn'", function () {
                    beforeEach(function () {
                        versionStatus.status = globals.CONFIGURATION_API.VERSIONS.STATUS_VALUES.CAN_UPDATE;
                        $scope.$broadcast("$ionicView.beforeEnter");
                    });

                    it("should set the config correctly", function () {
                        expect(ctrl.config).toEqual(angular.merge({}, globals.VERSION_STATUS.CONFIG, globals.VERSION_STATUS.WARN));
                    });

                    it("should NOT redirect to a different page", function () {
                        expect($state.go).not.toHaveBeenCalled();
                    });
                });

                describe("when versionStatus.status is 'fail'", function () {
                    beforeEach(function () {
                        versionStatus.status = globals.CONFIGURATION_API.VERSIONS.STATUS_VALUES.MUST_UPDATE;
                        $scope.$broadcast("$ionicView.beforeEnter");
                    });

                    it("should redirect to the login state", function () {
                        expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE);
                    });
                });

                describe("when versionStatus.status is a random string", function () {
                    beforeEach(function () {
                        versionStatus.status = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                        $scope.$broadcast("$ionicView.beforeEnter");
                    });

                    it("should redirect to the login state", function () {
                        expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE);
                    });
                });

                describe("when versionStatus.status is an empty string", function () {
                    beforeEach(function () {
                        versionStatus.status = "";
                        $scope.$broadcast("$ionicView.beforeEnter");
                    });

                    it("should redirect to the login state", function () {
                        expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE);
                    });
                });

                describe("when versionStatus.status is null", function () {
                    beforeEach(function () {
                        versionStatus.status = null;
                        $scope.$broadcast("$ionicView.beforeEnter");
                    });

                    it("should redirect to the login state", function () {
                        expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE);
                    });
                });

                describe("when versionStatus.status is undefined", function () {
                    beforeEach(function () {
                        delete versionStatus.status;
                        $scope.$broadcast("$ionicView.beforeEnter");
                    });

                    it("should redirect to the login state", function () {
                        expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE);
                    });
                });

            });

            describe("when versionStatus is NOT a VersionStatusModel", function () {
                beforeEach(function () {
                    versionStatus = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should redirect to the login state", function () {
                    expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE);
                });
            });

        });

        describe("has a skipUpdate function that", function () {

            beforeEach(function () {
                ctrl.skipUpdate();
            });

            it("should redirect to the login state", function () {
                expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE);
            });

        });

        describe("has an update function that", function () {

            var platform,
                url;

            beforeEach(function () {
                platform = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                url = TestUtils.getRandomStringThatIsAlphaNumeric(50);

                globals.VERSION_STATUS.APP_STORES[platform.toLowerCase()] = url;

                PlatformUtil.getPlatform.and.returnValue(platform);

                window.cordova = {
                    plugins: {
                        market: {
                            open: jasmine.createSpy("open")
                        }
                    }
                };

                ctrl.update();

                $rootScope.$digest();
            });

            xit("should open the market plugin", function () {
                expect(window.cordova.plugins.market.open).toHaveBeenCalledWith(url);
            });

        });

    });

}());
