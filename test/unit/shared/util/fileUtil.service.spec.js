(function () {
    "use strict";

    var FileUtil,
        PlatformUtil,
        LoggerUtil,
        $cordovaFile,
        $q,
        $rootScope,
        file,
        directory,
        parentDirectory,
        defaultDirectory = "cdvfile:///",
        resolveHandler,
        rejectHandler,
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
        writeFileDeferred;

    describe("A File Util service", function () {

        beforeEach(function () {

            module("app.shared");

            //mock dependencies:
            $cordovaFile = jasmine.createSpyObj("$cordovaFile", [
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
                $provide.value("$cordovaFile", $cordovaFile);
            });

            inject(function (_$rootScope_, _$q_, _FileUtil_, _PlatformUtil_, _LoggerUtil_) {
                FileUtil = _FileUtil_;
                LoggerUtil = _LoggerUtil_;
                PlatformUtil = _PlatformUtil_;
                $q = _$q_;
                $rootScope = _$rootScope_;
            });

            //setup spies:
            spyOn(PlatformUtil, "waitForCordovaPlatform").and.callFake(function(callback) {
                //just execute the callback directly
                return $q.when((callback || function() {})());
            });
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            window.cordova = {
                file: {
                    dataDirectory: defaultDirectory
                }
            };
            file = TestUtils.getRandomStringThatIsAlphaNumeric(15);
            directory = TestUtils.getRandomStringThatIsAlphaNumeric(10) + "/";
            parentDirectory = TestUtils.getRandomStringThatIsAlphaNumeric(10) + "/";
            writeExistingFileDeferred = $q.defer();
            checkDirDeferred = $q.defer();
            checkFileDeferred = $q.defer();
            createDirDeferred = $q.defer();
            createFileDeferred = $q.defer();
            readAsBinaryStringDeferred = $q.defer();
            readAsTextDeferred = $q.defer();
            readAsDataURLDeferred = $q.defer();
            removeRecursivelyDeferred = $q.defer();
            removeDirDeferred = $q.defer();
            removeFileDeferred = $q.defer();
            writeFileDeferred = $q.defer();

            //setup mocks:
            $cordovaFile.writeExistingFile.and.returnValue(writeExistingFileDeferred.promise);
            $cordovaFile.checkDir.and.returnValue(checkDirDeferred.promise);
            $cordovaFile.checkFile.and.returnValue(checkFileDeferred.promise);
            $cordovaFile.createDir.and.returnValue(createDirDeferred.promise);
            $cordovaFile.createFile.and.returnValue(createFileDeferred.promise);
            $cordovaFile.readAsBinaryString.and.returnValue(readAsBinaryStringDeferred.promise);
            $cordovaFile.readAsText.and.returnValue(readAsTextDeferred.promise);
            $cordovaFile.readAsDataURL.and.returnValue(readAsDataURLDeferred.promise);
            $cordovaFile.removeRecursively.and.returnValue(removeRecursivelyDeferred.promise);
            $cordovaFile.removeDir.and.returnValue(removeDirDeferred.promise);
            $cordovaFile.removeFile.and.returnValue(removeFileDeferred.promise);
            $cordovaFile.writeFile.and.returnValue(writeFileDeferred.promise);
        });

        describe("has an appendFile function that", function () {
            var data;

            beforeEach(function () {
                data = TestUtils.getRandomStringThatIsAlphaNumeric(20);
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.appendFile(file, data, parentDirectory)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.writeExistingFile with the expected values", function () {
                    expect($cordovaFile.writeExistingFile).toHaveBeenCalledWith(parentDirectory, file, data);
                });

                describe("when $cordovaFile.writeExistingFile resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        writeExistingFileDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.writeExistingFile rejects with an error", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        writeExistingFileDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.appendFile(file, data)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.writeExistingFile with the expected values", function () {
                    expect($cordovaFile.writeExistingFile).toHaveBeenCalledWith(defaultDirectory, file, data);
                });

                describe("when $cordovaFile.writeExistingFile resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        writeExistingFileDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.writeExistingFile rejects with an error", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        writeExistingFileDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });
        });

        describe("has a checkDirectoryExists function that", function () {

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.checkDirectoryExists(directory, parentDirectory)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.checkDir with the expected values", function () {
                    expect($cordovaFile.checkDir).toHaveBeenCalledWith(parentDirectory, directory);
                });

                describe("when $cordovaFile.checkDir resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        checkDirDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.checkDir rejects", function () {

                    beforeEach(function () {
                        checkDirDeferred.reject();
                        $rootScope.$digest();
                    });

                    it("should return a promise that rejects", function () {
                        expect(rejectHandler).toHaveBeenCalled();
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.checkDirectoryExists(directory)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.checkDir with the expected values", function () {
                    expect($cordovaFile.checkDir).toHaveBeenCalledWith(defaultDirectory, directory);
                });

                describe("when $cordovaFile.checkDir resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        checkDirDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.checkDir rejects", function () {

                    beforeEach(function () {
                        checkDirDeferred.reject();
                        $rootScope.$digest();
                    });

                    it("should return a promise that rejects", function () {
                        expect(rejectHandler).toHaveBeenCalled();
                    });
                });
            });
        });

        describe("has a checkFileExists function that", function () {

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.checkFileExists(file, parentDirectory)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.checkFile with the expected values", function () {
                    expect($cordovaFile.checkFile).toHaveBeenCalledWith(parentDirectory, file);
                });

                describe("when $cordovaFile.checkFile resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        checkFileDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.checkFile rejects", function () {

                    beforeEach(function () {
                        checkFileDeferred.reject();
                        $rootScope.$digest();
                    });

                    it("should return a promise that rejects", function () {
                        expect(rejectHandler).toHaveBeenCalled();
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.checkFileExists(file)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.checkFile with the expected values", function () {
                    expect($cordovaFile.checkFile).toHaveBeenCalledWith(defaultDirectory, file);
                });

                describe("when $cordovaFile.checkFile resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        checkFileDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.checkFile rejects", function () {

                    beforeEach(function () {
                        checkFileDeferred.reject();
                        $rootScope.$digest();
                    });

                    it("should return a promise that rejects", function () {
                        expect(rejectHandler).toHaveBeenCalled();
                    });
                });
            });
        });

        describe("has a createDirectory function that", function () {
            var replaceIfExists;

            beforeEach(function () {
                replaceIfExists = TestUtils.getRandomBoolean();
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.createDirectory(directory, replaceIfExists, parentDirectory)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.createDir with the expected values", function () {
                    expect($cordovaFile.createDir).toHaveBeenCalledWith(parentDirectory, directory, replaceIfExists);
                });

                describe("when $cordovaFile.createDir resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        createDirDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.createDir rejects with an error", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        createDirDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.createDirectory(directory, replaceIfExists)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.createDir with the expected values", function () {
                    expect($cordovaFile.createDir).toHaveBeenCalledWith(defaultDirectory, directory, replaceIfExists);
                });

                describe("when $cordovaFile.createDir resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        createDirDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.createDir rejects with an error", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        createDirDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });
        });

        describe("has a createFile function that", function () {
            var replaceIfExists;

            beforeEach(function () {
                replaceIfExists = TestUtils.getRandomBoolean();
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.createFile(file, replaceIfExists, parentDirectory)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.createFile with the expected values", function () {
                    expect($cordovaFile.createFile).toHaveBeenCalledWith(parentDirectory, file, replaceIfExists);
                });

                describe("when $cordovaFile.createFile resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        createFileDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.createFile rejects with an error", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        createFileDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.createFile(file, replaceIfExists)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.createFile with the expected values", function () {
                    expect($cordovaFile.createFile).toHaveBeenCalledWith(defaultDirectory, file, replaceIfExists);
                });

                describe("when $cordovaFile.createFile resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        createFileDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.createFile rejects with an error", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        createFileDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });
        });

        describe("has a readFile function that", function () {
            var binary;

            describe("when binary is true", function () {

                beforeEach(function () {
                    binary = true;
                });

                describe("when given a parentDirectory", function () {

                    beforeEach(function () {
                        FileUtil.readFile(file, binary, parentDirectory)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                        $rootScope.$digest();
                    });

                    it("should call PlatformUtil.waitForCordovaPlatform", function () {
                        expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.readAsBinaryString with the expected values", function () {
                        expect($cordovaFile.readAsBinaryString).toHaveBeenCalledWith(parentDirectory, file);
                    });

                    describe("when $cordovaFile.readAsBinaryString resolves with a value", function () {
                        var resolveValue;

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            readAsBinaryStringDeferred.resolve(resolveValue);
                            $rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when $cordovaFile.readAsBinaryString rejects with an error", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            readAsBinaryStringDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                            expect($rootScope.$digest).toThrowError(expectedError);
                        });
                    });
                });

                describe("when NOT given a parentDirectory", function () {

                    beforeEach(function () {
                        FileUtil.readFile(file, binary)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                        $rootScope.$digest();
                    });

                    it("should call PlatformUtil.waitForCordovaPlatform", function () {
                        expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.readAsBinaryString with the expected values", function () {
                        expect($cordovaFile.readAsBinaryString).toHaveBeenCalledWith(defaultDirectory, file);
                    });

                    describe("when $cordovaFile.readAsBinaryString resolves with a value", function () {
                        var resolveValue;

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            readAsBinaryStringDeferred.resolve(resolveValue);
                            $rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when $cordovaFile.readAsBinaryString rejects with an error", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            readAsBinaryStringDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                            expect($rootScope.$digest).toThrowError(expectedError);
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
                        FileUtil.readFile(file, binary, parentDirectory)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                        $rootScope.$digest();
                    });

                    it("should call PlatformUtil.waitForCordovaPlatform", function () {
                        expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.readAsText with the expected values", function () {
                        expect($cordovaFile.readAsText).toHaveBeenCalledWith(parentDirectory, file);
                    });

                    describe("when $cordovaFile.readAsText resolves with a value", function () {
                        var resolveValue;

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            readAsTextDeferred.resolve(resolveValue);
                            $rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when $cordovaFile.readAsText rejects with an error", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            readAsTextDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                            expect($rootScope.$digest).toThrowError(expectedError);
                        });
                    });
                });

                describe("when NOT given a parentDirectory", function () {

                    beforeEach(function () {
                        FileUtil.readFile(file, binary)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                        $rootScope.$digest();
                    });

                    it("should call PlatformUtil.waitForCordovaPlatform", function () {
                        expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.readAsText with the expected values", function () {
                        expect($cordovaFile.readAsText).toHaveBeenCalledWith(defaultDirectory, file);
                    });

                    describe("when $cordovaFile.readAsText resolves with a value", function () {
                        var resolveValue;

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            readAsTextDeferred.resolve(resolveValue);
                            $rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when $cordovaFile.readAsText rejects with an error", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            readAsTextDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                            expect($rootScope.$digest).toThrowError(expectedError);
                        });
                    });
                });
            });
        });

        describe("has a readFileAsDataUrl function that", function () {

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.readFileAsDataUrl(file, parentDirectory)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.readAsDataURL with the expected values", function () {
                    expect($cordovaFile.readAsDataURL).toHaveBeenCalledWith(parentDirectory, file);
                });

                describe("when $cordovaFile.readAsDataURL resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        readAsDataURLDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.readAsDataURL rejects with an error", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        readAsDataURLDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.readFileAsDataUrl(file)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.readAsDataURL with the expected values", function () {
                    expect($cordovaFile.readAsDataURL).toHaveBeenCalledWith(defaultDirectory, file);
                });

                describe("when $cordovaFile.readAsDataURL resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        readAsDataURLDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.readAsDataURL rejects with an error", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        readAsDataURLDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });
        });

        describe("has a removeDirectory function that", function () {
            var recursive;

            describe("when recursive is true", function () {

                beforeEach(function () {
                    recursive = true;
                });

                describe("when given a parentDirectory", function () {

                    beforeEach(function () {
                        FileUtil.removeDirectory(directory, recursive, parentDirectory)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                        $rootScope.$digest();
                    });

                    it("should call PlatformUtil.waitForCordovaPlatform", function () {
                        expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.removeRecursively with the expected values", function () {
                        expect($cordovaFile.removeRecursively).toHaveBeenCalledWith(parentDirectory, directory);
                    });

                    describe("when $cordovaFile.removeRecursively resolves with a value", function () {
                        var resolveValue;

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            removeRecursivelyDeferred.resolve(resolveValue);
                            $rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when $cordovaFile.removeRecursively rejects with an error", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            removeRecursivelyDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                            expect($rootScope.$digest).toThrowError(expectedError);
                        });
                    });
                });

                describe("when NOT given a parentDirectory", function () {

                    beforeEach(function () {
                        FileUtil.removeDirectory(directory, recursive)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                        $rootScope.$digest();
                    });

                    it("should call PlatformUtil.waitForCordovaPlatform", function () {
                        expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.removeRecursively with the expected values", function () {
                        expect($cordovaFile.removeRecursively).toHaveBeenCalledWith(defaultDirectory, directory);
                    });

                    describe("when $cordovaFile.removeRecursively resolves with a value", function () {
                        var resolveValue;

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            removeRecursivelyDeferred.resolve(resolveValue);
                            $rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when $cordovaFile.removeRecursively rejects with an error", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            removeRecursivelyDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                            expect($rootScope.$digest).toThrowError(expectedError);
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
                        FileUtil.removeDirectory(directory, recursive, parentDirectory)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                        $rootScope.$digest();
                    });

                    it("should call PlatformUtil.waitForCordovaPlatform", function () {
                        expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.removeDir with the expected values", function () {
                        expect($cordovaFile.removeDir).toHaveBeenCalledWith(parentDirectory, directory);
                    });

                    describe("when $cordovaFile.removeDir resolves with a value", function () {
                        var resolveValue;

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            removeDirDeferred.resolve(resolveValue);
                            $rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when $cordovaFile.removeDir rejects with an error", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            removeDirDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                            expect($rootScope.$digest).toThrowError(expectedError);
                        });
                    });
                });

                describe("when NOT given a parentDirectory", function () {

                    beforeEach(function () {
                        FileUtil.removeDirectory(directory, recursive)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                        $rootScope.$digest();
                    });

                    it("should call PlatformUtil.waitForCordovaPlatform", function () {
                        expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.removeDir with the expected values", function () {
                        expect($cordovaFile.removeDir).toHaveBeenCalledWith(defaultDirectory, directory);
                    });

                    describe("when $cordovaFile.removeDir resolves with a value", function () {
                        var resolveValue;

                        beforeEach(function () {
                            resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            removeDirDeferred.resolve(resolveValue);
                            $rootScope.$digest();
                        });

                        it("should return a promise that resolves with the same value", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                        });
                    });

                    describe("when $cordovaFile.removeDir rejects with an error", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            removeDirDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                            expect($rootScope.$digest).toThrowError(expectedError);
                        });
                    });
                });
            });
        });

        describe("has a removeFile function that", function () {

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.removeFile(file, parentDirectory)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.removeFile with the expected values", function () {
                    expect($cordovaFile.removeFile).toHaveBeenCalledWith(parentDirectory, file);
                });

                describe("when $cordovaFile.removeFile resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        removeFileDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.removeFile rejects with an error", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        removeFileDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.removeFile(file)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.removeFile with the expected values", function () {
                    expect($cordovaFile.removeFile).toHaveBeenCalledWith(defaultDirectory, file);
                });

                describe("when $cordovaFile.removeFile resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        removeFileDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.removeFile rejects with an error", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        removeFileDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });
        });

        describe("has a writeFile function that", function () {
            var data,
                replaceIfExists;

            beforeEach(function () {
                data = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                replaceIfExists = TestUtils.getRandomBoolean();
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.writeFile(file, data, replaceIfExists, parentDirectory)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.writeFile with the expected values", function () {
                    expect($cordovaFile.writeFile).toHaveBeenCalledWith(parentDirectory, file, data, replaceIfExists);
                });

                describe("when $cordovaFile.writeFile resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        writeFileDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.writeFile rejects with an error", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        writeFileDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    FileUtil.writeFile(file, data, replaceIfExists)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.writeFile with the expected values", function () {
                    expect($cordovaFile.writeFile).toHaveBeenCalledWith(defaultDirectory, file, data, replaceIfExists);
                });

                describe("when $cordovaFile.writeFile resolves with a value", function () {
                    var resolveValue;

                    beforeEach(function () {
                        resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        writeFileDeferred.resolve(resolveValue);
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the same value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(resolveValue);
                    });
                });

                describe("when $cordovaFile.writeFile rejects with an error", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        writeFileDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "File operation failed: " + LoggerUtil.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });
        });
    });
}());
