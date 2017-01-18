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
var angularFilesort = require("gulp-angular-filesort");
var naturalSort = require("gulp-natural-sort");
var concat = require("gulp-concat");
var tap = require('gulp-tap');
var path = require("path");
var fs = require('fs');
var stringify = require('stringify-object');
var inject = require("gulp-inject");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");
var webserver = require("gulp-webserver");
var gulpsync = require("gulp-sync")(gulp);
var KarmaServer = require("karma").Server;
var babel = require("gulp-babel");
var plumber = require("gulp-plumber");
var sourcemaps = require("gulp-sourcemaps");
var del = require("del");

var config = {
    compile: {
        es: {
            version: "es2015"
        },
        scriptName: "scripts.js",
        templateScriptName: "templates.module.js"
    },
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

var sourcePaths = {
    root: {
        root: "./src/",
        sass: ["./scss/*.scss"],
        scripts: ["./src/app/**/*.js"],
        templates: ["./src/app/**/*.html"],
        indexPage: ["./src/index.html"],
        dependencies: ["src/lib/**/*", "src/fonts/**/*", "src/img/**/*"]
    },
    browser: ["./platforms/browser/www"]
};

var destPaths = {
    rootDir: "./www/",
    cssDir: "./www/css/",
    cssFiles: ["./www/**/*.css"],
    cssMinFiles: ["./www/**/*min.css"],
    scriptFile: path.join("./www/", config.compile.scriptName),
    templatesFile: path.join("./www/", config.compile.templateScriptName)
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
 * Dependency building and compilation Tasks
 */
gulp.task("clean", function () {
    return del(destPaths.root);
});

gulp.task("sass", function (done) {
    gulp.src(sourcePaths.root.sass)
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(cleanCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: ".min.css"}))
        .pipe(gulp.dest(destPaths.cssDir))
        .on("end", done);
});

gulp.task("bower", function (done) {
    gulp.src(sourcePaths.root.indexPage)
        .pipe(wiredep({
            exclude: "/angular/"
        }))
        .pipe(gulp.dest(sourcePaths.root.root))
        .on("end", done);
});

gulp.task("index", function (done) {
    gulp.src(sourcePaths.root.indexPage)
        .pipe(gulp.dest(destPaths.rootDir))
        .pipe(inject(gulp.src(destPaths.cssMinFiles, {read: false}), {relative: true}))
        .pipe(gulp.dest(destPaths.rootDir))
        .on("end", done);
});

gulp.task("copy-deps", function (done) {
    gulp.src(sourcePaths.root.dependencies, {base: sourcePaths.root.root})
        .pipe(gulp.dest(destPaths.rootDir))
        .on("end", done);
});

gulp.task("concat-html", function (done) {
    var templates = {};

    gulp.src(sourcePaths.root.templates)
        .pipe(naturalSort())
        .pipe(tap(function (file) {
            templates["app/" + file.relative.replace(/\\/g, "/")] = fs.readFileSync(file.path, "utf8")
                .replace(/[\u0000-\u0019]+/g, "") // remove unprintable characters
                .replace(/<!--[\s\S]*?-->/g, "")  // remove html comments
                .replace(/(\s\s+)/g, " ")         // collapse spaces
                .replace(/(> <)/g, "><");         // remove spaces between tags
        }))
        .on("end", function() {
            var script = [
                "(function() {",
                    "\"use strict\";",
                    "angular.module(\"app.templates\", []).run(function($templateCache) {",
                        "var templates = ", stringify(templates, {indent: ""}), ";",
                        "var templateNames = Object.keys(templates);",
                        "templateNames.forEach(function(templateName) {",
                            "$templateCache.put(templateName, templates[templateName]);",
                        "});",
                    "});",
                "})();"].join("");

            if (!fs.existsSync(destPaths.rootDir)) {
                fs.mkdirSync(destPaths.rootDir);
            }

            fs.writeFile(destPaths.templatesFile, script, "utf8", done);
        });
});

gulp.task("compile", ["concat-html"], function (done) {
    gulp.src(sourcePaths.root.scripts.concat([destPaths.templatesFile]))
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({presets: [config.compile.es.version]}))
        .pipe(naturalSort())
        .pipe(angularFilesort())
        .pipe(concat(config.compile.scriptName))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destPaths.rootDir))
        .on("end", function () {
            done();
        });
});

gulp.task("link", gulpsync.sync(["sass", "bower", "index", "copy-deps"]));

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

gulp.task("watch", function () {
    gulp.watch([sourcePaths.root.sass, sourcePaths.root.scripts], ["ionic-build-browser"]);
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

gulp.task("build-src", gulpsync.sync(["clean", "compile", "link"]));

gulp.task("ionic-dev-build", ["build-src"], function (done) {
    sh.env.TARGET = "dev";
    sh.exec("ionic build", done);
});

gulp.task("ionic-build-browser", ["build-src"], function (done) {
    sh.exec("ionic build browser", done);
});

gulp.task("ionic-dev-build-browser", ["build-src"], function (done) {
    sh.env.TARGET = "dev";
    sh.exec("ionic build browser", done);
});

gulp.task("ionic-dit-build", ["build-src"], function (done) {
    sh.env.TARGET = "dit";
    sh.exec("ionic build", done);
});

gulp.task("ionic-dit-build-browser", ["build-src"], function (done) {
    sh.env.TARGET = "dit";
    sh.exec("ionic build browser", done);
});

gulp.task("ionic-dit-emulate-ios", ["build-src"], function (done) {
    sh.env.TARGET = "dit";
    sh.exec("ionic emulate ios", done);
});

gulp.task("ionic-stage-build", ["build-src"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic build", done);
});

gulp.task("ionic-stage-build-browser", ["build-src"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic build browser", done);
});

gulp.task("ionic-stage-build-release-android", ["build-src"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic build android --release", done);
});

gulp.task("ionic-stage-emulate-android", ["build-src"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic emulate android", done);
});

gulp.task("ionic-stage-emulate-ios", ["build-src"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic emulate ios", done);
});

gulp.task("ionic-stage-run-android", ["build-src"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic run android", done);
});

gulp.task("ionic-stage-run-ios", ["build-src"], function (done) {
    sh.env.TARGET = "stage";
    sh.exec("ionic run ios --device", done);
});

gulp.task("ionic-prod-build", ["build-src"], function (done) {
    sh.env.TARGET = "prod";
    sh.exec("ionic build", done);
});

gulp.task("ionic-prod-build-browser", ["build-src"], function (done) {
    sh.env.TARGET = "prod";
    sh.exec("ionic build browser", done);
});

gulp.task("ionic-prod-build-release", ["build-src"], function (done) {
    sh.env.TARGET = "prod";
    sh.exec("ionic build --release", done);
});

gulp.task("ionic-prod-run-android", ["build-src"], function (done) {
    sh.env.TARGET = "prod";
    sh.exec("ionic run android", done);
});

gulp.task("ionic-prod-run-ios", ["build-src"], function (done) {
    sh.env.TARGET = "prod";
    sh.exec("ionic run ios --device", done);
});

/**
 * Test Tasks
 */
gulp.task("test", ["build-src"], function (done) {
    new KarmaServer({
        configFile: __dirname + "/" + config.test.dir + "/karma.conf.js",
        singleRun: true,
        browsers: ["PhantomJS"],
        browserNoActivityTimeout: 60000
    }, function() {
        done();
    }).start();
});

gulp.task("test-debug", ["build-src"], function (done) {
    gulp.watch([sourcePaths.root.scripts], ["build-src"]);

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
