(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    // NOTE: This service will only work on platforms with Cordova.

    /* @ngInject */
    function FileUtil(_, $cordovaFile, LoggerUtil, PlatformUtil) {

        // Revealed Public members
        var service = {
            "appendFile"          : appendFile,
            "checkDirectoryExists": checkDirectoryExists,
            "checkFileExists"     : checkFileExists,
            "createDirectory"     : createDirectory,
            "createFile"          : createFile,
            "readFile"            : readFile,
            "readFileAsDataUrl"   : readFileAsDataUrl,
            "removeDirectory"     : removeDirectory,
            "removeFile"          : removeFile,
            "writeFile"           : writeFile
        };

        return service;
        //////////////////////

        function appendFile(file, data, parentDirectory) {
            return PlatformUtil.waitForCordovaPlatform(
                _.partial($cordovaFile.writeExistingFile, makeValidDirectory(parentDirectory), file, data)
            ).catch(handleFileError);
        }

        function checkDirectoryExists(directory, parentDirectory) {
            return PlatformUtil.waitForCordovaPlatform(
                _.partial($cordovaFile.checkDir, makeValidDirectory(parentDirectory), directory)
            );
        }

        function checkFileExists(file, parentDirectory) {
            return PlatformUtil.waitForCordovaPlatform(
                _.partial($cordovaFile.checkFile, makeValidDirectory(parentDirectory), file)
            );
        }

        function createDirectory(directory, replaceIfExists, parentDirectory) {
            return PlatformUtil.waitForCordovaPlatform(
                _.partial($cordovaFile.createDir, makeValidDirectory(parentDirectory), directory, replaceIfExists)
            ).catch(handleFileError);
        }

        function createFile(file, replaceIfExists, parentDirectory) {
            return PlatformUtil.waitForCordovaPlatform(
                _.partial($cordovaFile.createFile, makeValidDirectory(parentDirectory), file, replaceIfExists)
            ).catch(handleFileError);
        }

        function getDefaultDirectory() {
            if (_.has(window, "cordova.file.dataDirectory")) {
                return cordova.file.dataDirectory;
            }
            else {
                return "cdvfile:///";
            }
        }

        function handleFileError(error) {
            throw new Error("File operation failed: " + LoggerUtil.getErrorMessage(error));
        }

        function makeValidDirectory(directory) {
            directory = directory || getDefaultDirectory();

            //every file system call will fail in Chrome unless we use the origin in the directory URI
            if (directory.indexOf("filesystem:") === 0) {
                directory = directory.replace(/file:\/\//g, window.location.origin);
            }

            return directory;
        }

        function readFile(file, isBinary, parentDirectory) {
            isBinary = isBinary || false;

            var operation = isBinary ? $cordovaFile.readAsBinaryString : $cordovaFile.readAsText;

            return PlatformUtil.waitForCordovaPlatform(
                _.partial(operation, makeValidDirectory(parentDirectory), file)
            ).catch(handleFileError);
        }

        function readFileAsDataUrl(file, parentDirectory) {
            return PlatformUtil.waitForCordovaPlatform(
                _.partial($cordovaFile.readAsDataURL, makeValidDirectory(parentDirectory), file)
            ).catch(handleFileError);
        }

        function removeDirectory(directory, isRecursive, parentDirectory) {
            isRecursive = _.isUndefined(isRecursive) ? true : isRecursive;

            var operation = isRecursive ? $cordovaFile.removeRecursively : $cordovaFile.removeDir;

            return PlatformUtil.waitForCordovaPlatform(
                _.partial(operation, makeValidDirectory(parentDirectory), directory)
            ).catch(handleFileError);
        }

        function removeFile(file, parentDirectory) {
            return PlatformUtil.waitForCordovaPlatform(
                _.partial($cordovaFile.removeFile, makeValidDirectory(parentDirectory), file)
            ).catch(handleFileError);
        }

        function writeFile(file, data, replaceIfExists, parentDirectory) {
            return PlatformUtil.waitForCordovaPlatform(
                _.partial($cordovaFile.writeFile, makeValidDirectory(parentDirectory), file, data, replaceIfExists)
            ).catch(handleFileError);
        }
    }

    angular
        .module("app.shared.util")
        .factory("FileUtil", FileUtil);

})();