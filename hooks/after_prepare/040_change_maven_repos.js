#!/usr/bin/env node

// Change Maven Repos
// v1.0
// Change the Maven repos in all Android platform build.gradle files to use our internal Maven repo instead of Maven Central.

/* jshint -W106 */ // Ignore variables with underscores that were not created by us

"use strict";

var fs = require("fs");
var path = require("path");

var rootdir = process.argv[2];

function replaceStringInFile(filename, to_replace, replace_with) {
    try {
        var data = fs.readFileSync(filename, "utf8");

        var result = data.replace(to_replace, replace_with);
        fs.writeFileSync(filename, result, "utf8");
    }
    catch(e) {
        console.log(e);
    }
}

function changeMavenRepo(rootdir, fileName) {
    var fullFileName = path.join(rootdir, fileName),
        mavenCentral = "mavenCentral()",
        wexNexus = "maven { url 'http://nexus.int.wrightexpress.com/nexus/content/groups/public' }";

    if (fs.existsSync(fullFileName)) {

        console.log("In " + fullFileName + " - updating Maven repos");

        replaceStringInFile(fullFileName, mavenCentral, wexNexus);

    } else {
        console.log("ERROR missing " + fullFileName + " file.");
    }
}

function changeMavenURL(rootdir, fileName, mavenUrl) {
    var fullFileName = path.join(rootdir, fileName),
        mavenCentral = "mavenCentral()",
        wexNexusUrl = "url 'http://nexus.int.wrightexpress.com/nexus/content/groups/public'";

    if (fs.existsSync(fullFileName)) {

        console.log("In " + fullFileName + " - updating Maven repos");

        replaceStringInFile(fullFileName, mavenUrl, wexNexusUrl);

    } else {
        console.log("ERROR missing " + fullFileName + " file.");
    }
}

if (rootdir) {
    console.log("Updating Maven Repository in build.gradle files to: http://nexus.int.wrightexpress.com/nexus/content/groups/public");

    try {

        // Update all build.gradle files
        changeMavenRepo(rootdir, "platforms/android/build.gradle");
        changeMavenRepo(rootdir, "platforms/android/CordovaLib/build.gradle");

        changeMavenURL(rootdir, "platforms/android/cordova-plugin-crosswalk-webview/fleetsmarthub-xwalk.gradle", "url 'https://download.01.org/crosswalk/releases/crosswalk/android/maven2'");

    } catch(e) {
        console.log(e);
    }
} else {
    console.log("ERROR missing rootdir");
}