#!/usr/bin/env node

"use strict";

// Change Maven Repos
// v1.0
// Change the Maven repos in all Android platform build.gradle files to use our internal Maven repo instead of Maven Central.

/* jshint -W106 */ // Ignore variables with underscores that were not created by us

module.exports = function(context) {
    console.log(context.hook + " hook is running script " + context.scriptLocation);
    var LOG_PREFIX = "    ";

    var fs = context.requireCordovaModule("fs");
    var path = context.requireCordovaModule("path");

    var rootdir = context.opts.projectRoot;

    function replaceStringInFile(filename, toReplace, replaceWith) {
        try {
            var data = fs.readFileSync(filename, "utf8");

            var result = data.replace(toReplace, replaceWith);
            fs.writeFileSync(filename, result, "utf8");
        }
        catch (e) {
            console.log(LOG_PREFIX + e);
        }
    }

    function changeMavenRepo(rootdir, fileName) {
        var fullFileName = path.join(rootdir, fileName),
            mavenCentral = "mavenCentral()",
            wexNexus = "maven { url 'http://nexus.int.wrightexpress.com/nexus/content/groups/public' }";

        if (fs.existsSync(fullFileName)) {

            console.log(LOG_PREFIX + "In " + fullFileName + " - updating Maven repos");

            replaceStringInFile(fullFileName, mavenCentral, wexNexus);

        } else {
            console.log(LOG_PREFIX + "ERROR missing " + fullFileName + " file.");
        }
    }

    function changeMavenURL(rootdir, fileName, mavenUrl) {
        var fullFileName = path.join(rootdir, fileName),
            wexNexusUrl = "url 'http://nexus.int.wrightexpress.com/nexus/content/groups/public'";

        if (fs.existsSync(fullFileName)) {

            console.log(LOG_PREFIX + "In " + fullFileName + " - updating Maven repos");

            replaceStringInFile(fullFileName, mavenUrl, wexNexusUrl);

        } else {
            console.log(LOG_PREFIX + "ERROR missing " + fullFileName + " file.");
        }
    }

    if (rootdir) {
        console.log(LOG_PREFIX + "Updating Maven Repository in build.gradle files to: http://nexus.int.wrightexpress.com/nexus/content/groups/public");

        try {

            // Update all build.gradle files
            changeMavenRepo(rootdir, "platforms/android/build.gradle");
            changeMavenRepo(rootdir, "platforms/android/CordovaLib/build.gradle");

            changeMavenURL(rootdir, "platforms/android/cordova-plugin-crosswalk-webview/fleetsmarthub-xwalk.gradle", "url 'https://download.01.org/crosswalk/releases/crosswalk/android/maven2'");

        } catch (e) {
            console.log(LOG_PREFIX + e);
        }
    } else {
        console.log(LOG_PREFIX + "ERROR missing rootdir");
    }

    console.log(context.hook + " hook has finished running script " + context.scriptLocation);
};
