(function () {
    "use strict";

    describe("A Version Module Route Config", function () {

        var $injector,
            $interval,
            $q,
            $rootScope,
            $state,
            mockVersionStatus,
            PlatformUtil,
            VersionManager;

        beforeEach(function () {

            // mock dependencies
            VersionManager = jasmine.createSpyObj("VersionManager", ["determineVersionStatus"]);

            module(function ($provide) {
                $provide.value("VersionManager", VersionManager);
            });

            inject(function (_$injector_, _$interval_, _$q_, _$rootScope_, _$state_, _PlatformUtil_, VersionStatusModel) {
                $injector = _$injector_;
                $interval = _$interval_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
                PlatformUtil = _PlatformUtil_;

                mockVersionStatus = TestUtils.getRandomVersionStatus(VersionStatusModel);
            });

            this.PlatformUtil.waitForCordovaPlatform.and.callFake(function(callback) {
                return $q.when((callback || function() {})());
            });

        });

        describe("has a version state that", function () {
            var state,
                stateName = "version";

            beforeEach(function() {
                state = $state.get(stateName);
            });

            it("should be defined", function() {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function() {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function() {
                expect(state.url).toEqual("/version");
            });
        });

        describe("has a version.status state that", function () {
            var state,
                stateName = "version.status";

            beforeEach(function() {
                state = $state.get(stateName);
            });

            it("should be defined", function() {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function() {
                expect(state.url).toEqual("/status");
            });

            it("should define a version view", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@version"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/version/status");
            });

            describe("when navigated to", function () {

                var determineVersionStatusDeferred;

                beforeEach(function () {
                    determineVersionStatusDeferred = $q.defer();
                    VersionManager.determineVersionStatus.and.returnValue(determineVersionStatusDeferred.promise);

                    $state.go(stateName);

                    determineVersionStatusDeferred.resolve(mockVersionStatus);
                    $rootScope.$digest();
                });

                it("should call VersionManager.determineVersionStatus", function () {
                    expect(VersionManager.determineVersionStatus).toHaveBeenCalledWith();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve the versionStatus", function () {
                    $injector.invoke($state.current.views["view@version"].resolve.versionStatus)
                        .then(function (versionStatus) {
                            expect(versionStatus).toEqual(mockVersionStatus);
                        });
                });

                it("should NOT call this.$cordovaSplashscreen.hide", function () {
                    expect(this.$cordovaSplashscreen.hide).not.toHaveBeenCalled();
                });

                describe("after 2000ms have passed", function () {

                    beforeEach(function () {
                        $interval.flush(2000);
                        $rootScope.$digest();
                    });

                    it("should call this.$cordovaSplashscreen.hide", function () {
                        expect(this.$cordovaSplashscreen.hide).toHaveBeenCalledWith();
                    });
                });

            });
        });
    });
})();
