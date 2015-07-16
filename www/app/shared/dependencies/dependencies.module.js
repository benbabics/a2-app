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
        "ngFitText"                   // From http://patrickmarabeas.github.io/ng-FitText.js/
    ]);
})();
