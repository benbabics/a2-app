"use strict";

var gulp = require("gulp");
var bower = require("bower");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var sh = require("shelljs");
var angularFilesort = require("gulp-angular-filesort");
var inject = require("gulp-inject");
var protractor = require("gulp-protractor").protractor;

// the source paths
var sourcePaths = {
    root: {
        sass: ["../scss/*.scss"],
        css: ["../www/css/**/*.css"],
        cssMin: ["../www/css/**/*min.css"],
        scripts: ["../www/app/**/*.js"],
        templates: ["../www/app/**/*.html"],
        images: ["../www/img/**/*.*"],
        testsE2E: ["e2e/**/*.spec.js"],
        indexPage: ["../www/index.html"],
        protractorConf: "protractor.conf.js"
    },
    browser: {
        css: ["../platforms/browser/www/css/**/*.css"],
        cssMin: ["../platforms/browser/www/css/**/*min.css"],
        scripts: ["../platforms/browser/www/app/**/*.js"],
        templates: ["../platforms/browser/www/app/**/*.html"],
        images: ["../platforms/browser/www/img/**/*.*"],
        indexPage: ["../platforms/browser/www/index.html"]
    }
};
// the destination paths
var destPaths = {
    root: {
        css: "../www/css/",
        scripts: "../www/app/",
        templates: "../www/app/",
        images: "../www/img/",
        indexPage: "../www/index.html",
        root: "../www/"
    },
    browser: {
        css: "../platforms/browser/www/css/",
        scripts: "../platforms/browser/www/app/",
        templates: "../platforms/browser/www/app/",
        images: "../platforms/browser/www/img/",
        indexPage: "../platforms/browser/www/index.html",
        root: "../platforms/browser/www/"
    }
};

gulp.task("default", ["protractor-watch"]);

gulp.task("ionic-dev-build-browser", function () {
    sh.env["TARGET"] = "dev";
    sh.exec("ionic build browser");
});

/**
 * Protractor Testing Tasks
 */
gulp.task("protractor-lib", function () {
    // copy angular-mocks to the Browser platform
    sh.cp("-Rf", "lib/angular-mocks/*", "../platforms/browser/www/lib/angular-mocks");
});

gulp.task("protractor-index", ["protractor-lib"], function () {
    // add include of angular-mocks to /platforms/browser/www/index.html
    gulp.src(sourcePaths.browser.indexPage)
        .pipe(inject(gulp.src([
            "../platforms/browser/www/lib/angular-mocks/angular-mocks.js",
            "../platforms/browser/www/app/**/*.js"
        ]).pipe(angularFilesort()), {relative: true}))
        .pipe(inject(gulp.src(sourcePaths.browser.cssMin, {read: false}), {relative: true}))
        .pipe(gulp.dest(destPaths.browser.root));
});

gulp.task("protractor-prepare", ["ionic-dev-build-browser", "protractor-index"]);

gulp.task("protractor-watch", function() {
    gulp.watch([sourcePaths.root.css, sourcePaths.root.scripts], ["protractor-prepare"]);
});

gulp.task("protractor-run-all", function () {
    gulp.src(sourcePaths.root.testsE2E)
        .pipe(protractor({
            configFile: sourcePaths.root.protractorConf,
            args: []
        }))
        .on("error", function(e) { throw e; });
});

gulp.task("protractor-run-landing", function () {
    gulp.src(sourcePaths.root.testsE2E)
        .pipe(protractor({
            configFile: sourcePaths.root.protractorConf,
            args: ["--suite=landing"]
        }))
        .on("error", function (e) {
            throw e;
        });
});

gulp.task("protractor-run-navBar", function () {
    gulp.src(sourcePaths.root.testsE2E)
        .pipe(protractor({
            configFile: sourcePaths.root.protractorConf,
            args: ["--suite=navBar"]
        }))
        .on("error", function (e) {
            throw e;
        });
});

gulp.task("protractor-run-payment", function () {
    gulp.src(sourcePaths.root.testsE2E)
        .pipe(protractor({
            configFile: sourcePaths.root.protractorConf,
            args: ["--suite=payment"]
        }))
        .on("error", function (e) {
            throw e;
        });
});

gulp.task("protractor-run-userLogin", function () {
    gulp.src(sourcePaths.root.testsE2E)
        .pipe(protractor({
            configFile: sourcePaths.root.protractorConf,
            args: ["--suite=userLogin"]
        }))
        .on("error", function (e) {
            throw e;
        });
});