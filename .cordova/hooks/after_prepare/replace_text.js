#!/usr/bin/env node

// this plugin replaces arbitrary text in arbitrary files

"use strict";

//

/* jshint -W106 */ // suppress the jshint warnings about non camel case functions

var fs      = require("fs"),
    path    = require("path"),
    rootdir = process.argv[2],
    target  = "stage"; //default to stage

function replace_string_in_file(filename, to_replace, replace_with) {
    var data = fs.readFileSync(filename, "utf8"),
        result = data.replace(to_replace, replace_with);

    console.log("Updating file: " + filename);

    fs.writeFileSync(filename, result, "utf8");
}

function update_globals(rootdir, filename, target, platform, configobj) {
    var fullfilename = path.join(rootdir, filename);

    console.log("Target: " + target + " - Platform: " + platform);

    if (fs.existsSync(fullfilename)) {

        replace_string_in_file(fullfilename, "@@@STRING_REPLACE_APP_URL@@@", configobj[target].app_url);

        console.log("App URL set to: " + configobj[target].app_url);

        replace_string_in_file(fullfilename, "@@@STRING_REPLACE_APP_STORE_URL@@@", configobj[platform].app_store_url);

        console.log("App Store URL set to: " + configobj[target].app_store_url);

    } else {
        console.log("Error missing: " + fullfilename);
    }
}

function update_app_id(rootdir, platform, configobj) {
    var appId = configobj[platform].app_id,
        stringToReplace = "com.wex.wol.accountmaintenance";

    if (platform === "android") {

        replace_string_in_file(path.join(rootdir, "platforms/android/AndroidManifest.xml"), stringToReplace, appId);
        replace_string_in_file(path.join(rootdir, "platforms/android/res/xml/config.xml"), stringToReplace, appId);

    } else if (platform === "ios") {

        replace_string_in_file(path.join(rootdir, "platforms/ios/WEXonline/WEXonline-Info.plist"), stringToReplace, appId);
        replace_string_in_file(path.join(rootdir, "platforms/ios/WEXonline/config.xml"), stringToReplace, appId);

    }
}


if (process.env.TARGET) {
    target = process.env.TARGET;
}

if (rootdir) {
    var ourconfigfile = path.join(rootdir, "project.json"),
        configobj = JSON.parse(fs.readFileSync(ourconfigfile, "utf8"));

    // Update globals.js for each platform
    update_globals(rootdir, "platforms/android/assets/www/js/globals.js", target, "android", configobj);
    update_globals(rootdir, "platforms/ios/www/js/globals.js", target, "ios", configobj);

    // Update orientation configuration on the Android platform
    replace_string_in_file(path.join(rootdir, "platforms/android/AndroidManifest.xml"), "userPortrait", "portrait");

    // Update each platform's specific configuration/properties files
    update_app_id(rootdir, "ios", configobj);
}
