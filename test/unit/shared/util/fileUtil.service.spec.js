(function () {
    "use strict";

    var file,
        directory,
        parentDirectory,
        defaultDirectory = "cdvfile:///",
        writeExistingFileDeferred,
        checkDirDeferred,
        checkFileDeferred,
        createDirDeferred,
        createFileDeferred,
        readAsBinaryStringDeferred,
        readAsTextDeferred,
        readAsDataURLDeferred,
        removeRecursivelyDeferred,
        removeDirDeferred,
        removeFileDeferred,
        writeFileDeferred,
        mocks = {};

    describe("A File Util service", function () {

        module.sharedInjector();

        beforeAll(function () {
            this.includeDependencies({
                includeAppDependencies: false,
                mocks: mocks
            }, this);

            //mock dependencies:
            mocks.$cordovaFile = jasmine.createSpyObj("$cordovaFile", [
                "writeExistingFile",
                "checkDir",
                "checkFile",
                "createDir",
                "createFile",
                "readAsBinaryString",
                "readAsText",
                "readAsDataURL",
                "removeRecursively",
                "removeDir",
                "removeFile",
                "writeFile"
            ]);

            module(function ($provide) {
                $provide.value("$cordovaFile", mocks.$cordovaFile);
            });

            inject(function ($rootScope, $q, FileUtil, LoggerUtil) {
                mocks.FileUtil = FileUtil;
                mocks.LoggerUtil = LoggerUtil;
                mocks.$q = $q;
                mocks.$rootScope = $rootScope;
            });

            //setup spies:
            mocks.PlatformUtil.waitForCordovaPlatform.and.callFake(function (callback) {
                //just execute the callback directly
                return mocks.$q.when((callback || function () {
                })());
            });
            mocks.resolveHandler = jasmine.createSpy("resolveHandler");
            mocks.rejectHandler = jasmine.createSpy("rejectHandler");

            window.cordova = {
                file: {
                    dataDirectory: defaultDirectory
                }
            };
        });

        beforeEach(function () {
            file = TestUtils.getRandomStringThatIsAlphaNumeric(15);
            directory = TestUtils.getRandomStringThatIsAlphaNumeric(10) + "/";
            parentDirectory = TestUtils.getRandomStringThatIsAlphaNumeric(10) + "/";
            writeExistingFileDeferred = mocks.$q.defer();
            checkDirDeferred = mocks.$q.defer();
            checkFileDeferred = mocks.$q.defer();
            createDirDeferred = mocks.$q.defer();
            createFileDeferred = mocks.$q.defer();
            readAsBinaryStringDeferred = mocks.$q.defer();
            readAsTextDeferred = mocks.$q.defer();
            readAsDataURLDeferred = mocks.$q.defer();
            removeRecursivelyDeferred = mocks.$q.defer();
            removeDirDeferred = mocks.$q.defer();
            removeFileDeferred = mocks.$q.defer();
            writeFileDeferred = mocks.$q.defer();

            //setup mocks:
            mocks.$cordovaFile.writeExistingFile.and.returnValue(writeExistingFileDeferred.promise);
            mocks.$cordovaFile.checkDir.and.returnValue(checkDirDeferred.promise);
            mocks.$cordovaFile.checkFile.and.returnValue(checkFileDeferred.promise);
            mocks.$cordovaFile.createDir.and.returnValue(createDirDeferred.promise);
            mocks.$cordovaFile.createFile.and.returnValue(createFileDeferred.promise);
            mocks.$cordovaFile.readAsBinaryString.and.returnValue(readAsBinaryStringDeferred.promise);
            mocks.$cordovaFile.readAsText.and.returnValue(readAsTextDeferred.promise);
            mocks.$cordovaFile.readAsDataURL.and.returnValue(readAsDataURLDeferred.promise);
            mocks.$cordovaFile.removeRecursively.and.returnValue(removeRecursivelyDeferred.promise);
            mocks.$cordovaFile.removeDir.and.returnValue(removeDirDeferred.promise);
            mocks.$cordovaFile.removeFile.and.returnValue(removeFileDeferred.promise);
            mocks.$cordovaFile.writeFile.and.returnValue(writeFileDeferred.promise);
        });

        afterEach(function () {
            //reset all mocks
            _.forEach(mocks, TestUtils.resetMock);
        });

        afterAll(function () {
            file = null;
            directory = null;
            parentDirectory = null;
            writeExistingFileDeferred = null;
            checkDirDeferred = null;
            checkFileDeferred = null;
            createDirDeferred = null;
            createFileDeferred = null;
            readAsBinaryStringDeferred = null;
            readAsTextDeferred = null;
            readAsDataURLDeferred = null;
            removeRecursivelyDeferred = null;
            removeDirDeferred = null;
            removeFileDeferred = null;
            writeFileDeferred = null;
            mocks = null;
        });

        describe("has an appendFile function that", function () {
            var data;

            afterAll(function () {
                data = null;
            });

            beforeEach(function () {
                data = TestUtils.getRandomStringThatIsAlphaNumeric(20);
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.appendFile(file, data, parentDirectory)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);

                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.writeExistingFile with the expected values", function () {
                    expect(mocks.$cordovaFile.writeExistingFile).toHaveBeenCalledWith(parentDirectory, file, data);
                });

                describe("when mocks.$cordovaFile.writeExistingFile resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        writeExistingFileDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.writeExistingFile rejects with an error", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        writeExistingFileDeferred.reject(error);

                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                        afterAll(function () {
                            expectedError = null;
                        });

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.appendFile(file, data)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.writeExistingFile with the expected values", function () {
                    expect(mocks.$cordovaFile.writeExistingFile).toHaveBeenCalledWith(defaultDirectory, file, data);
                });

                describe("when mocks.$cordovaFile.writeExistingFile resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        writeExistingFileDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.writeExistingFile rejects with an error", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        writeExistingFileDeferred.reject(error);

                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                        afterAll(function () {
                            expectedError = null;
                        });

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });
        });

        describe("has a checkDirectoryExists function that", function () {

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.checkDirectoryExists(directory, parentDirectory)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.checkDir with the expected values", function () {
                    expect(mocks.$cordovaFile.checkDir).toHaveBeenCalledWith(parentDirectory, directory);
                });

                describe("when mocks.$cordovaFile.checkDir resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        checkDirDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.checkDir rejects", function () {

                    beforeEach(function () {
                        checkDirDeferred.reject();
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that rejects", function () {
                        expect(mocks.rejectHandler).toHaveBeenCalled();
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.checkDirectoryExists(directory)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.checkDir with the expected values", function () {
                    expect(mocks.$cordovaFile.checkDir).toHaveBeenCalledWith(defaultDirectory, directory);
                });

                describe("when mocks.$cordovaFile.checkDir resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        checkDirDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.checkDir rejects", function () {

                    beforeEach(function () {
                        checkDirDeferred.reject();
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that rejects", function () {
                        expect(mocks.rejectHandler).toHaveBeenCalled();
                    });
                });
            });
        });

        describe("has a checkFileExists function that", function () {

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.checkFileExists(file, parentDirectory)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.checkFile with the expected values", function () {
                    expect(mocks.$cordovaFile.checkFile).toHaveBeenCalledWith(parentDirectory, file);
                });

                describe("when mocks.$cordovaFile.checkFile resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        checkFileDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.checkFile rejects", function () {

                    beforeEach(function () {
                        checkFileDeferred.reject();
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that rejects", function () {
                        expect(mocks.rejectHandler).toHaveBeenCalled();
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.checkFileExists(file)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.checkFile with the expected values", function () {
                    expect(mocks.$cordovaFile.checkFile).toHaveBeenCalledWith(defaultDirectory, file);
                });

                describe("when mocks.$cordovaFile.checkFile resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        checkFileDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.checkFile rejects", function () {

                    beforeEach(function () {
                        checkFileDeferred.reject();
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that rejects", function () {
                        expect(mocks.rejectHandler).toHaveBeenCalled();
                    });
                });
            });
        });

        describe("has a createDirectory function that", function () {
            var replaceIfExists;

            afterAll(function () {
                replaceIfExists = null;
            });

            beforeEach(function () {
                replaceIfExists = TestUtils.getRandomBoolean();
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.createDirectory(directory, replaceIfExists, parentDirectory)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.createDir with the expected values", function () {
                    expect(mocks.$cordovaFile.createDir).toHaveBeenCalledWith(parentDirectory, directory, replaceIfExists);
                });

                describe("when mocks.$cordovaFile.createDir resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        createDirDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.createDir rejects with an error", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        createDirDeferred.reject(error);

                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                        afterAll(function () {
                            expectedError = null;
                        });

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.createDirectory(directory, replaceIfExists)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.createDir with the expected values", function () {
                    expect(mocks.$cordovaFile.createDir).toHaveBeenCalledWith(defaultDirectory, directory, replaceIfExists);
                });

                describe("when mocks.$cordovaFile.createDir resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        createDirDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.createDir rejects with an error", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        createDirDeferred.reject(error);

                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                        afterAll(function () {
                            expectedError = null;
                        });

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });
        });

        describe("has a createFile function that", function () {
            var replaceIfExists;

            afterAll(function () {
                replaceIfExists = null;
            });

            beforeEach(function () {
                replaceIfExists = TestUtils.getRandomBoolean();
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.createFile(file, replaceIfExists, parentDirectory)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.createFile with the expected values", function () {
                    expect(mocks.$cordovaFile.createFile).toHaveBeenCalledWith(parentDirectory, file, replaceIfExists);
                });

                describe("when mocks.$cordovaFile.createFile resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        createFileDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.createFile rejects with an error", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        createFileDeferred.reject(error);

                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                        afterAll(function () {
                            expectedError = null;
                        });

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.createFile(file, replaceIfExists)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.createFile with the expected values", function () {
                    expect(mocks.$cordovaFile.createFile).toHaveBeenCalledWith(defaultDirectory, file, replaceIfExists);
                });

                describe("when mocks.$cordovaFile.createFile resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        createFileDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.createFile rejects with an error", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        createFileDeferred.reject(error);

                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                        afterAll(function () {
                            expectedError = null;
                        });

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });
        });

        describe("has a readFile function that", function () {
            var binary;

            afterAll(function () {
                binary = null;
            });

            describe("when binary is true", function () {

                beforeEach(function () {
                    binary = true;
                });

                describe("when given a parentDirectory", function () {

                    beforeEach(function () {
                        mocks.FileUtil.readFile(file, binary, parentDirectory)
                            .then(mocks.resolveHandler)
                            .catch(mocks.rejectHandler);
                        mocks.$rootScope.$digest();
                    });

                    it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                        expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call mocks.$cordovaFile.readAsBinaryString with the expected values", function () {
                        expect(mocks.$cordovaFile.readAsBinaryString).toHaveBeenCalledWith(parentDirectory, file);
                    });

                    describe("when mocks.$cordovaFile.readAsBinaryString resolves with a value", function () {
                        var resolveValue;

                        afterAll(function () {
                            resolveValue = null;
                        });

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            readAsBinaryStringDeferred.resolve(resolveValue);
                            mocks.$rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when mocks.$cordovaFile.readAsBinaryString rejects with an error", function () {
                        var error;

                        afterAll(function () {
                            error = null;
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            readAsBinaryStringDeferred.reject(error);

                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                            afterAll(function () {
                                expectedError = null;
                            });

                            expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                        });
                    });
                });

                describe("when NOT given a parentDirectory", function () {

                    beforeEach(function () {
                        mocks.FileUtil.readFile(file, binary)
                            .then(mocks.resolveHandler)
                            .catch(mocks.rejectHandler);
                        mocks.$rootScope.$digest();
                    });

                    it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                        expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call mocks.$cordovaFile.readAsBinaryString with the expected values", function () {
                        expect(mocks.$cordovaFile.readAsBinaryString).toHaveBeenCalledWith(defaultDirectory, file);
                    });

                    describe("when mocks.$cordovaFile.readAsBinaryString resolves with a value", function () {
                        var resolveValue;

                        afterAll(function () {
                            resolveValue = null;
                        });

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            readAsBinaryStringDeferred.resolve(resolveValue);
                            mocks.$rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when mocks.$cordovaFile.readAsBinaryString rejects with an error", function () {
                        var error;

                        afterAll(function () {
                            error = null;
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            readAsBinaryStringDeferred.reject(error);

                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                            afterAll(function () {
                                expectedError = null;
                            });

                            expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                        });
                    });
                });
            });

            describe("when binary is false", function () {

                beforeEach(function () {
                    binary = false;
                });

                describe("when given a parentDirectory", function () {

                    beforeEach(function () {
                        mocks.FileUtil.readFile(file, binary, parentDirectory)
                            .then(mocks.resolveHandler)
                            .catch(mocks.rejectHandler);
                        mocks.$rootScope.$digest();
                    });

                    it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                        expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call mocks.$cordovaFile.readAsText with the expected values", function () {
                        expect(mocks.$cordovaFile.readAsText).toHaveBeenCalledWith(parentDirectory, file);
                    });

                    describe("when mocks.$cordovaFile.readAsText resolves with a value", function () {
                        var resolveValue;

                        afterAll(function () {
                            resolveValue = null;
                        });

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            readAsTextDeferred.resolve(resolveValue);
                            mocks.$rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when mocks.$cordovaFile.readAsText rejects with an error", function () {
                        var error;

                        afterAll(function () {
                            error = null;
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            readAsTextDeferred.reject(error);

                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                            afterAll(function () {
                                expectedError = null;
                            });

                            expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                        });
                    });
                });

                describe("when NOT given a parentDirectory", function () {

                    beforeEach(function () {
                        mocks.FileUtil.readFile(file, binary)
                            .then(mocks.resolveHandler)
                            .catch(mocks.rejectHandler);
                        mocks.$rootScope.$digest();
                    });

                    it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                        expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call mocks.$cordovaFile.readAsText with the expected values", function () {
                        expect(mocks.$cordovaFile.readAsText).toHaveBeenCalledWith(defaultDirectory, file);
                    });

                    describe("when mocks.$cordovaFile.readAsText resolves with a value", function () {
                        var resolveValue;

                        afterAll(function () {
                            resolveValue = null;
                        });

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            readAsTextDeferred.resolve(resolveValue);
                            mocks.$rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when mocks.$cordovaFile.readAsText rejects with an error", function () {
                        var error;

                        afterAll(function () {
                            error = null;
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            readAsTextDeferred.reject(error);

                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                            afterAll(function () {
                                expectedError = null;
                            });

                            expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                        });
                    });
                });
            });
        });

        describe("has a readFileAsDataUrl function that", function () {

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.readFileAsDataUrl(file, parentDirectory)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.readAsDataURL with the expected values", function () {
                    expect(mocks.$cordovaFile.readAsDataURL).toHaveBeenCalledWith(parentDirectory, file);
                });

                describe("when mocks.$cordovaFile.readAsDataURL resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        readAsDataURLDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.readAsDataURL rejects with an error", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        readAsDataURLDeferred.reject(error);

                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                        afterAll(function () {
                            expectedError = null;
                        });

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.readFileAsDataUrl(file)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.readAsDataURL with the expected values", function () {
                    expect(mocks.$cordovaFile.readAsDataURL).toHaveBeenCalledWith(defaultDirectory, file);
                });

                describe("when mocks.$cordovaFile.readAsDataURL resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        readAsDataURLDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.readAsDataURL rejects with an error", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        readAsDataURLDeferred.reject(error);

                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                        afterAll(function () {
                            expectedError = null;
                        });

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });
        });

        describe("has a removeDirectory function that", function () {
            var recursive;

            afterAll(function () {
                recursive = null;
            });

            describe("when recursive is true", function () {

                beforeEach(function () {
                    recursive = true;
                });

                describe("when given a parentDirectory", function () {

                    beforeEach(function () {
                        mocks.FileUtil.removeDirectory(directory, recursive, parentDirectory)
                            .then(mocks.resolveHandler)
                            .catch(mocks.rejectHandler);
                        mocks.$rootScope.$digest();
                    });

                    it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                        expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call mocks.$cordovaFile.removeRecursively with the expected values", function () {
                        expect(mocks.$cordovaFile.removeRecursively).toHaveBeenCalledWith(parentDirectory, directory);
                    });

                    describe("when mocks.$cordovaFile.removeRecursively resolves with a value", function () {
                        var resolveValue;

                        afterAll(function () {
                            resolveValue = null;
                        });

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            removeRecursivelyDeferred.resolve(resolveValue);
                            mocks.$rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when mocks.$cordovaFile.removeRecursively rejects with an error", function () {
                        var error;

                        afterAll(function () {
                            error = null;
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            removeRecursivelyDeferred.reject(error);

                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                            afterAll(function () {
                                expectedError = null;
                            });

                            expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                        });
                    });
                });

                describe("when NOT given a parentDirectory", function () {

                    beforeEach(function () {
                        mocks.FileUtil.removeDirectory(directory, recursive)
                            .then(mocks.resolveHandler)
                            .catch(mocks.rejectHandler);
                        mocks.$rootScope.$digest();
                    });

                    it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                        expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call mocks.$cordovaFile.removeRecursively with the expected values", function () {
                        expect(mocks.$cordovaFile.removeRecursively).toHaveBeenCalledWith(defaultDirectory, directory);
                    });

                    describe("when mocks.$cordovaFile.removeRecursively resolves with a value", function () {
                        var resolveValue;

                        afterAll(function () {
                            resolveValue = null;
                        });

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            removeRecursivelyDeferred.resolve(resolveValue);
                            mocks.$rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when mocks.$cordovaFile.removeRecursively rejects with an error", function () {
                        var error;

                        afterAll(function () {
                            error = null;
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            removeRecursivelyDeferred.reject(error);

                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                            afterAll(function () {
                                expectedError = null;
                            });

                            expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                        });
                    });
                });
            });

            describe("when recursive is false", function () {

                beforeEach(function () {
                    recursive = false;
                });

                describe("when given a parentDirectory", function () {

                    beforeEach(function () {
                        mocks.FileUtil.removeDirectory(directory, recursive, parentDirectory)
                            .then(mocks.resolveHandler)
                            .catch(mocks.rejectHandler);
                        mocks.$rootScope.$digest();
                    });

                    it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                        expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call mocks.$cordovaFile.removeDir with the expected values", function () {
                        expect(mocks.$cordovaFile.removeDir).toHaveBeenCalledWith(parentDirectory, directory);
                    });

                    describe("when mocks.$cordovaFile.removeDir resolves with a value", function () {
                        var resolveValue;

                        afterAll(function () {
                            resolveValue = null;
                        });

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            removeDirDeferred.resolve(resolveValue);
                            mocks.$rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when mocks.$cordovaFile.removeDir rejects with an error", function () {
                        var error;

                        afterAll(function () {
                            error = null;
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            removeDirDeferred.reject(error);

                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                            afterAll(function () {
                                expectedError = null;
                            });

                            expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                        });
                    });
                });

                describe("when NOT given a parentDirectory", function () {

                    beforeEach(function () {
                        mocks.FileUtil.removeDirectory(directory, recursive)
                            .then(mocks.resolveHandler)
                            .catch(mocks.rejectHandler);
                        mocks.$rootScope.$digest();
                    });

                    it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                        expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call mocks.$cordovaFile.removeDir with the expected values", function () {
                        expect(mocks.$cordovaFile.removeDir).toHaveBeenCalledWith(defaultDirectory, directory);
                    });

                    describe("when mocks.$cordovaFile.removeDir resolves with a value", function () {
                        var resolveValue;

                        afterAll(function () {
                            resolveValue = null;
                        });

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            removeDirDeferred.resolve(resolveValue);
                            mocks.$rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when mocks.$cordovaFile.removeDir rejects with an error", function () {
                        var error;

                        afterAll(function () {
                            error = null;
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            removeDirDeferred.reject(error);

                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                            afterAll(function () {
                                expectedError = null;
                            });

                            expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                        });
                    });
                });
            });
        });

        describe("has a removeFile function that", function () {

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.removeFile(file, parentDirectory)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.removeFile with the expected values", function () {
                    expect(mocks.$cordovaFile.removeFile).toHaveBeenCalledWith(parentDirectory, file);
                });

                describe("when mocks.$cordovaFile.removeFile resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        removeFileDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.removeFile rejects with an error", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        removeFileDeferred.reject(error);

                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                        afterAll(function () {
                            expectedError = null;
                        });

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.removeFile(file)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.removeFile with the expected values", function () {
                    expect(mocks.$cordovaFile.removeFile).toHaveBeenCalledWith(defaultDirectory, file);
                });

                describe("when mocks.$cordovaFile.removeFile resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        removeFileDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.removeFile rejects with an error", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        removeFileDeferred.reject(error);

                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                        afterAll(function () {
                            expectedError = null;
                        });

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });
        });

        describe("has a writeFile function that", function () {
            var data,
                replaceIfExists;

            afterAll(function () {
                data = null;
                replaceIfExists = null;
            });

            beforeEach(function () {
                data = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                replaceIfExists = TestUtils.getRandomBoolean();
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.writeFile(file, data, replaceIfExists, parentDirectory)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.writeFile with the expected values", function () {
                    expect(mocks.$cordovaFile.writeFile).toHaveBeenCalledWith(parentDirectory, file, data, replaceIfExists);
                });

                describe("when mocks.$cordovaFile.writeFile resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        writeFileDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.writeFile rejects with an error", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        writeFileDeferred.reject(error);

                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                        afterAll(function () {
                            expectedError = null;
                        });

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    mocks.FileUtil.writeFile(file, data, replaceIfExists)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.PlatformUtil.waitForCordovaPlatform", function () {
                    expect(mocks.PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call mocks.$cordovaFile.writeFile with the expected values", function () {
                    expect(mocks.$cordovaFile.writeFile).toHaveBeenCalledWith(defaultDirectory, file, data, replaceIfExists);
                });

                describe("when mocks.$cordovaFile.writeFile resolves with a value", function () {
                    var resolveValue;

                    afterAll(function () {
                        resolveValue = null;
                    });

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        writeFileDeferred.resolve(resolveValue);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when mocks.$cordovaFile.writeFile rejects with an error", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        writeFileDeferred.reject(error);

                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "File operation failed: " + mocks.LoggerUtil.getErrorMessage(error);

                        afterAll(function () {
                            expectedError = null;
                        });

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });
        });
    });
}());
