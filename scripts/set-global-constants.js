#!/usr/bin/env node

"use strict";

// Automatically sets specific platform/environment constants

module.exports = function(context) {
    console.log(context.hook + " hook is running script " + context.scriptLocation);
    var LOG_PREFIX = "    ";

    var _ = context.requireCordovaModule("lodash");
    var fs = context.requireCordovaModule("fs");
    var path = context.requireCordovaModule("path");

    var ANDROID_ASSETS_PATH = "/assets",
        FILE_CONFIG = {
            constants: {
                appScripts     : "/www/build/main.js",
                config         : "config.xml",
                configAndroid  : "/res/xml/config.xml",
                configIos      : "/smarthub-2/config.xml"
            }
        },
        rootdir = context.opts.projectRoot;

    function replaceStringInFile(filename, toReplace, replaceWith) {
        try {
            var data = fs.readFileSync(filename, "utf8");

            var result = data.replace(new RegExp("%%=" + toReplace + "%%", 'g'), replaceWith);
            fs.writeFileSync(filename, result, "utf8");
        }
        catch (e) {
            console.log(LOG_PREFIX + e);
        }
    }

    function updateConstants(platform, fileName, configObj) {
        var CONSTANTS = {
                /*"APP_DATASTORE_NAME"          : configObj.all.datastore.name,
                "GCM_APP_ID"                  : configObj.all.gcm.app_id,*/
                "PLATFORM": platform.toLowerCase(),
                /*"URBANAIRSHIP_APP_KEY_PROD"   : configObj.all.notifications.urbanairship.app_key_prod,
                "URBANAIRSHIP_APP_SECRET_PROD": configObj.all.notifications.urbanairship.app_secret_prod,
                "URBANAIRSHIP_APP_KEY_DEV"    : configObj.all.notifications.urbanairship.app_key_dev,
                "URBANAIRSHIP_APP_SECRET_DEV" : configObj.all.notifications.urbanairship.app_secret_dev*/
            },
            platformPath = path.join(rootdir, "platforms", platform.trim().toLowerCase()),
            fullFileName,
            doConstantReplace = function (value, placeholder) {
                console.log(LOG_PREFIX + "In " + fullFileName + " - setting " + placeholder + " to: " + value);
                replaceStringInFile(fullFileName, placeholder, value);
            };

        if (platform === "android" && _.startsWith(fileName, "/www")) {
            fullFileName = path.join(platformPath, ANDROID_ASSETS_PATH, fileName);
        }
        else {
            fullFileName = path.join(platformPath, fileName);
        }

        if (fs.existsSync(fullFileName)) {
            _.forOwn(CONSTANTS, doConstantReplace);
        } else {
            console.log(LOG_PREFIX + "ERROR missing " + fullFileName + " file.");
        }
    }

    if (rootdir) {
        try {

            //var configFile = path.join(rootdir, "project.json");
            var configObj = {};//JSON.parse(fs.readFileSync(configFile, "utf8"));

            // go through each of the platforms requested in the build
            _.forEach(context.opts.platforms, function (platform) {
                try {
                    _.forEach(FILE_CONFIG.constants, _.partial(updateConstants, platform, _, configObj));
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

    console.log(context.hook + " hook has finished running script " + context.scriptLocation);
};
