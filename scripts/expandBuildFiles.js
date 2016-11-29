#!/usr/bin/env node

"use strict";

// Moves the build files into the content directory

module.exports = function(context) {
    console.log(context.hook + " hook is running script " + context.scriptLocation);

    var ANDROID_ASSETS_PATH = "assets/";

    var fs = context.requireCordovaModule("fs-extra");
    var path = context.requireCordovaModule("path");

    var rootDir = context.opts.projectRoot;

    function getPlatformContentDir(platform) {
        var dir = "";

        if (platform.toLowerCase() === "android") {
            dir += ANDROID_ASSETS_PATH;
        }

        return path.join(dir, "www/");
    }

    context.opts.platforms.forEach(function (platform) {
        var contentDir = path.join(rootDir, "platforms", platform, getPlatformContentDir(platform)),
            buildDir = path.join(contentDir, "build");

        if (fs.existsSync(buildDir) && fs.lstatSync(buildDir).isDirectory()) {
            fs.readdirSync(buildDir).forEach(function (buildResource) {
                try {
                    //move each file for the content dir
                    fs.copySync(path.join(buildDir, buildResource), path.join(contentDir, buildResource));

                    console.log("Copied " + buildResource + " to " + contentDir);
                }
                catch (err) {
                    console.error(err);
                }
            })
        }
    });

    console.log(context.hook + " hook has finished running script " + context.scriptLocation);
};
