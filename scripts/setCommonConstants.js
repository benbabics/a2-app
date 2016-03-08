#!/usr/bin/env node

"use strict";

// Set Environment
// v1.0
// Automatically sets specific environment values based on the build target environment argument.

/* jshint -W106 */ // Ignore variables with underscores that were not created by us

module.exports = function(context) {
    console.log(context.hook + " hook is running script " + context.scriptLocation);
    var LOG_PREFIX = "    ";

    var fs = context.requireCordovaModule("fs");
    var path = context.requireCordovaModule("path");

    var rootdir = context.opts.projectRoot;

    function replaceStringInFile(filename, toReplace, replaceWith) {
        try {
            var data = fs.readFileSync(filename, "utf8");

            var result = data.replace(toReplace, replaceWith);
            fs.writeFileSync(filename, result, "utf8");
        }
        catch (e) {
            console.log(LOG_PREFIX + e);
        }
    }

    function updateConstants(rootdir, fileName, configObj) {
        var fullFileName = path.join(rootdir, fileName);

        if (fs.existsSync(fullFileName)) {

            console.log(LOG_PREFIX + "In " + fullFileName + " - setting LOGIN STATE to: " + configObj.all.auth.login_state);
            replaceStringInFile(fullFileName, "@@@STRING_REPLACE_LOGIN_STATE@@@", configObj.all.auth.login_state);

            console.log(LOG_PREFIX + "In " + fullFileName + " - setting DATASTORE NAME to: " + configObj.all.datastore.name);
            replaceStringInFile(fullFileName, "@@@STRING_REPLACE_APP_DATASTORE_NAME@@@", configObj.all.datastore.name);

        } else {
            console.log(LOG_PREFIX + "ERROR missing " + fullFileName + " file.");
        }
    }

    if (rootdir) {
        try {

            var configFile = path.join(rootdir, "project.json");
            var configObj = JSON.parse(fs.readFileSync(configFile, "utf8"));

            // Update constants.js for each platform
            updateConstants(rootdir, "platforms/android/assets/www/app/shared/core/constants.js", configObj);
            updateConstants(rootdir, "platforms/ios/www/app/shared/core/constants.js", configObj);
            updateConstants(rootdir, "platforms/browser/www/app/shared/core/constants.js", configObj);

        } catch (e) {
            console.log(LOG_PREFIX + e);
        }
    } else {
        console.log(LOG_PREFIX + "ERROR missing rootdir");
    }

    console.log(context.hook + " hook has finished running script " + context.scriptLocation);
};
