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
    waitSeconds: 0
});


// Load Jasmine - This will still create all of the normal Jasmine browser globals unless "boot.js" is re-written to
// use the AMD or UMD specs. `boot.js` will do a bunch of configuration and attach it's initializers to
// "window.onload()".  Because we are using RequireJS "window.onload()" has already been triggered so we have to
// manually call it again. This will initialize the HTML Reporter and execute the environment.
require(["jquery-mobile", "jasmine-boot", "cordova"],
    function () {
        function onAppReady() {

            // Load the specs
            require(specList, // From specList.js
                function () {

                    // Initialize the HTML Reporter and execute the environment (setup by "boot.js")
                    window.onload();
                }
            );
        }

        if (document.location.protocol === "file:") {
            document.addEventListener("deviceready", onAppReady, false);
        } else {
            onAppReady();
        }
    });
