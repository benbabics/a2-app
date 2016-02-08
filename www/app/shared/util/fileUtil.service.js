(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    // NOTE: This service will only work on platforms with Cordova.

    /* @ngInject */
    function FileUtil($cordovaFile, CommonService) {
        // Private members
        var _ = CommonService._;

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
            return CommonService.waitForCordovaPlatform(
                _.partial($cordovaFile.writeExistingFile, makeValidDirectory(parentDirectory), file, data)
            );
        }

        function checkDirectoryExists(directory, parentDirectory) {
            return CommonService.waitForCordovaPlatform(
                _.partial($cordovaFile.checkDir, makeValidDirectory(parentDirectory), directory)
            );
        }

        function checkFileExists(file, parentDirectory) {
            return CommonService.waitForCordovaPlatform(
                _.partial($cordovaFile.checkFile, makeValidDirectory(parentDirectory), file)
            );
        }

        function createDirectory(directory, replaceIfExists, parentDirectory) {
            return CommonService.waitForCordovaPlatform(
                _.partial($cordovaFile.createDir, makeValidDirectory(parentDirectory), directory, replaceIfExists)
            );
        }

        function createFile(file, replaceIfExists, parentDirectory) {
            return CommonService.waitForCordovaPlatform(
                _.partial($cordovaFile.createFile, makeValidDirectory(parentDirectory), file, replaceIfExists)
            );
        }

        function getDefaultDirectory() {
            if (_.has(window, "cordova.file.dataDirectory")) {
                return cordova.file.dataDirectory;
            }
            else {
                return "cdvfile:///";
            }
        }

        function makeValidDirectory(directory) {
            directory = directory || getDefaultDirectory();

            //every file system call will fail in Chrome unless we use the origin in the directory URI
            if (directory.indexOf("filesystem:") === 0) {
                directory = directory.replace(/file:\/\//g, window.location.origin);
            }

            return directory;
        }

        function readFile(file, binary, parentDirectory) {
            binary = _.isUndefined(binary) ? false : binary;

            var operation = binary ? $cordovaFile.readAsBinaryString : $cordovaFile.readAsText;

            return CommonService.waitForCordovaPlatform(
                _.partial(operation, makeValidDirectory(parentDirectory), file)
            );
        }

        function readFileAsDataUrl(file, parentDirectory) {
            return CommonService.waitForCordovaPlatform(
                _.partial($cordovaFile.readAsDataURL, makeValidDirectory(parentDirectory), file)
            );
        }

        function removeDirectory(directory, recursive, parentDirectory) {
            recursive = _.isUndefined(recursive) ? true : recursive;

            var operation = recursive ? $cordovaFile.removeRecursively : $cordovaFile.removeDir;

            return CommonService.waitForCordovaPlatform(
                _.partial(operation, makeValidDirectory(parentDirectory), directory)
            );
        }

        function removeFile(file, parentDirectory) {
            return CommonService.waitForCordovaPlatform(
                _.partial($cordovaFile.removeFile, makeValidDirectory(parentDirectory), file)
            );
        }

        function writeFile(file, data, replaceIfExists, parentDirectory) {
            return CommonService.waitForCordovaPlatform(
                _.partial($cordovaFile.writeFile, makeValidDirectory(parentDirectory), file, data, replaceIfExists)
            );
        }
    }

    angular
        .module("app.shared.util")
        .factory("FileUtil", FileUtil);

})();