#!/usr/bin/env node

"use strict";

// Set Environment
// v2.0
// Automatically sets specific environment values based on the build target environment argument.

/* jshint -W106 */ // Ignore variables with underscores that were not created by us

module.exports = function(context) {
    console.log(context.hook + " hook is running script " + context.scriptLocation);
    var LOG_PREFIX = "    ";

    // global vars
    var fs = context.requireCordovaModule("fs");
    var path = context.requireCordovaModule("path");
    var _ = context.requireCordovaModule("lodash");
    var et = context.requireCordovaModule("elementtree");
    var plist = context.requireCordovaModule("plist");

    var rootdir = context.opts.projectRoot;

    var platformConfig = (function () {

        // Constants
        var FILE_PATHS = {
            constants: {
                appScripts     : "/www/scripts.js",
                config         : "config.xml",
                configAndroid  : "/res/xml/config.xml",
                configIos      : "/Fleet SmartHub/config.xml"
            },
            index: "/www/index.html"
        };
        var ANDROID_ASSETS_PATH = "/assets";

        // Private members
        var configXmlData;

        // Public members
        return {

            // Parses a given file into an elementtree object
            parseElementtreeSync: function (filename) {
                var contents = fs.readFileSync(filename, "utf-8");
                if (contents) {
                    //Windows is the BOM. Skip the Byte Order Mark.
                    contents = contents.substring(contents.indexOf("<"));
                }
                return new et.ElementTree(et.XML(contents));
            },

            // Parses the config.xml into an elementtree object and stores in the config object
            getConfigXml: function () {
                if (!configXmlData) {
                    configXmlData = this.parseElementtreeSync(path.join(rootdir, "config.xml"));
                }

                return configXmlData;
            },

            getIosWhiteListConfig: function (targetEnv) {
                // Constants
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

                var whiteListDomains = this.getEnvironmentProperties(targetEnv).whitelist_domains,
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
                            console.log(LOG_PREFIX + "Setting WhiteList for domain: " + domain);

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

                return whiteListConfig;
            },

            getEnvironmentProperties: function (targetEnv) {
                var configFile = path.join(rootdir, "project.json");
                var configObj = JSON.parse(fs.readFileSync(configFile, "utf8"));

                return configObj[targetEnv];
            },

            parseConfig: function (platform, targetEnv) {
                var configData = {
                    environmentProperties: this.getEnvironmentProperties(targetEnv),
                    platformProperties   : []
                };

                if (platform === "ios") {
                    configData.platformProperties.push(this.getIosWhiteListConfig(targetEnv));
                }

                return configData;
            },

            replaceStringInFile: function (targetFile, toReplace, replaceWith) {
                try {
                    var data = fs.readFileSync(targetFile, "utf8");

                    var result = data.replace(new RegExp(toReplace, 'g'), replaceWith);
                    fs.writeFileSync(targetFile, result, "utf8");
                }
                catch (e) {
                    console.log(LOG_PREFIX + e);
                }
            },

            updateConstants: function (platform, platformPath, configObj) {
                var properties = configObj.environmentProperties,
                    CONSTANTS = {
                        "@@@STRING_REPLACE_APP_URL_AM_API@@@"                      : properties.app_urls.am_api,
                        "@@@STRING_REPLACE_APP_URL_AUTH_API@@@"                    : properties.app_urls.auth_api,
                        "@@@STRING_REPLACE_APP_URL_CONFIGURATION_API@@@"           : properties.app_urls.configuration_api,
                        "@@@STRING_REPLACE_APP_URL_NOTIFICATIONS_API@@@"           : properties.app_urls.notifications_api,
                        "@@@STRING_REPLACE_APP_URL_ONLINE_ENROLLMENT_API@@@"       : properties.app_urls.online_enrollment_api,
                        "@@@STRING_REPLACE_AUTH_CLIENT_ID@@@"                      : properties.auth.client_id,
                        "@@@STRING_REPLACE_AUTH_CLIENT_SECRET@@@"                  : properties.auth.client_secret,
                        "@@@STRING_REPLACE_GOOGLE_ANALYTICS_TRACKING_ID_GENERIC@@@": properties.google_analytics_tracking_ids.generic,
                        "@@@STRING_REPLACE_GOOGLE_ANALYTICS_TRACKING_ID_WEX@@@"    : properties.google_analytics_tracking_ids.wex,
                        "@@@STRING_REPLACE_IS_PRODUCTION@@@"                       : _.get(properties, "is_prod",  _.startsWith(process.env.TARGET.toLowerCase(), "prod")),
                        "@@@STRING_REPLACE_LOGGING_ENABLED@@@"                     : properties.logging_enabled
                    },
                    self = this,
                    doConstantReplace = function (value, placeholder, targetFile) {
                        console.log(LOG_PREFIX + "In " + targetFile + " - setting" + placeholder + " to: " + value);
                        self.replaceStringInFile(targetFile, placeholder, value);
                    };

                _.forOwn(FILE_PATHS.constants, function (constantsFile) {
                    var targetFile;

                    if (platform === "android" && _.startsWith(constantsFile, "/www")) {
                        targetFile = path.join(platformPath, ANDROID_ASSETS_PATH, constantsFile);
                    }
                    else {
                        targetFile = path.join(platformPath, constantsFile);
                    }

                    if (fs.existsSync(targetFile)) {
                        _.forOwn(CONSTANTS, _.partial(doConstantReplace, _, _, targetFile));
                    } else {
                        console.log(LOG_PREFIX + "ERROR missing " + targetFile + " file.");
                    }
                });
            },

            updateIndex: function (platform, platformPath, configObj) {
                var properties = configObj.environmentProperties,
                    targetFile;

                if (platform === "android") {
                    platformPath += ANDROID_ASSETS_PATH;
                }

                targetFile = path.join(platformPath, FILE_PATHS.index);

                if (fs.existsSync(targetFile)) {

                    console.log(LOG_PREFIX + "In " + targetFile + " - setting Content Security Policy to: " + properties.content_security_policy);

                    this.replaceStringInFile(targetFile, "@@@STRING_REPLACE_CSP@@@", properties.content_security_policy);

                } else {
                    console.log(LOG_PREFIX + "ERROR missing " + targetFile + " file.");
                }
            },

            updateIosPlist: function (platform, platformPath, projectName, configObj) {
                var configItems = configObj.platformProperties,
                    targetFile = path.join(platformPath, projectName, projectName + "-Info.plist"),
                    infoPlist = plist.parse(fs.readFileSync(targetFile, "utf-8")),
                    tempInfoPlist;

                _.each(configItems, function (item) {
                    var key = item.parent;
                    var plistXml = "<plist><dict><key>" + key + "</key>";
                    plistXml += item.data + "</dict></plist>";

                    var configPlistObj = plist.parse(plistXml);
                    infoPlist[key] = configPlistObj[key];
                });

                tempInfoPlist = plist.build(infoPlist);
                tempInfoPlist = tempInfoPlist.replace(/<string>[\s\r\n]*<\/string>/g, "<string></string>");
                fs.writeFileSync(targetFile, tempInfoPlist, "utf-8");
            },

            // Parses config data, and update each target file for a specified platform
            updatePlatformConfig: function (platform, targetEnv) {
                var configData = this.parseConfig(platform, targetEnv),
                    platformPath = path.join(rootdir, "platforms", platform),
                    projectName = platformConfig.getConfigXml().findtext("name");

                // Platform specific config targets go here
                switch (platform) {
                    case "ios":
                        platformConfig.updateIosPlist(platform, platformPath, projectName, configData);
                        break;
                    case "android":

                        break;
                    case "browser":

                        break;
                }

                // Platform universal config targets go here
                platformConfig.updateConstants(platform, platformPath, configData);
                platformConfig.updateIndex(platform, platformPath, configData);
            }

        };
    })();

    // Main
    (function () {
        if (rootdir) {
            var targetEnv = "stage"; //default to stage
            if (process.env.TARGET) {
                targetEnv = process.env.TARGET;
            }

            console.log(LOG_PREFIX + "Build Target set to: " + targetEnv);

            // go through each of the platforms requested in the build
            _.each(context.opts.platforms, function (platform) {
                try {
                    platform = platform.trim().toLowerCase();
                    platformConfig.updatePlatformConfig(platform, targetEnv);
                } catch (e) {
                    console.log(LOG_PREFIX + e);
                }
            });
        }
        else {
            console.log(LOG_PREFIX + "ERROR missing rootdir");
        }
    })();

    console.log(context.hook + " hook has finished running script " + context.scriptLocation);
};
