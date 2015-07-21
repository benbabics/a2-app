(function () {
    "use strict";

    exports.config = {
        // url where your app is running, relative URLs are prepended with this URL
        baseUrl: "http://localhost:8100",

        // location of E2E test specs
        specs: [
            "e2e/specs/**/*.spec.js"
        ],

        // Patterns to exclude.
        exclude: [],

        // Alternatively, suites may be used. When run without a command line
        // parameter, all suites will run. If run with --suite=smoke or
        // --suite=smoke,full only the patterns matched by the specified suites will
        // run.
        suites: {
            smoke: "e2e/specs/smoketests/**/*.js",
            full: "e2e/specs/**/*.spec.js",
            landing: "e2e/specs/landing/**/*.js",
            menu: "e2e/specs/menu/**/*.js",
            navBar: "e2e/specs/navBar/**/*.js",
            payment: "e2e/specs/payment/**/*.js",
            userLogin: "e2e/specs/userLogin/**/*.js"
        },

        // For a list of available capabilities, see
        // https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
        //

        // configure multiple browsers to run tests
        // multiCapabilities: [{
        //   'browserName': 'firefox'
        // }, {
        //   'browserName': 'chrome'
        // }, {
        //   'browserName': 'safari'
        // }],

        // or configure a single browser
        capabilities: {
            "browserName": "chrome",
            "chromeOptions": {
                "args": ["disable-web-security", "test-type"]
            }
        },

        // Jasmine and Jasmine2 are fully supported as test and assertion frameworks.
        // Mocha and Cucumber have limited support. You will need to include your
        // own assertion framework (such as Chai) if working with Mocha.
        framework: "jasmine2",

        jasmineNodeOpts: {
            // If true, print colors to the terminal.
            showColors: true
        },

        allScriptsTimeout: 20000,

        onPrepare: function () {

            // setup http mocks
            var httpBackendTemplatesPassThrough = function() {
                angular.module("httpBackendTemplatesPassThrough", ["app", "ngMockE2E"])
                    .run(function($httpBackend) {
                        $httpBackend.whenGET(/\.html$/).passThrough();
                    });
            };

            browser.addMockModule("httpBackendTemplatesPassThrough", httpBackendTemplatesPassThrough);
        }
    };

}());