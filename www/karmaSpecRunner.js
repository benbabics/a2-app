(function () {
    "use strict";

    var allTestFiles = [],
        TEST_REGEXP = /(spec|test)\.js$/i,
        pathToModule = function (path) {
            return path.replace(/^\/base\/js\//, "");
        };

    Object.keys(window.__karma__.files).forEach(function (file) {
        if (TEST_REGEXP.test(file)) {
            // Normalize paths to RequireJS module names.
            allTestFiles.push(pathToModule(file));
        }
    });

    require.config({
        // Karma serves files under /base, which is the basePath from your config file
        baseUrl: "/base/js",
        paths: {
            // RequireJS Plugins
            "text" : "libs/require/text-min",
            "async": "libs/require/async-min",

            // Frameworks
            "cordova"             : "../spec/cordova.mock",
            "mustache"            : "libs/mustache/mustache-min",
            "backbone"            : "libs/backbone/backbone-min",
            "backbone-validation" : "libs/backbone/backbone-validation-amd-min",
            "underscore"          : "libs/underscore/underscore-min",
            "jquery"              : "libs/jquery/jquery-min",
            "jquery-mobile"       : "libs/jquery/jquery.mobile-min",
            "jclass"              : "libs/jclass/jclass-min",
            "moment"              : "libs/moment/moment-min",
            "moment-timezone"     : "libs/moment/moment-timezone-min",
            "moment-timezone-data": "libs/moment/moment-timezone-data",

            // Helpers
            "utils"   : "helpers/utils",
            "facade"  : "helpers/facade",

            // Directories
            "tmpl": "templates",

            // Testing
            "jasmine": "../spec/libs/jasmine/jasmine",
            "jasmine-html": "../spec/libs/jasmine/jasmine-html",
            "jasmine-jquery": "../spec/libs/jasmine/jasmine-jquery",
            "jasmine-sinon": "../spec/libs/jasmine/jasmine-sinon",
            "jasmine-boot": "../spec/libs/jasmine/boot",
            "sinon": "../spec/libs/sinon",
            "Squire": "../spec/libs/squire",

            "RequestMatchers": "../spec/js/helpers/RequestMatchers"
        },

        //Remember: only use shim config for non-AMD scripts,
        //scripts that do not already call define(). The shim
        //config will not work correctly if used on AMD scripts,
        //in particular, the exports and init config will not
        //be triggered, and the deps config will be confusing
        //for those cases.
        shim: {
            "underscore" : {
                "exports": "_"
            },
            "backbone": {
                "deps"   : ["underscore", "jquery", "mustache"],
                "exports": "Backbone"
            },
            "jquery-mobile": ["jquery", "libs/jquery/jquery.mobile.config-min"],
            "jclass": {
                "exports": "JClass"
            },
            "moment": {
                "exports": "moment"
            },
            "jasmine": {
                "exports": "jasmine"
            },
            "jasmine-html": {
                "deps": ["jasmine"],
                "exports": "jasmine"
            },
            "jasmine-jquery": {
                "deps": ["jasmine"],
                "exports": "jasmine"
            },
            "jasmine-boot": {
                deps: ["jasmine", "jasmine-html"],
                exports: "jasmine"
            },
            "sinon": {
                "exports": "sinon"
            }
        },

        // the number of seconds to wait before timing out (0 disables the timeout)
        waitSeconds: 0,

        // prevents moment from creating a moment global
        noGlobal: true,

        // dynamically load all test files
        deps: allTestFiles
    });

    require([ "jquery-mobile", "cordova" ], function () {
        function onAppReady() {

            // Load the specs
            require(allTestFiles,
                function () {

                    // we have to kickoff jasmine, as it is asynchronous
                    window.__karma__.start();
                });
        }

        if (document.location.protocol === "file:") {
            document.addEventListener("deviceready", onAppReady, false);
        } else {
            onAppReady();
        }
    });
}());
