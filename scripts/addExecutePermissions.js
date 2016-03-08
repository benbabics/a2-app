#!/usr/bin/env node

"use strict";

module.exports = function(context) {
    console.log(context.hook + " hook is running script " + context.scriptLocation);
    var LOG_PREFIX = "    ";

    var os = context.requireCordovaModule("os");
    var exec = context.requireCordovaModule("child_process").exec;
    var path = context.requireCordovaModule("path");
    var fs = context.requireCordovaModule("fs");
    var _ = context.requireCordovaModule("lodash");

    var rootdir = context.opts.projectRoot;

    //if on os x or linux
    if (os.platform() === "linux" || os.platform() === "darwin") {
        // go through each of the platforms requested in the build
        _.each(context.opts.platforms, function (platform) {
            try {
                var platformToBuild = platform.trim().toLowerCase(),
                    platformBuildToolsDir = path.join(rootdir, "platforms", platformToBuild, "cordova");

                if (fs.existsSync(platformBuildToolsDir)) {
                    console.log(LOG_PREFIX + "adding execution permissions to: " + platformBuildToolsDir);

                    //add execution permissions to the new platform's build tools dir
                    exec("chmod -R 755 " + platformBuildToolsDir);
                }
            } catch (e) {
                console.log(LOG_PREFIX + e);
            }
        });
    }

    console.log(context.hook + " hook has finished running script " + context.scriptLocation);
};
