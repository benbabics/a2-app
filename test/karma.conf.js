// Karma configuration
// Generated on Mon Jan 26 2015 10:39:21 GMT-0500 (EST)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "../www",


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            "jasmine"
        ],


        // list of files / patterns to load in the browser
        files: [
            // Code libraries
            "lib/angular/angular.js",
            "lib/angular-animate/angular-animate.js",
            "lib/angular-sanitize/angular-sanitize.js",
            "lib/angular-ui-router/release/angular-ui-router.js",
            "lib/ionic/release/js/ionic.js",
            "lib/ionic/release/js/ionic-angular.js",
            "lib/lodash/lodash.js",
            "lib/restangular/dist/restangular.js",
            "lib/angular-base64/angular-base64.js",
            "lib/ngCordova/dist/ng-cordova.js",
            "lib/ngFitText/src/ng-FitText.js",
            "lib/moment/moment.js",
            "lib/angular-moment/angular-moment.js",
            "lib/ionic-datepicker-widget/dist/ionic-datepicker.min.js",
            "lib/ang-accordion/js/ang-accordion.js",
            "lib/Chart.js/Chart.js",
            "lib/angular-chart.js/dist/angular-chart.js",
            "lib/ngstorage/ngStorage.js",

            // Test libraries
            "../test/lib/**/*.js",

            // Test Utilities
            "../test/unit/testUtils.js",

            // Source code
            "app/**/*.module.js",
            "app/**/*!(.module).js",

            // Unit Tests
            "../test/unit/**/*.spec.js",

            // HTML files
            "app/**/*.html"
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "app/**/*.js": "coverage",
            "**/*.html": "ng-html2js"
        },


        // test results reporter to use
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress", "coverage", "teamcity", "junit"],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ["Chrome", "PhantomJS"],

        plugins: [
            "karma-teamcity-reporter",
            "karma-coverage",
            "karma-junit-reporter",
            "karma-chrome-launcher",
            "karma-phantomjs-launcher",
            "karma-jasmine",
            "karma-ng-html2js-preprocessor"
        ],

        junitReporter: {
            outputFile: "../test/results/unit/test_results.xml",
            suite: "unit"
        },

        // NOTE (as of karma v0.12.36 + karma-coverage v0.4.2): coverage reports aren't generated when run from IntelliJ Karma plugin
        coverageReporter: {
            dir: "../test/results/unit/coverage/",
            type: "html"
        },

        ngHtml2JsPreprocessor: {
            moduleName: "app.html"
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
