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

function update_file(rootdir, filename, target, platform, configobj) {
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


if (process.env.TARGET) {
    target = process.env.TARGET;
}

if (rootdir) {
    var ourconfigfile = path.join(rootdir, "project.json"),
        configobj = JSON.parse(fs.readFileSync(ourconfigfile, "utf8"));

    update_file(rootdir, "platforms/android/assets/www/js/globals.js", target, "android", configobj);

    update_file(rootdir, "platforms/ios/www/js/globals.js", target, "ios", configobj);

    replace_string_in_file(path.join(rootdir, "platforms/android/AndroidManifest.xml"), "userPortrait", "portrait");
}
