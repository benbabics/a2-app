#!/usr/bin/env node

// Set Environment
// v1.0
// Automatically sets specific environment values based on the build target environment argument.

/* jshint -W106 */ // Ignore variables with underscores that were not created by us

"use strict";

var fs = require("fs");
var path = require("path");

var rootdir = process.argv[2];


function replaceStringInFile(filename, to_replace, replace_with) {
    try {
        var data = fs.readFileSync(filename, "utf8");

        var result = data.replace(to_replace, replace_with);
        fs.writeFileSync(filename, result, "utf8");
    }
    catch(e) {
        console.log(e);
    }
}

function updateConstants(rootdir, fileName, configObj) {
    var fullFileName = path.join(rootdir, fileName);

    if (fs.existsSync(fullFileName)) {

        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_LOGIN_STATE@@@", configObj["all"].auth.login_state);

    } else {
        console.log("ERROR missing " + fullFileName + " file.");
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

    } catch(e) {
        console.log(e);
    }
} else {
    console.log("ERROR missing rootdir");
}



