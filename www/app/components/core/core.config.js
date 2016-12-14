(function () {
    "use strict";

    var angularConfig = function ($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
    };

    var urlConfig = function ($urlRouterProvider, appGlobals) {
        // ensure active session for secure routes
        $urlRouterProvider.rule(function($injector, $location) {
            var AuthenticationManager = $injector.get( "AuthenticationManager" ),
                Navigation            = $injector.get( "Navigation" ),
                stateName             = $injector.get( "$state" ).current.name;

            // when navigating to any page that is secured, validate that the user is logged in
            if ( !Navigation.isUnsecuredState(stateName) ) {
                // user is not logged in and is trying to access secured content so redirect to the login page
                if ( !AuthenticationManager.userLoggedIn() ) {
                    return appGlobals.LOGIN_STATE;
                }
            }
        });

        // set default route
        $urlRouterProvider.otherwise( appGlobals.DEFAULT_ROUTE );
    };

    var ionicConfig = function ($ionicConfigProvider) {

        // clear the default text from the back button
        $ionicConfigProvider.backButton.text("");

        // do not show the title of the previous page
        $ionicConfigProvider.backButton.previousTitleText(false);

        // disable built-in ionic transitions
        $ionicConfigProvider.views.transition("none");

    };

    var ionicDatePickerConfig = function (ionicDatePickerProvider, sharedGlobals) {
        ionicDatePickerProvider.configDatePicker(sharedGlobals.DATE_PICKER);
    };

    var ngIdleConfig = function (appGlobals, IdleProvider) {
        //set the idle timeout length until the user is automatically logged out
        IdleProvider.idle(appGlobals.USER_IDLE_TIMEOUT);

        //disable user timeout warning response
        IdleProvider.timeout(false);
    };

    var ngStorageConfig = function ($localStorageProvider, appGlobals) {
        $localStorageProvider.setKeyPrefix(appGlobals.LOCALSTORAGE.CONFIG.keyPrefix);
    };

    angular
        .module("app.components.core")
        .config(angularConfig)
        .config(urlConfig)
        .config(ionicConfig)
        .config(ionicDatePickerConfig)
        .config(ngStorageConfig)
        .config(ngIdleConfig);
})();
