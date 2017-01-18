#!/usr/bin/env node

"use strict";

/**
 * After prepare, files are copied to the platforms/ios and platforms/android folders.
 * Lets clean up some of those files that arent needed with this hook.
 */

module.exports = function(context) {
    console.log(context.hook + " hook is running script " + context.scriptLocation);

    var ANDROID_ASSETS_PATH = "assets/",
        LOG_PREFIX = "    ";

    var fs = context.requireCordovaModule("fs-extra");
    var path = context.requireCordovaModule("path");

    function getPlatformContentDir(platform) {
        var dir = "";

        if (platform.toLowerCase() === "android") {
            dir += ANDROID_ASSETS_PATH;
        }

        return path.join(dir, "www/");
    }

    var PATHS_TO_REMOVE = [
            "lib/ionic/scss",
            "templates.module.js"
        ],
        rootDir = context.opts.projectRoot;

    context.opts.platforms.forEach(function (platform) {
        var contentDir = path.join(rootDir, "platforms", platform, getPlatformContentDir(platform));

        PATHS_TO_REMOVE.forEach(function (curPath) {
            curPath = path.join(contentDir, curPath);

            if (fs.existsSync(curPath)) {
                console.log(LOG_PREFIX + "removing path " + curPath);

                fs.removeSync(curPath);
            }
        });
    });

    console.log(context.hook + " hook has finished running script " + context.scriptLocation);
};
