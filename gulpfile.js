var gulp = require("gulp");
var gutil = require("gulp-util");
var bower = require("bower");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var minifyCss = require("gulp-minify-css");
var rename = require("gulp-rename");
var sh = require("shelljs");
var wiredep = require("wiredep").stream;
var angularFilesort = require("gulp-angular-filesort");
var inject = require("gulp-inject");

var sourcePaths = {
    root: {
        sass: ["./scss/*.scss"],
        css: ["./www/css/**/*.css"],
        cssMin: ["./www/css/**/*min.css"],
        scripts: ["./www/app/**/*.js"],
        indexPage: ["./www/index.html"]
    }
};

var destPaths = {
    root: {
        root: "./www/",
        css: "./www/css/"
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
 * Ionic Tasks
 */
gulp.task("ionic-serve", function () {
    sh.exec("ionic serve");
});

gulp.task("ionic-serve-lab", function () {
    sh.exec("ionic serve -l");
});

gulp.task("ionic-dev-build", function () {
    sh.exec("TARGET=dev ionic build");
});

gulp.task("ionic-dev-build-browser", function () {
    sh.exec("TARGET=dev ionic build browser");
});

gulp.task("ionic-dit-build", function () {
    sh.exec("TARGET=dit ionic build");
});

gulp.task("ionic-dit-build-browser", function () {
    sh.exec("TARGET=dit ionic build browser");
});

gulp.task("ionic-stage-build", function () {
    sh.exec("TARGET=stage ionic build");
});

gulp.task("ionic-stage-build-browser", function () {
    sh.exec("TARGET=stage ionic build browser");
});

gulp.task("ionic-prod-build", function () {
    sh.exec("TARGET=prod ionic build");
});

gulp.task("ionic-prod-build-release", function () {
    sh.exec("TARGET=prod ionic build --release");
});