(function () {
    "use strict";

    describe("A Version Module Route Config", function () {

        var $injector,
            $q,
            $rootScope,
            $state,
            mockVersionStatus,
            LoadingIndicator,
            VersionUtil;

        beforeEach(function () {

            module("app.shared");
            module("app.components.version");
            module("app.html");

            // mock dependencies
            LoadingIndicator = jasmine.createSpyObj("LoadingIndicator", ["begin", "complete"]);
            VersionUtil = jasmine.createSpyObj("VersionUtil", ["determineVersionStatus"]);

            module(function ($provide) {
                $provide.value("LoadingIndicator", LoadingIndicator);
                $provide.value("VersionUtil", VersionUtil);
            });

            inject(function (_$injector_, _$q_, _$rootScope_, _$state_, VersionStatusModel) {
                $injector = _$injector_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;

                mockVersionStatus = TestUtils.getRandomVersionStatus(VersionStatusModel);
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
                    VersionUtil.determineVersionStatus.and.returnValue(determineVersionStatusDeferred.promise);

                    $state.go(stateName);

                    determineVersionStatusDeferred.resolve(mockVersionStatus);
                    $rootScope.$digest();
                });

                it("should call VersionUtil.determineVersionStatus", function () {
                    expect(VersionUtil.determineVersionStatus).toHaveBeenCalledWith();
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

            });
        });
    });
})();
