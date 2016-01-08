#!/usr/bin/env node

"use strict";

// Create User Schemes
// v1.0
// Creates the user schemes in the ios platform

/* jshint -W106 */ // Ignore variables with underscores that were not created by us

module.exports = function(context) {
    console.log(context.hook + " hook is running script " + context.scriptLocation);
    var LOG_PREFIX = "*********" + "    ";

    var fs = context.requireCordovaModule("fs");
    var path = context.requireCordovaModule("path");
    var _ = context.requireCordovaModule("lodash");
    var exec = context.requireCordovaModule("child_process").exec;

    var rootdir = context.opts.projectRoot;

    function executeScript(rootdir, fileName, parameters) {
        var fullFileName = path.join(rootdir, fileName);

        if (fs.existsSync(fullFileName)) {

            console.log(LOG_PREFIX + "Calling " + fullFileName + " with parameters: " + parameters);
            exec(fullFileName + " " + parameters);

        } else {
            console.log(LOG_PREFIX + "ERROR missing " + fullFileName + " file.");
        }
    }

    function createIOSUserSchemes(rootdir) {
        var fullXCodeProjFileName = path.join(rootdir, "platforms/ios/Fleet\\ SmartHub.xcodeproj");

        // Update constants.js for each platform
        executeScript(rootdir, "scripts/createUserSchemes.rb", fullXCodeProjFileName);
    }

    console.log(LOG_PREFIX + "rootdir " + rootdir);

    if (rootdir) {
        try {

            // go through each of the platforms
            var platforms = (context.opts.platforms ? _.words(context.opts.platforms) : []);

            _.each(platforms, function (platform) {
                try {
                    platform = platform.trim().toLowerCase();
                    if (platform === "ios") {
                        createIOSUserSchemes(rootdir);
                    }
                } catch (e) {
                    console.log(LOG_PREFIX + e);
                }
            });

        } catch (e) {
            console.log(LOG_PREFIX + e);
        }
    } else {
        console.log(LOG_PREFIX + "ERROR missing rootdir");
    }
};
