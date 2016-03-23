(function () {
    "use strict";

    //this module contains all library/plugin dependencies for shared
    angular.module("app.shared.dependencies", [
        /* Angular and Ionic modules */
        "ionic",
        "ngAnimate",
        "base64",
        "ui.router",

        /* 3rd Party modules */
        "angularMoment",              // From https://github.com/urish/angular-moment
        "restangular",                // From https://github.com/mgonto/restangular
        "ngCordova",                  // From https://github.com/driftyco/ng-cordova
        "ngFitText",                  // From http://patrickmarabeas.github.io/ng-FitText.js/
        "ionic-datepicker",           // From https://github.com/markomarkovic/ionic-datepicker-widget
        "angAccordion",               // From https://github.com/sherwaniusman/angular-accordion
        "ngStorage",                  // From https://github.com/gsklee/ngStorage
        "chart.js",                   // From http://jtblin.github.io/angular-chart.js/
        "lokijs",                     // From https://github.com/techfort/LokiJS/
        "ngPromiseExtras",            // From https://github.com/ohjames/angular-promise-extras
        "ngIdle"                      // From https://github.com/HackedByChinese/ng-idle
    ]);
})();
