(function () {
    "use strict";

    describe("A FingerprintProfileUtil Service", function () {

        var _,
            $q,
            $rootScope,
            FingerprintProfileUtil,
            SecureStorage,
            resolveHandler,
            rejectHandler;

        beforeEach(function () {

            module("app.shared", function ($provide) {
                TestUtils.provideCommonMockDependencies($provide, function (mocks) {
                    SecureStorage = mocks.SecureStorage;
                });
            });

            inject(function (___, _$q_, _$rootScope_, _FingerprintProfileUtil_) {
                _ = ___;
                $q = _$q_;
                $rootScope = _$rootScope_;
                FingerprintProfileUtil = _FingerprintProfileUtil_;
            });

            //setup mock dependencies:
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
        });

        describe("has a clearProfile function that", function () {
            var username,
                removeDeferred;

            beforeEach(function () {
                username = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                removeDeferred = $q.defer();

                SecureStorage.remove.and.returnValue(removeDeferred.promise);

                FingerprintProfileUtil.clearProfile(username)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call SecureStorage.remove with the expected values", function () {
                expect(SecureStorage.remove).toHaveBeenCalledWith(_.toLower(username));
            });

            describe("when SecureStorage.remove resolves", function () {
                var result;

                beforeEach(function () {
                    result = {someValue: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                    removeDeferred.resolve(result);
                    $rootScope.$digest();
                });

                it("should resolve with the expected value", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(result);
                });
            });

            describe("when SecureStorage.remove rejects", function () {
                var result;

                beforeEach(function () {
                    result = {someValue: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                    removeDeferred.reject(result);
                    $rootScope.$digest();
                });

                it("should reject with the expected value", function () {
                    expect(rejectHandler).toHaveBeenCalledWith(result);
                });
            });
        });

        describe("has a getProfile function that", function () {
            var username,
                getDeferred;

            beforeEach(function () {
                username = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                getDeferred = $q.defer();

                SecureStorage.get.and.returnValue(getDeferred.promise);

                FingerprintProfileUtil.getProfile(username)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call SecureStorage.get with the expected values", function () {
                expect(SecureStorage.get).toHaveBeenCalledWith(_.toLower(username));
            });

            describe("when SecureStorage.get resolves", function () {
                var result;

                beforeEach(function () {
                    result = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    getDeferred.resolve(result);
                    $rootScope.$digest();
                });

                it("should resolve with the expected value", function () {
                    expect(resolveHandler).toHaveBeenCalledWith({clientSecret: result});
                });
            });

            describe("when SecureStorage.get rejects", function () {
                var result;

                beforeEach(function () {
                    result = {someValue: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                    getDeferred.reject(result);
                    $rootScope.$digest();
                });

                it("should reject with the expected value", function () {
                    expect(rejectHandler).toHaveBeenCalledWith(result);
                });
            });
        });

        describe("has a setProfile function that", function () {
            var username,
                password,
                setDeferred;

            beforeEach(function () {
                username = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                password = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                setDeferred = $q.defer();

                SecureStorage.set.and.returnValue(setDeferred.promise);

                FingerprintProfileUtil.setProfile(username, password)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call SecureStorage.set with the expected values", function () {
                expect(SecureStorage.set).toHaveBeenCalledWith(_.toLower(username), password);
            });

            describe("when SecureStorage.set resolves", function () {
                var result;

                beforeEach(function () {
                    result = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    setDeferred.resolve(result);
                    $rootScope.$digest();
                });

                it("should resolve with the expected value", function () {
                    expect(resolveHandler).toHaveBeenCalledWith({clientSecret: password});
                });
            });

            describe("when SecureStorage.set rejects", function () {
                var result;

                beforeEach(function () {
                    result = {someValue: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                    setDeferred.reject(result);
                    $rootScope.$digest();
                });

                it("should reject with the expected value", function () {
                    expect(rejectHandler).toHaveBeenCalledWith(result);
                });
            });
        });
    });
})();
