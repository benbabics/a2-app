if (window.navigator === undefined) {
    window.navigator = { };
}

setTimeout(function () {
    var event = new Event("deviceready");
    document.dispatchEvent(event);
}, 2000);

if (window.cordova === undefined) {
    window.cordova = {
        exec: function (success, fail, className, methodName, paras) {
            if (success !== null) {
                success();
            }
        }
    };
}

// Splash screen plugin
navigator.splashscreen = {
    hide: function () { },
    show: function () { }
};

// Device plugin
device = {
    available: false,
    platform: "Mock Platform",
    version : "Mock Platform Version",
    uuid    : "Mock Device Id",
    cordova : null,
    model   : null,
    getInfo : function (successCallback, errorCallback) { }
};

// Network Information plugin
navigator.connection = {
    onLine: true,
    getInfo: function (successCallback, errorCallback) { }
};

navigator.network = { };

navigator.network.connection = navigator.connection;

Connection = {
    UNKNOWN : "unknown",
    ETHERNET: "ethernet",
    WIFI    : "wifi",
    CELL_2G : "2g",
    CELL_3G : "3g",
    CELL_4G : "4g",
    CELL    : "cellular",
    NONE    : "none"
};

// Status Bar plugin
window.StatusBar = {
    overlaysWebView           : function (doOverlay) { },
    styleDefault              : function () { },
    styleLightContent         : function () { },
    styleBlackTranslucent     : function () { },
    styleBlackOpaque          : function () { },
    backgroundColorByName     : function (colorname) { },
    backgroundColorByHexString: function (hexString) { },
    hide                      : function () { },
    show                      : function () { },
    isVisible                 : true
};

// Application Info plugin
ApplicationInfo = {
    getBuildVersion: function (successCallback) { }
};
