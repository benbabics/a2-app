(function () {
    "use strict";

    describe("A FingerprintProfileUtil Service", function () {

        var _,
            $q,
            $rootScope,
            FingerprintProfileUtil,
            resolveHandler,
            rejectHandler,
            self;

        beforeEach(function () {
            self = this;

            self.StorageManager = jasmine.createSpyObj("StorageManager", [
                "get",
                "set",
                "remove"
            ]);

            module(function ($provide) {
                $provide.value("StorageManager", self.StorageManager);
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

        afterEach(function () {
            self = null;
        });

        describe("has a clearProfile function that", function () {
            var username,
                removeDeferred;

            beforeEach(function () {
                username = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                removeDeferred = $q.defer();

                this.StorageManager.remove.and.returnValue(removeDeferred.promise);

                FingerprintProfileUtil.clearProfile(username)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call this.StorageManager.remove with the expected values", function () {
                expect(this.StorageManager.remove).toHaveBeenCalledWith(_.toLower(username), {secure: true});
            });

            describe("when this.StorageManager.remove resolves", function () {
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

            describe("when this.StorageManager.remove rejects", function () {
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

                this.StorageManager.get.and.returnValue(getDeferred.promise);

                FingerprintProfileUtil.getProfile(username)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call this.StorageManager.get with the expected values", function () {
                expect(this.StorageManager.get).toHaveBeenCalledWith(_.toLower(username), {secure: true});
            });

            describe("when this.StorageManager.get resolves", function () {
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

            describe("when this.StorageManager.get rejects", function () {
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

                this.StorageManager.set.and.returnValue(setDeferred.promise);

                FingerprintProfileUtil.setProfile(username, password)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call this.StorageManager.set with the expected values", function () {
                expect(this.StorageManager.set).toHaveBeenCalledWith("USERNAME", username);
                expect(this.StorageManager.set).toHaveBeenCalledWith(_.toLower(username), password, {secure: true});
            });

            describe("when this.StorageManager.set resolves", function () {
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

            describe("when this.StorageManager.set rejects", function () {
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
