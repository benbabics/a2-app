#!/usr/bin/env node

"use strict";

/**
 * On a fresh clone, the local platforms/ and plugins/ directories will be
 * missing, so ensure they get created before the first platform is added.
 */

module.exports = function(context) {
    console.log(context.hook + " hook is running script " + context.scriptLocation);
    var LOG_PREFIX = "    ";

    var fs = context.requireCordovaModule("fs");
    var path = context.requireCordovaModule("path");

    var rootdir = context.opts.projectRoot;
    var platformsDir = path.join(rootdir, "platforms");
    var pluginsDir = path.resolve(rootdir, "plugins");

    try {
        console.log(LOG_PREFIX + "creating platform directory " + platformsDir);
        fs.mkdirSync(platformsDir, function (err) {
            if (err) {
                console.error(err);
            }
        });
    } catch (ex) {
    }

    try {
        console.log(LOG_PREFIX + "creating plugins directory " + pluginsDir);
        fs.mkdirSync(pluginsDir, function (err) {
            if (err) {
                console.error(err);
            }
        });
    } catch (ex) {
    }
};
