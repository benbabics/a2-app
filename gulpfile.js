"use strict";

/* jshint -W003 */

/* Helps to debug "Error: spawn ENOENT" issues */
(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

var gulp = require("gulp");
var gutil = require("gulp-util");
var bower = require("bower");
var sass = require("gulp-sass");
var cleanCss = require("gulp-clean-css");
var rename = require("gulp-rename");
var sh = require("shelljs");
var wiredep = require("wiredep").stream;
var inject = require("gulp-inject");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");
var webserver = require("gulp-webserver");
var gulpsync = require("gulp-sync")(gulp);
var KarmaServer = require("karma").Server;

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
    test: {
        dir: "test"
    },
    webserver: {
        host: "127.0.0.1",
        port: 8100,
        open: true,
        livereload: true
    }
};

gulp.task("default", gulpsync.sync(["ionic-build-browser", "watch", "serve-browser"]));

/**
 * Installation Tasks
 */
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

gulp.task("bower-install", ["git-check"], function () {
    return bower.commands.install()
        .on("log", function (data) {
            gutil.log("bower", gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task("npm-install", function (done) {
    sh.exec("yarn", done);
});

gulp.task("ionic-restore", function (done) {
    sh.exec("ionic state reset", done);
});

gulp.task("prepare-environment", gulpsync.sync(["npm-install", "bower-install", "ionic-restore"]));

/**
 * Index.html building and compilation Tasks
 */
gulp.task("sass", function (done) {
    gulp.src(sourcePaths.root.sass)
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest(destPaths.root.css))
        .pipe(cleanCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: ".min.css"}))
        .pipe(gulp.dest(destPaths.root.css))
        .on("end", done);
});

gulp.task("watch", function () {
    gulp.watch([sourcePaths.root.sass, sourcePaths.root.scripts], ["ionic-build-browser"]);
});

gulp.task("bower", function (done) {
    gulp.src(sourcePaths.root.indexPage)
        .pipe(wiredep({
            exclude: "/angular/"
        }))
        .pipe(gulp.dest(destPaths.root.root))
        .on("end", done);
});

gulp.task("index", function (done) {
    gulp.src(sourcePaths.root.indexPage)
        .pipe(inject(gulp.src(sourcePaths.root.cssMin, {read: false}), {relative: true}))
        .pipe(gulp.dest(destPaths.root.root))
        .on("end", done);
});

/**
 * Cordova Tasks
 */
gulp.task("cordova-prepare", function () {
    sh.exec("cordova prepare");
});

/**
 * Webserver tasks
 */
gulp.task("serve-browser", function () {
    gulp.src(sourcePaths.browser)
        .pipe(webserver(config.webserver));
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

/**
 * Build Tasks
 */

gulp.task("ionic-build-prepare", gulpsync.sync(["sass", "index", "bower"]));

gulp.task("ionic-dev-build", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "dev";
    sh.exec("ionic build", done);
});

gulp.task("ionic-build-browser", ["ionic-build-prepare"], function (done) {
    sh.exec("ionic build browser", done);
});

gulp.task("ionic-dev-build-browser", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "dev";
    sh.exec("ionic build browser", done);
});

gulp.task("ionic-dit-build", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "dit";
    sh.exec("ionic build", done);
});

gulp.task("ionic-dit-build-browser", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "dit";
    sh.exec("ionic build browser", done);
});

gulp.task("ionic-dit-emulate-ios", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "dit";
    sh.exec("ionic emulate ios", done);
});

gulp.task("ionic-stage-build", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic build", done);
});

gulp.task("ionic-stage-build-browser", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic build browser", done);
});

gulp.task("ionic-stage-build-release-android", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic build android --release", done);
});

gulp.task("ionic-stage-emulate-android", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic emulate android", done);
});

gulp.task("ionic-stage-emulate-ios", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic emulate ios", done);
});

gulp.task("ionic-stage-run-android", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic run android", done);
});

gulp.task("ionic-stage-run-ios", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic run ios --device", done);
});

gulp.task("ionic-prod-build", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "prod";
    sh.exec("ionic build", done);
});

gulp.task("ionic-prod-build-browser", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "prod";
    sh.exec("ionic build browser", done);
});

gulp.task("ionic-prod-build-release", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "prod";
    sh.exec("ionic build --release", done);
});

gulp.task("ionic-prod-run-android", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "prod";
    sh.exec("ionic run android", done);
});

gulp.task("ionic-prod-run-ios", ["ionic-build-prepare"], function (done) {
    sh.env.TARGET = "prod";
    sh.exec("ionic run ios --device", done);
});

/**
 * Test Tasks
 */
gulp.task("test", function (done) {
    new KarmaServer({
        configFile: __dirname + "/" + config.test.dir + "/karma.conf.js",
        singleRun: true,
        browsers: ["PhantomJS"],
        browserNoActivityTimeout: 60000
    }, function() {
        done();
    }).start();
});

gulp.task("test-debug", function (done) {
    new KarmaServer({
        configFile: __dirname + "/" + config.test.dir + "/karma.conf.js",
        singleRun: false,
        browsers: [],
        browserNoActivityTimeout: 60000
    }, function() {
        done();
    }).start();
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
