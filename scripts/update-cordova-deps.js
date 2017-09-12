#!/usr/bin/env node

"use strict";

module.exports = function (context) {

    var LOG_FILE_PREFIX = "update-cordova-deps.js  --  ";
    var CORDOVA_DEPS_CHECK_FILE = "cordova_deps.check";
    var PACKAGE_SRC_FILE = "package.json";

    var fs = context.requireCordovaModule("fs");
    var _ = context.requireCordovaModule("lodash");
    var exec = context.requireCordovaModule("child_process").execSync;

    function logError(error) {
        console.error(LOG_FILE_PREFIX + "Failed to update Cordova dependencies: " + error);
    }

    function logInfo(info) {
        console.info(LOG_FILE_PREFIX + "INFO: " + info);
    }

    /** @return boolean */
    function isDepListCurrent(currentDeps) {
        var lockedDeps;

        try {
            lockedDeps = readCheckFile();
        }
        catch (error) {
            logInfo(CORDOVA_DEPS_CHECK_FILE + " file not found.");

            return false;
        }

        return _.isEqual(lockedDeps, currentDeps);
    }

    /** @return object */
    function readCurrentDepList() {
        var packageFile;
        var packageJson;
        var cordovaDeps;

        try {
            packageFile = fs.readFileSync(PACKAGE_SRC_FILE, "utf8");
        }
        catch (error) {
            logError(error);
            throw error;
        }
        
        try {
            packageJson = JSON.parse(packageFile);
        }
        catch (error) {
            logError(error);
            throw error;
        }

        return packageJson.cordova;
    }

    /** @return object */
    function readCheckFile() {
        var fileData;

        try {
            fileData = fs.readFileSync(CORDOVA_DEPS_CHECK_FILE, "utf8");
            return JSON.parse(fileData);
        }
        catch (e) {
            logError(error);
            throw error;
        }
    }

    function updateDeps() {
        logInfo("Updating Cordova dependencies...");

        exec("yarn ionic:prepare", function (error, stdout) {
            if (error) {
                logError(error);
            }
            else {
                logInfo("Cordova dependencies successfully updated.");
            }
        });
    }

    function writeCheckFile(cordovaDeps) {
        var fileData;

        try {
            fileData = JSON.stringify(cordovaDeps);
            fs.writeFileSync(CORDOVA_DEPS_CHECK_FILE, fileData, "utf8");

            logInfo(CORDOVA_DEPS_CHECK_FILE + " has been updated.");
        }
        catch (error) {
            logError(error);
            throw error;
        }
    }

    function main() {
        var currentDeps = readCurrentDepList();

        if (isDepListCurrent(currentDeps)) {
            logInfo("Cordova dependencies are up to date.");
        }
        else {
            updateDeps();
            writeCheckFile(currentDeps);
        }
    }


    // Invoke main
    main();
}