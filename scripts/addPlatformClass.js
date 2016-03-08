#!/usr/bin/env node

"use strict";

// Add Platform Class
// v1.0
// Automatically adds the platform class to the body tag
// after the `prepare` command. By placing the platform CSS classes
// directly in the HTML built for the platform, it speeds up
// rendering the correct layout/style for the specific platform
// instead of waiting for the JS to figure out the correct classes.

module.exports = function(context) {
    console.log(context.hook + " hook is running script " + context.scriptLocation);
    var LOG_PREFIX = "    ";

    var fs = context.requireCordovaModule("fs");
    var path = context.requireCordovaModule("path");
    var _ = context.requireCordovaModule("lodash");

    var rootdir = context.opts.projectRoot;

    function addPlatformBodyTag(indexPath, platform) {
        // add the platform class to the body tag
        try {
            var platformClass = "platform-" + platform;
            var cordovaClass = "platform-cordova platform-webview";

            var html = fs.readFileSync(indexPath, "utf8");

            var bodyTag = findBodyTag(html);
            if (!bodyTag) {
                return; // no opening body tag, something's wrong
            }

            if (bodyTag.indexOf(platformClass) > -1) {
                return; // already added
            }

            var newBodyTag = bodyTag;

            var classAttr = findClassAttr(bodyTag);
            if (classAttr) {
                // body tag has existing class attribute, add the classname
                var endingQuote = classAttr.substring(classAttr.length - 1);
                var newClassAttr = classAttr.substring(0, classAttr.length - 1);
                newClassAttr += " " + platformClass + " " + cordovaClass + endingQuote;
                newBodyTag = bodyTag.replace(classAttr, newClassAttr);

            } else {
                // add class attribute to the body tag
                newBodyTag = bodyTag.replace(">", " class=\"" + platformClass + " " + cordovaClass + "\">");
            }

            html = html.replace(bodyTag, newBodyTag);

            fs.writeFileSync(indexPath, html, "utf8");

            console.log(LOG_PREFIX + "add to body class: " + platformClass);
        } catch (e) {
            console.log(LOG_PREFIX + e);
        }
    }

    function findBodyTag(html) {
        // get the body tag
        try {
            return html.match(/<body(?=[\s>])(.*?)>/gi)[0];
        } catch (e) {
        }
    }

    function findClassAttr(bodyTag) {
        // get the body tag's class attribute
        try {
            return bodyTag.match(/ class=["|'](.*?)["|']/gi)[0];
        } catch (e) {
        }
    }

    if (rootdir) {

        // go through each of the platforms requested in the build
        _.each(context.opts.platforms, function (platform) {
            // open up the index.html file at the www root
            try {
                var indexPath;

                platform = platform.trim().toLowerCase();

                if (platform === "android") {
                    indexPath = path.join("platforms", platform, "assets", "www", "index.html");
                } else {
                    indexPath = path.join("platforms", platform, "www", "index.html");
                }

                if (fs.existsSync(indexPath)) {
                    addPlatformBodyTag(indexPath, platform);
                }

            } catch (e) {
                console.log(LOG_PREFIX + e);
            }
        });

    }

    console.log(context.hook + " hook has finished running script " + context.scriptLocation);
};
