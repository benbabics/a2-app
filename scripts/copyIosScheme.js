#!/usr/bin/env node

"use strict";

// Copies the iOS scheme file over to the XCode project directory

module.exports = function(context) {
    console.log(context.hook + " hook is running script " + context.scriptLocation);
    var SCHEME_NAME = "Fleet SmartHub.xcscheme";

    var fs = context.requireCordovaModule("fs-extra");
    var path = context.requireCordovaModule("path");
    var _ = context.requireCordovaModule("lodash");

    var rootDir = context.opts.projectRoot;

    function moveSchemeFile(platformDir) {
        var schemeFile = path.join(rootDir, SCHEME_NAME),
            destFile = path.join(rootDir, platformDir, "Fleet SmartHub.xcodeproj", "xcshareddata", "xcschemes", SCHEME_NAME);

        if (fs.existsSync(schemeFile)) {
            try {
                fs.copySync(schemeFile, destFile);

                console.log("Copied " + SCHEME_NAME + " to " + destFile);
            }
            catch (err) {
                console.error(err);
            }
        }
    }

    _.forEach(context.opts.platforms, function (platform) {
        if (platform.toLowerCase() === "ios") {
            moveSchemeFile(path.join("platforms", platform));
        }
    });
};
