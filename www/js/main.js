"use strict";


require.config({
    paths: {
        // RequireJS Plugins
        "text" : "libs/require/text-min",
        "async": "libs/require/async-min",

        // Frameworks
        "cordova"                 : "../cordova",
        "mustache"                : "libs/mustache/mustache-min",
        "backbone"                : "libs/backbone/backbone-min",
        "backbone-validation"     : "libs/backbone/backbone-validation-amd-min",
        "underscore"              : "libs/underscore/underscore-min",
        "jquery"                  : "libs/jquery/jquery-min",
        "jquery-ui-core"          : "libs/jquery/jquery.ui.core-min",
        "jquery-ui-datepicker"    : "libs/jquery/jquery.ui.datepicker-min",
        "jquery-mobile"           : "libs/jquery/jquery.mobile-min",
        "jquery-mobile-datepicker": "libs/jquery/jquery.mobile.datepicker-min",
        "jclass"                  : "libs/jclass/jclass-min",
        "moment"                  : "libs/moment/moment-min",
        "moment-timezone"         : "libs/moment/moment-timezone-min",
        "moment-timezone-data"    : "libs/moment/moment-timezone-data",

        // Helpers
        "utils"   : "helpers/utils",
        "facade"  : "helpers/facade",

        // Directories
        "tmpl": "templates"
    },

    //Remember: only use shim config for non-AMD scripts,
    //scripts that do not already call define(). The shim
    //config will not work correctly if used on AMD scripts,
    //in particular, the exports and init config will not
    //be triggered, and the deps config will be confusing
    //for those cases.
    shim: {
        "backbone": {
            "deps"   : ["underscore", "jquery", "mustache"],
            "exports": "Backbone"
        },
        "jquery-mobile": ["jquery", "libs/jquery/jquery.mobile.config-min"],
        "jquery-ui-core": {
            "deps"   : ["jquery"]
        },
        "jquery-ui-datepicker": {
            "deps"   : ["jquery-ui-core"]
        },
        "jquery-mobile-datepicker": {
            "deps"   : ["jquery-mobile", "jquery-ui-datepicker"]
        },
        "jclass": {
            "exports": "JClass"
        },
        "moment": {
            "exports": "moment"
        }
    },

    // the number of seconds to wait before timing out (0 disables the timeout)
    waitSeconds: 0,

    // prevents moment from creating a moment global
    noGlobal: true
});

require(["facade", "subscribers/main", "jquery-mobile", "jquery-mobile-datepicker", "cordova"],
    function (facade) {

        function onAppReady() {
            facade.publish("app", "ready");
        }

        if (document.location.protocol === "file:") {
            document.addEventListener("deviceready", onAppReady, false);
        } else {
            onAppReady();
        }
    });
