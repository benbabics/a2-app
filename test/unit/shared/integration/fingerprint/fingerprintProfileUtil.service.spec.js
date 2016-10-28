(function () {
    "use strict";

    describe("A FingerprintProfileUtil Service", function () {

        var _,
            $q,
            $rootScope,
            FingerprintProfileUtil,
            resolveHandler,
            rejectHandler;

        beforeEach(function () {

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

                this.SecureStorage.remove.and.returnValue(removeDeferred.promise);

                FingerprintProfileUtil.clearProfile(username)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call this.SecureStorage.remove with the expected values", function () {
                expect(this.SecureStorage.remove).toHaveBeenCalledWith(_.toLower(username));
            });

            describe("when this.SecureStorage.remove resolves", function () {
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

            describe("when this.SecureStorage.remove rejects", function () {
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

                this.SecureStorage.get.and.returnValue(getDeferred.promise);

                FingerprintProfileUtil.getProfile(username)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call this.SecureStorage.get with the expected values", function () {
                expect(this.SecureStorage.get).toHaveBeenCalledWith(_.toLower(username));
            });

            describe("when this.SecureStorage.get resolves", function () {
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

            describe("when this.SecureStorage.get rejects", function () {
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

                this.SecureStorage.set.and.returnValue(setDeferred.promise);

                FingerprintProfileUtil.setProfile(username, password)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call this.SecureStorage.set with the expected values", function () {
                expect(this.SecureStorage.set).toHaveBeenCalledWith(_.toLower(username), password);
            });

            describe("when this.SecureStorage.set resolves", function () {
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

            describe("when this.SecureStorage.set rejects", function () {
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
