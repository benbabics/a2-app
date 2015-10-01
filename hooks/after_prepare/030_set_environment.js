#!/usr/bin/env node

// Set Environment
// v1.0
// Automatically sets specific environment values based on the build target environment argument.

/* jshint -W106 */ // Ignore variables with underscores that were not created by us

"use strict";

var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var plist = require("plist");

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

function updateIosPlist(targetFile, configItems) {
    var infoPlist = plist.parse(fs.readFileSync(targetFile, "utf-8")),
        tempInfoPlist;

    _.each(configItems, function (item) {
        var key = item.parent;
        var plistXml = "<plist><dict><key>" + key + "</key>";
        plistXml += item.data + "</dict></plist>";

        var configPlistObj = plist.parse(plistXml);
        infoPlist[key] = configPlistObj[key];
    });

    tempInfoPlist = plist.build(infoPlist);
    tempInfoPlist = tempInfoPlist.replace(/<string>[\s\r\n]*<\/string>/g,"<string></string>");
    fs.writeFileSync(targetFile, tempInfoPlist, "utf-8");
}

function updateConstants(rootdir, fileName, target, configObj) {
    var fullFileName = path.join(rootdir, fileName);

    if (fs.existsSync(fullFileName)) {

        console.log("In " + fullFileName + " - setting AM_API URL to: " + configObj[target].app_urls.am_api);
        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_APP_URL_AM_API@@@", configObj[target].app_urls.am_api);

        console.log("In " + fullFileName + " - setting AUTH_API URL to: " + configObj[target].app_urls.auth_api);
        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_APP_URL_AUTH_API@@@", configObj[target].app_urls.auth_api);

        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_LOGGING_ENABLED@@@", configObj[target].logging_enabled);

        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_AUTH_CLIENT_ID@@@", configObj[target].auth.client_id);
        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_AUTH_CLIENT_SECRET@@@", configObj[target].auth.client_secret);

    } else {
        console.log("ERROR missing " + fullFileName + " file.");
    }
}

function updateIndex(rootdir, fileName, target, configObj) {
    var fullFileName = path.join(rootdir, fileName);

    if (fs.existsSync(fullFileName)) {

        console.log("In " + fullFileName + " - setting Content Security Policy to: " + configObj[target].content_security_policy);

        replaceStringInFile(fullFileName, "@@@STRING_REPLACE_CSP@@@", configObj[target].content_security_policy);

    } else {
        console.log("ERROR missing " + fullFileName + " file.");
    }
}

function whiteListDomainsOnIos(rootdir, target, configObj) {
    var KEY_APP_TRANSPORT_SECURITY = "NSAppTransportSecurity",
        KEY_EXCEPTION_DOMAINS = "NSExceptionDomains",
        KEY_ALLOW_ARBITRARY_LOADS = "NSAllowsArbitraryLoads",
        DICT_WHITELIST_SETTINGS = "" +
            "<dict>" +
            "   <key>NSIncludesSubdomains</key>" +
            "   <true/>" +
            "   <key>NSExceptionAllowsInsecureHTTPLoads</key>" +
            "   <true/>" +
            "   <key>NSExceptionRequiresForwardSecrecy</key>" +
            "   <false/>" +
            "   <key>NSExceptionMinimumTLSVersion</key>" +
            "   <string>TLSv1.2</string>" +
            "   <key>NSThirdPartyExceptionAllowsInsecureHTTPLoads</key>" +
            "   <true/>" +
            "   <key>NSThirdPartyExceptionRequiresForwardSecrecy</key>" +
            "   <false/>" +
            "   <key>NSThirdPartyExceptionMinimumTLSVersion</key>" +
            "   <string>TLSv1.2</string>" +
            "</dict>";

    var fileName = "platforms/ios/AcctMaint/AcctMaint-Info.plist",// TODO: get the project name from config.xml
        fullFileName = path.join(rootdir, fileName);

    if (fs.existsSync(fullFileName)) {

        var whiteListDomains = configObj[target].whitelist_domains,
            whiteListConfig = {},
            plistXml = "";

        if (whiteListDomains && whiteListDomains.length > 0) {

            // disable App Transport Security
            if (whiteListDomains[0] === "*") {
                plistXml = "<dict><key>" + KEY_ALLOW_ARBITRARY_LOADS + "</key><true/></dict>";
            }
            // add the App Transport Security settings with the white listed domains added as exceptions
            else {
                plistXml = "<dict><key>" + KEY_EXCEPTION_DOMAINS + "</key><dict>";

                _.each(whiteListDomains, function (domain) {
                    console.log("In " + fullFileName + " - setting WhiteList for domain: " + domain);

                    plistXml += "<key>" + domain + "</key>";
                    plistXml += DICT_WHITELIST_SETTINGS;
                });

                plistXml += "</dict></dict>";
            }

        }
        // enable App Transport Security on all domains
        else {
            plistXml = "<dict><key>" + KEY_ALLOW_ARBITRARY_LOADS + "</key><false/></dict>";
        }

        whiteListConfig.parent = KEY_APP_TRANSPORT_SECURITY;
        whiteListConfig.data = plistXml;
        updateIosPlist(fullFileName, [whiteListConfig]);

    } else {
        console.log("ERROR missing " + fullFileName + " file.");
    }
}

if (rootdir) {
    var target = "stage"; //default to stage
    if (process.env.TARGET) {
        target = process.env.TARGET;
    }

    console.log("Build Target set to: " + target);

    try {

        var configFile = path.join(rootdir, "project.json");
        var configObj = JSON.parse(fs.readFileSync(configFile, "utf8"));

        // Update constants.js for each platform
        updateConstants(rootdir, "platforms/android/assets/www/app/shared/core/constants.js", target, configObj);
        updateConstants(rootdir, "platforms/ios/www/app/shared/core/constants.js", target, configObj);
        updateConstants(rootdir, "platforms/browser/www/app/shared/core/constants.js", target, configObj);

        // Update index.html for each platform
        updateIndex(rootdir, "platforms/android/assets/www/index.html", target, configObj);
        updateIndex(rootdir, "platforms/ios/www/index.html", target, configObj);
        updateIndex(rootdir, "platforms/browser/www/index.html", target, configObj);

        // Add whitelisted domains for each platform
        // Android not needed at this time
        whiteListDomainsOnIos(rootdir, target, configObj);
        // browser not needed at this time

    } catch(e) {
        console.log(e);
    }
} else {
    console.log("ERROR missing rootdir");
}



