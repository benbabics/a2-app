(function () {
    "use strict";

    var _,
        $rootScope,
        $q,
        SecureStorage,
        sessionCredentials,
        handlerDeferred,
        handlerResolve,
        handlerReject;

    describe("A Session Credentials Service", function () {

        beforeEach(function () {

            // mock dependencies
            SecureStorage = jasmine.createSpy( "SecureStorage" );

            module(function ($provide) {
                $provide.value( "SecureStorage", SecureStorage );
            });

            inject(function (___, _$rootScope_, _$q_, _sessionCredentials_) {
                _                  = ___;
                $q                 = _$q_;
                $rootScope         = _$rootScope_;
                sessionCredentials = _sessionCredentials_;
            });

            handlerDeferred = $q.defer();
            handlerResolve  = jasmine.createSpy( "handlerResolve" );
            handlerReject   = jasmine.createSpy( "handlerReject" );
        });

        describe("has a set function that", function () {
            beforeEach(function () {
                SecureStorage.set = function() { return handlerDeferred.promise };
                handlerDeferred.resolve();
            });

            it("should successfully accept clientId and clientSecret values", function () {
                sessionCredentials.set({ clientId: "foo", clientSecret: "bar" }).then( handlerResolve );
                $rootScope.$digest();
                expect( handlerResolve ).toHaveBeenCalled();
            });

            it("should fail if clientId or clientSecret are NOT present", function () {
                sessionCredentials.set({ clientId: "foo" }).then( handlerResolve ).catch( handlerReject );
                $rootScope.$digest();
                expect( handlerReject ).toHaveBeenCalled();
                expect( handlerResolve ).not.toHaveBeenCalled();
            });
        });

        describe("has a get function that", function () {
            var credentials;

            beforeEach(function () {
                credentials = { clientId: "foo", clientSecret: "bar" };

                var requests = [
                    { deferred: $q.defer(), value: credentials.clientId },
                    { deferred: $q.defer(), value: credentials.clientSecret }
                ];

                SecureStorage.get = function() {
                    var request = requests.shift();
                    request.deferred.resolve( request.value );
                    return request.deferred.promise;
                };

                handlerDeferred.resolve();
            });

            it("should return an object with properties clientId and a clientSecret", function () {
                sessionCredentials.get().then( handlerResolve );
                $rootScope.$digest();
                expect( handlerResolve ).toHaveBeenCalledWith( credentials );
            });
        });

        describe("has a reset function that", function () {
            beforeEach(function () {
                SecureStorage.remove = function() { return handlerDeferred.promise };
                handlerDeferred.resolve();
            });

            it("should clear the clientId and clientSecret values", function () {
                sessionCredentials.reset().then( handlerResolve );
                $rootScope.$digest();
                expect( handlerResolve ).toHaveBeenCalledWith({ clientId: undefined, clientSecret: undefined });
            });
        });

        describe("listens for app:logout to remove credentials", function () {
            beforeEach(function () {
                SecureStorage.remove = function() {};
                spyOn( sessionCredentials, "reset" );
            });

            it("should send a message to sessionCredentials.reset()", function () {
                $rootScope.$emit( "app:logout" );
                $rootScope.$digest();
                expect( sessionCredentials.reset ).toHaveBeenCalled();
            });
        });

    });

})();
