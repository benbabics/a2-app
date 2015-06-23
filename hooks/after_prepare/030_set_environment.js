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

function updateConstants(rootdir, fileName, target, configObj) {
    var fullFileName = path.join(rootdir, fileName);

    if (fs.existsSync(fullFileName)) {

        console.log("In " + fullFileName + " - setting AM_API URL to: " + configObj[target].app_urls.am_api);
        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_APP_URL_AM_API@@@", configObj[target].app_urls.am_api);

        console.log("In " + fullFileName + " - setting AUTH_API URL to: " + configObj[target].app_urls.auth_api);
        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_APP_URL_AUTH_API@@@", configObj[target].app_urls.auth_api);

        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_API_USERNAME@@@", configObj[target].api_credentials.username);
        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_API_PASSWORD@@@", configObj[target].api_credentials.password);
        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_LOGGING_ENABLED@@@", configObj[target].logging_enabled);

        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_AUTH_CLIENT_ID@@@", configObj[target].auth.client_id);
        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_AUTH_CLIENT_SECRET@@@", configObj[target].auth.client_secret);

    } else {
        console.log("ERROR missing " + fullFileName + " file.");
    }
}

function updateIndex(rootdir, fileName, target, configObj) {
    var fullFileName = path.join(rootdir, fileName);

    if (fs.existsSync(fullFileName)) {

        console.log("In " + fullFileName + " - setting Content Security Policy to: " + configObj[target].content_security_policy);

        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_CSP@@@", configObj[target].content_security_policy);

    } else {
        console.log("ERROR missing " + fullFileName + " file.");
    }
}

if (rootdir) {
    var target = "stage"; //default to stage
    if (process.env.TARGET) {
        target = process.env.TARGET;
    }

    console.log("Build Target set to: " + target);

    try {

        var configFile = path.join(rootdir, "project.json");
        var configObj = JSON.parse(fs.readFileSync(configFile, "utf8"));

        // Update constants.js for each platform
        updateConstants(rootdir, "platforms/android/assets/www/app/shared/core/constants.js", target, configObj);
        updateConstants(rootdir, "platforms/ios/www/app/shared/core/constants.js", target, configObj);
        updateConstants(rootdir, "platforms/browser/www/app/shared/core/constants.js", target, configObj);

        // Update index.html for each platform
        updateIndex(rootdir, "platforms/android/assets/www/index.html", target, configObj);
        updateIndex(rootdir, "platforms/ios/www/index.html", target, configObj);
        updateIndex(rootdir, "platforms/browser/www/index.html", target, configObj);


    } catch(e) {
        console.log(e);
    }
} else {
    console.log("ERROR missing rootdir");
}



