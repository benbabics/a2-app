(function () {
    "use strict";

    var _,
        $rootScope,
        $state,
        Idle,
        UserIdle,
        globals;

    describe("A UserIdle service", function () {

        beforeEach(function () {
            //mock dependencies
            Idle = jasmine.createSpyObj("Idle", ["unwatch", "idling", "running", "watch"]);

            module(function ($provide) {
                $provide.value("Idle", Idle);
            });

            inject(function (___, _$rootScope_, _$state_, _globals_, _UserIdle_) {
                _ = ___;
                $rootScope = _$rootScope_;
                $state = _$state_;
                UserIdle = _UserIdle_;
                globals = _globals_;

                spyOn($state, "go").and.callThrough();
                spyOn($state, "transitionTo");
            });
        });

        describe("has an IdleStart event handler that", function () {

            beforeEach(function () {
                $rootScope.$broadcast("IdleStart");
                $rootScope.$digest();
            });

            it("should call LoginManager.logOut", function () {
                expect(this.LoginManager.logOut).toHaveBeenCalledWith();
            });

            it("should redirect to the login page with the timedOut flag set", function () {
                expect($state.go).toHaveBeenCalledWith(globals.LOGIN_STATE, {timedOut: true});
            });
        });

        describe("has an app:login event handler that", function () {

            beforeEach(function () {
                $rootScope.$broadcast("app:login");
                $rootScope.$digest();
            });

            it("should call Idle.watch", function () {
                expect(Idle.watch).toHaveBeenCalledWith();
            });
        });

        describe("has an app:logout event handler that", function () {

            beforeEach(function () {
                $rootScope.$broadcast("app:logout");
                $rootScope.$digest();
            });

            it("should call Idle.unwatch", function () {
                expect(Idle.unwatch).toHaveBeenCalledWith();
            });
        });

        describe("has an endWatch function that", function () {

            beforeEach(function () {
                UserIdle.endWatch();
            });

            it("should call Idle.unwatch", function () {
                expect(Idle.unwatch).toHaveBeenCalledWith();
            });
        });

        describe("has an isUserIdle function that", function () {
            var idle;

            beforeEach(function () {
                idle = TestUtils.getRandomBoolean();
                Idle.idling.and.returnValue(idle);
            });

            it("should return the expected value", function () {
                expect(UserIdle.isUserIdle()).toEqual(idle);
            });
        });

        describe("has an isWatching function that", function () {
            var watching;

            beforeEach(function () {
                watching = TestUtils.getRandomBoolean();
                Idle.running.and.returnValue(watching);
            });

            it("should return the expected value", function () {
                expect(UserIdle.isWatching()).toEqual(watching);
            });
        });

        describe("has a startWatch function that", function () {

            beforeEach(function () {
                UserIdle.startWatch();
            });

            it("should call Idle.watch", function () {
                expect(Idle.watch).toHaveBeenCalledWith();
            });
        });
    });
})();
