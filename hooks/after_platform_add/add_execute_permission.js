#!/usr/bin/env node

"use strict";

var os = require("os");
var exec = require("child_process").exec;
var path = require("path");
var fs = require("fs");

var rootdir = process.argv[2];

//if on os x or linux
if(os.platform() === "linux" || os.platform() === "darwin") {
    var addedPlatform = process.env.CORDOVA_PLATFORMS,
        platformBuildToolsDir = path.join(rootdir, "platforms", addedPlatform, "cordova");

    if(fs.existsSync(platformBuildToolsDir)) {
        //add execution permissions to the new platform's build tools dir
        exec("chmod -R 755 " + platformBuildToolsDir);
    }
}