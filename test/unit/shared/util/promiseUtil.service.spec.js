(function () {
    "use strict";

    describe("A PromiseUtil service", function () {

        var _,
            $q,
            $rootScope,
            PromiseUtil,
            resolveHandler,
            rejectHandler;

        beforeEach(inject(function (___, _$rootScope_, _$q_, _PromiseUtil_) {
            _ = ___;
            $q = _$q_;
            $rootScope = _$rootScope_;
            PromiseUtil = _PromiseUtil_;

            //setup spies:
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
        }));

        describe("has an allFinished function that", function () {
            var deferred,
                promises;

            beforeEach(function () {
                deferred = $q.defer();
                promises = _.fill(new Array(TestUtils.getRandomInteger(1, 10)), deferred.promise);

                PromiseUtil.allFinished(promises)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            describe("when the promises are resolved", function () {
                var value;

                beforeEach(function () {
                    value = TestUtils.getRandomStringThatIsAlphaNumeric(15);

                    deferred.resolve(value);
                    $rootScope.$digest();
                });

                it("should resolve with an array containing the resolved values", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(_.fill(new Array(promises.length), value));
                });
            });

            describe("when the promises are rejected", function () {
                var error;

                beforeEach(function () {
                    error = {
                        message: TestUtils.getRandomStringThatIsAlphaNumeric(15)
                    };

                    deferred.reject(error);
                    TestUtils.digestError($rootScope);
                });

                //TODO: Figure out why this test fails when run with PhantomJS
                xit("should reject with an array containing the errors", function () {
                    expect(rejectHandler).toHaveBeenCalledWith(_.fill(new Array(promises.length), error));
                });
            });
        });

        describe("has a rejectAfter function that", function () {

            describe("when given a promise", function () {
                var deferred;

                beforeEach(function () {
                    deferred = $q.defer();
                });

                describe("when given a reason", function () {
                    var reason;

                    beforeEach(function () {
                        reason = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    });

                    beforeEach(function () {
                        PromiseUtil.rejectAfter(deferred.promise, reason)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    describe("when the promise resolves", function () {

                        beforeEach(function () {
                            deferred.resolve();
                            TestUtils.digestError($rootScope);
                        });

                        it("should reject the promise with the given reason", function () {
                            expect(rejectHandler).toHaveBeenCalledWith(reason);
                        });
                    });

                    describe("when the promise rejects", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            deferred.reject(error);
                            TestUtils.digestError($rootScope);
                        });

                        it("should reject the promise with the expected error", function () {
                            expect(rejectHandler).toHaveBeenCalledWith(error);
                        });
                    });
                });

                describe("when NOT given a reason", function () {

                    beforeEach(function () {
                        PromiseUtil.rejectAfter(deferred.promise)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    describe("when the promise resolves", function () {

                        beforeEach(function () {
                            deferred.resolve();
                            TestUtils.digestError($rootScope);
                        });

                        it("should reject the promise", function () {
                            expect(rejectHandler).toHaveBeenCalled();
                        });
                    });

                    describe("when the promise rejects", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            deferred.reject(error);
                            TestUtils.digestError($rootScope);
                        });

                        it("should reject the promise with the expected error", function () {
                            expect(rejectHandler).toHaveBeenCalledWith(error);
                        });
                    });
                });
            });

            describe("when NOT given a promise", function () {

                describe("when given a reason", function () {
                    var reason;

                    beforeEach(function () {
                        reason = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    });

                    beforeEach(function () {
                        PromiseUtil.rejectAfter(undefined, reason)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                        TestUtils.digestError($rootScope);
                    });

                    it("should reject the promise with the given reason", function () {
                        expect(rejectHandler).toHaveBeenCalledWith(reason);
                    });
                });

                describe("when NOT given a reason", function () {

                    beforeEach(function () {
                        PromiseUtil.rejectAfter(undefined)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                        TestUtils.digestError($rootScope);
                    });

                    it("should reject the promise", function () {
                        expect(rejectHandler).toHaveBeenCalled();
                    });
                });
            });
        });
    });
})();