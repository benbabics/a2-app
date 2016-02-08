(function () {
    "use strict";

    var FileUtil,
        CommonService,
        $cordovaFile,
        $q,
        $rootScope,
        file,
        directory,
        parentDirectory,
        promise,
        defaultDirectory = "cdvfile:///";

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

            inject(function (_$rootScope_, _$q_, _FileUtil_, _CommonService_) {
                FileUtil = _FileUtil_;
                CommonService = _CommonService_;
                $q = _$q_;
                $rootScope = _$rootScope_;
            });

            //setup spies:
            spyOn(CommonService, "waitForCordovaPlatform").and.callFake(function(callback) {
                //just execute the callback directly
                return $q.when((callback || function() {})());
            });

            window.cordova = {
                file: {
                    dataDirectory: defaultDirectory
                }
            };
            file = TestUtils.getRandomStringThatIsAlphaNumeric(15);
            directory = TestUtils.getRandomStringThatIsAlphaNumeric(10) + "/";
            parentDirectory = TestUtils.getRandomStringThatIsAlphaNumeric(10) + "/";
            promise = $q.resolve();
        });

        describe("has an appendFile function that", function () {
            var result,
                data;

            beforeEach(function () {
                $cordovaFile.writeExistingFile.and.returnValue(promise);
            });

            beforeEach(function () {
                data = TestUtils.getRandomStringThatIsAlphaNumeric(20);
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.appendFile(file, data, parentDirectory);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.writeExistingFile with the expected values", function () {
                    expect($cordovaFile.writeExistingFile).toHaveBeenCalledWith(parentDirectory, file, data);
                });

                it("should return the promise returned by $cordovaFile.writeExistingFile", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.appendFile(file, data);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.writeExistingFile with the expected values", function () {
                    expect($cordovaFile.writeExistingFile).toHaveBeenCalledWith(defaultDirectory, file, data);
                });

                it("should return the promise returned by $cordovaFile.writeExistingFile", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });
        });

        describe("has a checkDirectoryExists function that", function () {
            var result;

            beforeEach(function () {
                $cordovaFile.checkDir.and.returnValue(promise);
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.checkDirectoryExists(directory, parentDirectory);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.checkDir with the expected values", function () {
                    expect($cordovaFile.checkDir).toHaveBeenCalledWith(parentDirectory, directory);
                });

                it("should return the promise returned by $cordovaFile.checkDir", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.checkDirectoryExists(directory);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.checkDir with the expected values", function () {
                    expect($cordovaFile.checkDir).toHaveBeenCalledWith(defaultDirectory, directory);
                });

                it("should return the promise returned by $cordovaFile.checkDir", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });
        });

        describe("has a checkFileExists function that", function () {
            var result;

            beforeEach(function () {
                $cordovaFile.checkFile.and.returnValue(promise);
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.checkFileExists(file, parentDirectory);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.checkFile with the expected values", function () {
                    expect($cordovaFile.checkFile).toHaveBeenCalledWith(parentDirectory, file);
                });

                it("should return the promise returned by $cordovaFile.checkFile", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.checkFileExists(file);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.checkFile with the expected values", function () {
                    expect($cordovaFile.checkFile).toHaveBeenCalledWith(defaultDirectory, file);
                });

                it("should return the promise returned by $cordovaFile.checkFile", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });
        });

        describe("has a createDirectory function that", function () {
            var result,
                replaceIfExists;

            beforeEach(function () {
                replaceIfExists = TestUtils.getRandomBoolean();

                $cordovaFile.createDir.and.returnValue(promise);
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.createDirectory(directory, replaceIfExists, parentDirectory);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.createDir with the expected values", function () {
                    expect($cordovaFile.createDir).toHaveBeenCalledWith(parentDirectory, directory, replaceIfExists);
                });

                it("should return the promise returned by $cordovaFile.createDir", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.createDirectory(directory, replaceIfExists);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.createDir with the expected values", function () {
                    expect($cordovaFile.createDir).toHaveBeenCalledWith(defaultDirectory, directory, replaceIfExists);
                });

                it("should return the promise returned by $cordovaFile.createDir", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });
        });

        describe("has a createFile function that", function () {
            var result,
                replaceIfExists;

            beforeEach(function () {
                replaceIfExists = TestUtils.getRandomBoolean();

                $cordovaFile.createFile.and.returnValue(promise);
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.createFile(file, replaceIfExists, parentDirectory);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.createFile with the expected values", function () {
                    expect($cordovaFile.createFile).toHaveBeenCalledWith(parentDirectory, file, replaceIfExists);
                });

                it("should return the promise returned by $cordovaFile.createFile", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.createFile(file, replaceIfExists);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.createFile with the expected values", function () {
                    expect($cordovaFile.createFile).toHaveBeenCalledWith(defaultDirectory, file, replaceIfExists);
                });

                it("should return the promise returned by $cordovaFile.createFile", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });
        });

        describe("has a readFile function that", function () {
            var result,
                binary;

            beforeEach(function () {
                $cordovaFile.readAsBinaryString.and.returnValue(promise);
                $cordovaFile.readAsText.and.returnValue(promise);
            });

            describe("when binary is true", function () {

                beforeEach(function () {
                    binary = true;
                });

                describe("when given a parentDirectory", function () {

                    beforeEach(function () {
                        result = FileUtil.readFile(file, binary, parentDirectory);
                        $rootScope.$digest();
                    });

                    it("should call CommonService.waitForCordovaPlatform", function () {
                        expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.readAsBinaryString with the expected values", function () {
                        expect($cordovaFile.readAsBinaryString).toHaveBeenCalledWith(parentDirectory, file);
                    });

                    it("should return the promise returned by $cordovaFile.readAsBinaryString", function () {
                        expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                    });
                });

                describe("when NOT given a parentDirectory", function () {

                    beforeEach(function () {
                        result = FileUtil.readFile(file, binary);
                        $rootScope.$digest();
                    });

                    it("should call CommonService.waitForCordovaPlatform", function () {
                        expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.readAsBinaryString with the expected values", function () {
                        expect($cordovaFile.readAsBinaryString).toHaveBeenCalledWith(defaultDirectory, file);
                    });

                    it("should return the promise returned by $cordovaFile.readAsBinaryString", function () {
                        expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                    });
                });
            });

            describe("when binary is false", function () {

                beforeEach(function () {
                    binary = false;
                });

                describe("when given a parentDirectory", function () {

                    beforeEach(function () {
                        result = FileUtil.readFile(file, binary, parentDirectory);
                        $rootScope.$digest();
                    });

                    it("should call CommonService.waitForCordovaPlatform", function () {
                        expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.readAsText with the expected values", function () {
                        expect($cordovaFile.readAsText).toHaveBeenCalledWith(parentDirectory, file);
                    });

                    it("should return the promise returned by $cordovaFile.readAsText", function () {
                        expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                    });
                });

                describe("when NOT given a parentDirectory", function () {

                    beforeEach(function () {
                        result = FileUtil.readFile(file, binary);
                        $rootScope.$digest();
                    });

                    it("should call CommonService.waitForCordovaPlatform", function () {
                        expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.readAsText with the expected values", function () {
                        expect($cordovaFile.readAsText).toHaveBeenCalledWith(defaultDirectory, file);
                    });

                    it("should return the promise returned by $cordovaFile.readAsText", function () {
                        expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                    });
                });
            });
        });

        describe("has a readFileAsDataUrl function that", function () {
            var result;

            beforeEach(function () {
                $cordovaFile.readAsDataURL.and.returnValue(promise);
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.readFileAsDataUrl(file, parentDirectory);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.readAsDataURL with the expected values", function () {
                    expect($cordovaFile.readAsDataURL).toHaveBeenCalledWith(parentDirectory, file);
                });

                it("should return the promise returned by $cordovaFile.readAsDataURL", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.readFileAsDataUrl(file);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.readAsDataURL with the expected values", function () {
                    expect($cordovaFile.readAsDataURL).toHaveBeenCalledWith(defaultDirectory, file);
                });

                it("should return the promise returned by $cordovaFile.readAsDataURL", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });
        });

        describe("has a removeDirectory function that", function () {
            var result,
                recursive;

            beforeEach(function () {
                $cordovaFile.removeRecursively.and.returnValue(promise);
                $cordovaFile.removeDir.and.returnValue(promise);
            });

            describe("when recursive is true", function () {

                beforeEach(function () {
                    recursive = true;
                });

                describe("when given a parentDirectory", function () {

                    beforeEach(function () {
                        result = FileUtil.removeDirectory(directory, recursive, parentDirectory);
                        $rootScope.$digest();
                    });

                    it("should call CommonService.waitForCordovaPlatform", function () {
                        expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.removeRecursively with the expected values", function () {
                        expect($cordovaFile.removeRecursively).toHaveBeenCalledWith(parentDirectory, directory);
                    });

                    it("should return the promise returned by $cordovaFile.removeRecursively", function () {
                        expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                    });
                });

                describe("when NOT given a parentDirectory", function () {

                    beforeEach(function () {
                        result = FileUtil.removeDirectory(directory, recursive);
                        $rootScope.$digest();
                    });

                    it("should call CommonService.waitForCordovaPlatform", function () {
                        expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.removeRecursively with the expected values", function () {
                        expect($cordovaFile.removeRecursively).toHaveBeenCalledWith(defaultDirectory, directory);
                    });

                    it("should return the promise returned by $cordovaFile.removeRecursively", function () {
                        expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                    });
                });
            });

            describe("when recursive is false", function () {

                beforeEach(function () {
                    recursive = false;
                });

                describe("when given a parentDirectory", function () {

                    beforeEach(function () {
                        result = FileUtil.removeDirectory(directory, recursive, parentDirectory);
                        $rootScope.$digest();
                    });

                    it("should call CommonService.waitForCordovaPlatform", function () {
                        expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.removeDir with the expected values", function () {
                        expect($cordovaFile.removeDir).toHaveBeenCalledWith(parentDirectory, directory);
                    });

                    it("should return the promise returned by $cordovaFile.removeDir", function () {
                        expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                    });
                });

                describe("when NOT given a parentDirectory", function () {

                    beforeEach(function () {
                        result = FileUtil.removeDirectory(directory, recursive);
                        $rootScope.$digest();
                    });

                    it("should call CommonService.waitForCordovaPlatform", function () {
                        expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it("should call $cordovaFile.removeDir with the expected values", function () {
                        expect($cordovaFile.removeDir).toHaveBeenCalledWith(defaultDirectory, directory);
                    });

                    it("should return the promise returned by $cordovaFile.removeDir", function () {
                        expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                    });
                });
            });
        });

        describe("has a removeFile function that", function () {
            var result;

            beforeEach(function () {
                $cordovaFile.removeFile.and.returnValue(promise);
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.removeFile(file, parentDirectory);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.removeFile with the expected values", function () {
                    expect($cordovaFile.removeFile).toHaveBeenCalledWith(parentDirectory, file);
                });

                it("should return the promise returned by $cordovaFile.removeFile", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.removeFile(file);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.removeFile with the expected values", function () {
                    expect($cordovaFile.removeFile).toHaveBeenCalledWith(defaultDirectory, file);
                });

                it("should return the promise returned by $cordovaFile.removeFile", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });
        });

        describe("has a writeFile function that", function () {
            var result,
                data,
                replaceIfExists;

            beforeEach(function () {
                data = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                replaceIfExists = TestUtils.getRandomBoolean();

                $cordovaFile.writeFile.and.returnValue(promise);
            });

            describe("when given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.writeFile(file, data, replaceIfExists, parentDirectory);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.writeFile with the expected values", function () {
                    expect($cordovaFile.writeFile).toHaveBeenCalledWith(parentDirectory, file, data, replaceIfExists);
                });

                it("should return the promise returned by $cordovaFile.writeFile", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });

            describe("when NOT given a parentDirectory", function () {

                beforeEach(function () {
                    result = FileUtil.writeFile(file, data, replaceIfExists);
                    $rootScope.$digest();
                });

                it("should call CommonService.waitForCordovaPlatform", function () {
                    expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call $cordovaFile.writeFile with the expected values", function () {
                    expect($cordovaFile.writeFile).toHaveBeenCalledWith(defaultDirectory, file, data, replaceIfExists);
                });

                it("should return the promise returned by $cordovaFile.writeFile", function () {
                    expect(result).toEqual(jasmine.objectContaining({$$state: promise.$$state}));
                });
            });
        });
    });
}());