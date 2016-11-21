#!/usr/bin/env node

"use strict";

/**
 * After prepare, files are copied to the platforms/ios and platforms/android folders.
 * Lets clean up some of those files that arent needed with this hook.
 */

module.exports = function(context) {
    console.log(context.hook + " hook is running script " + context.scriptLocation);
    var LOG_PREFIX = "    ";

    var fs = context.requireCordovaModule("fs");
    var path = context.requireCordovaModule("path");

    var deleteFolderRecursive = function (removePath) {
        if (fs.existsSync(removePath)) {
            console.log(LOG_PREFIX + "removing path " + removePath);

            fs.readdirSync(removePath).forEach(function (file) {
                var curPath = path.join(removePath, file);
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(removePath);
        }
    };

    var rootdir = context.opts.projectRoot;

    var iosPlatformsDir = path.join(rootdir, "platforms/ios/www");
    var androidPlatformsDir = path.join(rootdir, "platforms/android/assets/www");
    var browserPlatformsDir = path.join(rootdir, "platforms/browser/www");

    var scssDir = "/lib/ionic/scss";
    var scriptsDir = "/app";

    deleteFolderRecursive(path.join(iosPlatformsDir, scssDir));
    deleteFolderRecursive(path.join(androidPlatformsDir, scssDir));

    deleteFolderRecursive(path.join(iosPlatformsDir, scriptsDir));
    deleteFolderRecursive(path.join(androidPlatformsDir, scriptsDir));
    deleteFolderRecursive(path.join(browserPlatformsDir, scriptsDir));

    console.log(context.hook + " hook has finished running script " + context.scriptLocation);
};
