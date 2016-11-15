#!/usr/bin/env node

"use strict";

/**
 * After build, application scripts are combined into a single JS file.
 */

module.exports = function(context) {
    console.log(context.hook + " hook is running script " + context.scriptLocation);

    var path = context.requireCordovaModule("path");
    var fs = context.requireCordovaModule('fs');
    var gulp = context.requireCordovaModule("gulp");
    var concat = context.requireCordovaModule("gulp-concat");
    var angularFilesort = context.requireCordovaModule("gulp-angular-filesort");
    var naturalSort = context.requireCordovaModule("gulp-natural-sort");
    var stringify = context.requireCordovaModule('stringify-object');
    var tap = context.requireCordovaModule('gulp-tap');

    var dir = path.join(context.opts.projectRoot, "www");

    var templates = {};

    gulp.src(dir + "/app/**/*.html")
        .pipe(naturalSort())
        .pipe(tap(function(file) {
            var filePath = file.relative;

            templates["app/" + filePath.replace(/\\/g, "/")] = fs.readFileSync(path.join(dir, "app", filePath), "utf8")
                .replace(/[\u0000-\u0019]+/g,"")  // remove unprintable characters
                .replace(/<!--[\s\S]*?-->/g, '')  // remove html comments
                .replace(/(\s\s+)/g, ' ')         // collapse spaces
                .replace(/(> <)/g, '><');         // remove spaces between tags
        }))
        .pipe(tap(function() {
            var script = '(function(){"use strict";angular.module("app.templates",[]).run(function($templateCache){var templates=' +
                stringify(templates, { indent: '' }) +
                ';var templateNames=Object.keys(templates);templateNames.forEach(function(templateName){$templateCache.put(templateName,templates[templateName]);});});})();\n';

            fs.writeFileSync(path.join(dir, "app", "templates.module.js"), script, "utf8");
        }));

    gulp.src(dir + "/app/**/*.js")
        .pipe(naturalSort())
        .pipe(angularFilesort())
        .pipe(concat("scripts.js"))
        .pipe(gulp.dest(dir));

    console.log(context.hook + " hook has finished running script " + context.scriptLocation);
};
