"use strict";


require.config({
    baseUrl: "js/",
    urlArgs: "cb=" + Math.random(),
    paths: {
        // RequireJS Plugins
        "text" : "libs/require/text-min",
        "async": "libs/require/async-min",

        // Frameworks
        "cordova"            : "../spec/cordova.mock",
        "mustache"           : "libs/mustache/mustache-min",
        "backbone"           : "libs/backbone/backbone-min",
        "backbone-relational": "libs/backbone/backbone-relational-min",
        "backbone-validation": "libs/backbone/backbone-validation-amd-min",
        "underscore"         : "libs/underscore/underscore-min",
        "jquery"             : "libs/jquery/jquery-min",
        "jquery-mobile"      : "libs/jquery/jquery.mobile-min",
        "jclass"             : "libs/jclass/jclass-min",

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
        "jasmine-teamcity-reporter": "../spec/libs/jasmine/jasmine.teamcity_reporter",
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
        "backbone-relational": {
            "deps": ["backbone"]
        },
        "jquery-mobile": ["jquery", "libs/jquery/jquery.mobile.config-min"],
        "jclass": {
            "exports": "JClass"
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
        "jasmine-teamcity-reporter": {
            "deps": ["jasmine"],
            "exports": "TeamcityReporter"
        },
        "sinon": {
            "exports": "sinon"
        }
    },

    // the number of seconds to wait before timing out (0 disables the timeout)
    waitSeconds: 0
});

// Define all of the specs here.  These are RequireJS modules.

/***********************************************************************************************************
 * All require.config changes and specs added in this file need to also be applied to teamcitySpecRunner.js
 **********************************************************************************************************/

var specs = [
    // Views
    "spec/views/AboutViewSpec.js",
    "spec/views/AppViewSpec.js",
    "spec/views/ContactUsViewSpec.js",
    "spec/views/DriverListViewSpec.js",
    "spec/views/DriverSearchViewSpec.js",
    "spec/views/DriverViewSpec.js",
    "spec/views/FormViewSpec.js",
    "spec/views/HomeViewSpec.js",
    "spec/views/LoginViewSpec.js",
    "spec/views/UpdatePromptViewSpec.js",
    "spec/views/ValidationFormViewSpec.js",

    // Models
    "spec/models/AjaxModelSpec.js",
    "spec/models/AppModelSpec.js",
    "spec/models/CompanyModelSpec.js",
    "spec/models/ContactUsModelSpec.js",
    "spec/models/DepartmentModelSpec.js",
    "spec/models/DriverModelSpec.js",
    "spec/models/DriverSearchModelSpec.js",
    "spec/models/LoginModelSpec.js",
    "spec/models/UserModelSpec.js",

    // Collections
    "spec/collections/DepartmentCollectionSpec.js",
    "spec/collections/DriverCollectionSpec.js",

    // Controllers
    "spec/controllers/AboutControllerSpec.js",
    "spec/controllers/AppControllerSpec.js",
    "spec/controllers/ContactUsControllerSpec.js",
    "spec/controllers/DriverControllerSpec.js",
    "spec/controllers/HomeControllerSpec.js",
    "spec/controllers/LoginControllerSpec.js",
    "spec/controllers/UpdatePromptControllerSpec.js",

    // Routers
    "spec/routers/AppRouterSpec.js",

    // Subscribers
    "spec/subscribers/aboutSpec.js",
    "spec/subscribers/appSpec.js",
    "spec/subscribers/contactUsSpec.js",
    "spec/subscribers/driverSpec.js",
    "spec/subscribers/homeSpec.js",
    "spec/subscribers/loginSpec.js",
    "spec/subscribers/mainSpec.js",
    "spec/subscribers/updatePromptSpec.js",

    // Helpers
    "spec/helpers/facadeSpec.js",
    "spec/helpers/mediatorSpec.js",
    "spec/helpers/utilsSpec.js"
];

// Load Jasmine - This will still create all of the normal Jasmine browser globals unless "boot.js" is re-written to
// use the AMD or UMD specs. `boot.js` will do a bunch of configuration and attach it's initializers to
// "window.onload()".  Because we are using RequireJS "window.onload()" has already been triggered so we have to
// manually call it again. This will initialize the HTML Reporter and execute the environment.
require(["jquery-mobile", "jasmine-boot", "cordova"],
    function () {
        function onAppReady() {

            // Load the specs
            require(specs, function () {

                // Initialize the HTML Reporter and execute the environment (setup by "boot.js")
                window.onload();
            });
        }

        if (document.location.protocol === "file:") {
            document.addEventListener("deviceready", onAppReady, false);
        } else {
            onAppReady();
        }
    });

require(["jquery-mobile", "underscore", "jquery", "jasmine-html", "jasmine-teamcity-reporter", "jasmine-async",
         "sinon", "cordova"],
    function (jqueryMobile, _, $, jasmine) {
        var jasmineEnv = jasmine.getEnv(),
            trivialReporter = new jasmine.TrivialReporter(),
            teamcityReporter = new jasmine.TeamcityReporter(),
            specs = [],
            OnCompleteReporter = _.extend(function () {}, jasmine.Reporter);


        OnCompleteReporter.prototype.reportRunnerResults = function () {
            console.log("##jasmine.reportRunnerResults");
            phantom.exit();
        };

        jasmineEnv.addReporter(new OnCompleteReporter());
        jasmineEnv.addReporter(teamcityReporter);
        jasmineEnv.addReporter(trivialReporter);

        // Push all spec files here

        /***********************************************************************************************************
         * All require.config changes and specs added in this file need to also be applied to specRunner.js
         **********************************************************************************************************/

            // Views
        specs.push("spec/views/AboutViewSpec.js");
        specs.push("spec/views/AppViewSpec.js");
        specs.push("spec/views/ContactUsViewSpec.js");
        specs.push("spec/views/DriverListViewSpec.js");
        specs.push("spec/views/DriverSearchViewSpec.js");
        specs.push("spec/views/DriverViewSpec.js");
        specs.push("spec/views/FormViewSpec.js");
        specs.push("spec/views/HomeViewSpec.js");
        specs.push("spec/views/LoginViewSpec.js");
        specs.push("spec/views/UpdatePromptViewSpec.js");
        specs.push("spec/views/ValidationFormViewSpec.js");

        // Models
        specs.push("spec/models/AjaxModelSpec.js");
        specs.push("spec/models/AppModelSpec.js");
        specs.push("spec/models/CompanyModelSpec.js");
        specs.push("spec/models/ContactUsModelSpec.js");
        specs.push("spec/models/DepartmentModelSpec.js");
        specs.push("spec/models/DriverModelSpec.js");
        specs.push("spec/models/DriverSearchModelSpec.js");
        specs.push("spec/models/LoginModelSpec.js");
        specs.push("spec/models/UserModelSpec.js");

        // Collections
        specs.push("spec/collections/DepartmentCollectionSpec.js");
        specs.push("spec/collections/DriverCollectionSpec.js");

        // Controllers
        specs.push("spec/controllers/AboutControllerSpec.js");
        specs.push("spec/controllers/AppControllerSpec.js");
        specs.push("spec/controllers/ContactUsControllerSpec.js");
        specs.push("spec/controllers/DriverControllerSpec.js");
        specs.push("spec/controllers/HomeControllerSpec.js");
        specs.push("spec/controllers/LoginControllerSpec.js");
        specs.push("spec/controllers/UpdatePromptControllerSpec.js");

        // Routers
        specs.push("spec/routers/AppRouterSpec.js");

        // Subscribers
        specs.push("spec/subscribers/aboutSpec.js");
        specs.push("spec/subscribers/appSpec.js");
        specs.push("spec/subscribers/contactUsSpec.js");
        specs.push("spec/subscribers/driverSpec.js");
        specs.push("spec/subscribers/homeSpec.js");
        specs.push("spec/subscribers/loginSpec.js");
        specs.push("spec/subscribers/mainSpec.js");
        specs.push("spec/subscribers/updatePromptSpec.js");

        // Helpers
        specs.push("spec/helpers/facadeSpec.js");
        specs.push("spec/helpers/mediatorSpec.js");
        specs.push("spec/helpers/utilsSpec.js");

        $(function () {
            require(specs, function () {
                jasmineEnv.execute();
            });
        });
    });