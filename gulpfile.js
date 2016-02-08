"use strict";

/* jshint -W003 */

var gulp = require("gulp");
var gutil = require("gulp-util");
var bower = require("bower");
var sass = require("gulp-sass");
var minifyCss = require("gulp-minify-css");
var rename = require("gulp-rename");
var sh = require("shelljs");
var wiredep = require("wiredep").stream;
var angularFilesort = require("gulp-angular-filesort");
var inject = require("gulp-inject");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");
var webserver = require("gulp-webserver");

var sourcePaths = {
    root: {
        sass: ["./scss/*.scss"],
        css: ["./www/css/**/*.css"],
        cssMin: ["./www/css/**/*min.css"],
        scripts: ["./www/app/**/*.js"],
        indexPage: ["./www/index.html"]
    },
    browser: ["./platforms/browser/www"]
};

var destPaths = {
    root: {
        root: "./www/",
        css: "./www/css/"
    }
};

var config = {
    webserver: {
        port: 8100,
        open: true
    }
};

gulp.task("default", ["sass", "index", "watch"]);

/**
 * Installation Tasks
 */
gulp.task("install", ["git-check"], function () {
    return bower.commands.install()
        .on("log", function (data) {
            gutil.log("bower", gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task("git-check", function (done) {
    if (!sh.which("git")) {
        console.log(
            "  " + gutil.colors.red("Git is not installed."),
            "\n  Git, the version control system, is required to download Ionic.",
            "\n  Download git here:", gutil.colors.cyan("http://git-scm.com/downloads") + ".",
            "\n  Once git is installed, run \"" + gutil.colors.cyan("gulp install") + "\" again."
        );
        process.exit(1);
    }
    done();
});

/**
 * Index.html building and compilation Tasks
 */
gulp.task("sass", function (done) {
    gulp.src(sourcePaths.root.sass)
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest(destPaths.root.css))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: ".min.css"}))
        .pipe(gulp.dest(destPaths.root.css))
        .on("end", done);
});

gulp.task("watch", function () {
    gulp.watch(sourcePaths.root.sass, ["sass"]);
    gulp.watch([sourcePaths.root.css, sourcePaths.root.scripts], ["index"]);
});

gulp.task("bower", function () {
    gulp.src(sourcePaths.root.indexPage)
        .pipe(wiredep({
            exclude: ["ionic.css", "ionic.min.css"]
        }))
        .pipe(gulp.dest(destPaths.root.root));
});

gulp.task("index", function () {
    return gulp.src(sourcePaths.root.indexPage)
        .pipe(inject(gulp.src(sourcePaths.root.scripts).pipe(angularFilesort()), {relative: true}))
        .pipe(inject(gulp.src(sourcePaths.root.cssMin, {read: false}), {relative: true}))
        .pipe(gulp.dest(destPaths.root.root));
});

/**
 * Cordova Tasks
 */
gulp.task("cordova-prepare", function () {
    sh.exec("cordova prepare");
});

/**
 * Ionic Tasks
 */
gulp.task("ionic-serve", function () {
    sh.exec("ionic serve");
});

gulp.task("ionic-serve-lab", function () {
    sh.exec("ionic serve -l");
});

gulp.task("ionic-dev-build", function () {
    sh.env.TARGET = "dev";
    sh.exec("ionic build");
});

gulp.task("ionic-dev-build-browser", function () {
    sh.env.TARGET = "dev";
    sh.exec("ionic build browser");
});

gulp.task("ionic-dev-run-browser", function () {
    sh.env.TARGET = "dev";
    sh.exec("ionic build browser");

    gulp.src(sourcePaths.browser)
        .pipe(webserver(config.webserver));
});

gulp.task("ionic-dit-build", function () {
    sh.env.TARGET = "dit";
    sh.exec("ionic build");
});

gulp.task("ionic-dit-build-browser", function () {
    sh.env.TARGET = "dit";
    sh.exec("ionic build browser");
});

gulp.task("ionic-dit-run-browser", function () {
    sh.env.TARGET = "dit";
    sh.exec("ionic build browser");

    gulp.src(sourcePaths.browser)
        .pipe(webserver(config.webserver));
});

gulp.task("ionic-dit-emulate-ios", function () {
    sh.env.TARGET = "dit";
    sh.exec("ionic emulate ios");
});

gulp.task("ionic-stage-build", function () {
    sh.env.TARGET = "stage";
    sh.exec("ionic build");
});

gulp.task("ionic-stage-build-browser", function () {
    sh.env.TARGET = "stage";
    sh.exec("ionic build browser");
});

gulp.task("ionic-stage-build-release-android", function () {
    sh.env.TARGET = "stage";
    sh.exec("ionic build android --release");
});

gulp.task("ionic-stage-emulate-android", function () {
    sh.env.TARGET = "stage";
    sh.exec("ionic emulate android");
});

gulp.task("ionic-stage-emulate-ios", function () {
    sh.env.TARGET = "stage";
    sh.exec("ionic emulate ios");
});

gulp.task("ionic-stage-run-android", function () {
    sh.env.TARGET = "stage";
    sh.exec("ionic run android");
});

gulp.task("ionic-stage-run-browser", function () {
    sh.env.TARGET = "stage";
    sh.exec("ionic build browser");

    gulp.src(sourcePaths.browser)
        .pipe(webserver(config.webserver));
});

gulp.task("ionic-stage-run-ios", function () {
    sh.env.TARGET = "stage";
    sh.exec("ionic run ios --device");
});

gulp.task("ionic-prod-build", function () {
    sh.env.TARGET = "prod";
    sh.exec("ionic build");
});

gulp.task("ionic-prod-build-release", function () {
    sh.env.TARGET = "prod";
    sh.exec("ionic build --release");
});

/**
 * Code Analysis Tasks
 */
gulp.task("static-code-analysis", function() {
    log("Analyzing source with JSHint and JSCS");

    return gulp
        .src(sourcePaths.root.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish", {verbose: true}))
        .pipe(jshint.reporter("fail"))
        .pipe(jscs());
});

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === "object") {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                gutil.log(gutil.colors.blue(msg[item]));
            }
        }
    } else {
        gutil.log(gutil.colors.blue(msg));
    }
}
