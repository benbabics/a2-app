/**
 * This service provides a common API to use iOS TouchID and Android Fingerprint authentication.
 */
(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function FingerprintService(_, $q, globals, FingerprintProfileUtil, PlatformUtil, SecureStorage) {
        //Private members:
        var CONSTANTS = globals.FINGERPRINT_AUTH,
            NOT_SUPPORTED_ERROR = "Fingerprint authentication is not available on this platform.",
            ANDROID_USER_CANCELED = "Cancelled",
            ANDROID_EXCEEDED_ATTEMPTS = "Too many attempts. Try again later.",
            IOS_EXCEEDED_ATTEMPTS = -1,
            IOS_USER_CANCELED = -2,
            IOS_PASSCODE_NOT_SET = -5,
            IOS_TOUCH_ID_NOT_AVAILABLE = -6,
            IOS_TOUCH_ID_NOT_ENROLLED = -7,
            IOS_GENERIC_ERROR = -128, // Returned by Touch ID plugin when the user cancels the fingerprint prompt.
            PLATFORM_ANDROID = "android",
            PLATFORM_IOS = "ios",
            platform,
            commonPluginMappings,
            commonPluginMappingsAndroid = {
                didFingerprintDatabaseChange: _.constant(false),
                isAvailable                 : "isAvailable",
                verify                      : "show"
            },
            commonPluginMappingsIos = {
                didFingerprintDatabaseChange               : "didFingerprintDatabaseChange",
                isAvailable                                : "isAvailable",
                verify                                     : "verifyFingerprint",
                verifyFingerprintWithCustomPasswordFallback: "verifyFingerprintWithCustomPasswordFallback"
            };

        var fingerprint = {
            didFingerprintDatabaseChange: _.partial(doPluginCommand, "didFingerprintDatabaseChange"),
            isAvailable                 : isAvailable,
            verify                      : verify
        };

        init();

        return fingerprint;

        //Public functions:
        function isAvailable() {
            return isSupportedPlatform()
                .then(SecureStorage.isAvailable)
                .then(_.partial(doPluginCommand, "isAvailable"))
                .catch(function (availabilityDetails) {
                    var options = {
                        isDeviceSupported: false,
                        isSetup          : false
                    };

                    if (platform === PLATFORM_IOS && _.has(availabilityDetails, "code")) {
                        options.isDeviceSupported = !_.includes([
                            IOS_TOUCH_ID_NOT_AVAILABLE
                        ], availabilityDetails.code);

                        options.isSetup = options.isDeviceSupported && !_.includes([
                            IOS_PASSCODE_NOT_SET,
                            IOS_TOUCH_ID_NOT_ENROLLED
                        ], availabilityDetails.code);
                    }

                    return $q.reject(options);
                })
                .then(function (availabilityDetails) {
                    //perform additional checks on Android to determine if auth is available
                    if (platform !== PLATFORM_ANDROID || _.get(availabilityDetails, "isAvailable", true)) {
                        return availabilityDetails;
                    }
                    else {
                        //fingerprint auth not available
                        return $q.reject({
                            isDeviceSupported: _.get(availabilityDetails, "isHardwareDetected", false),
                            isSetup          : _.get(availabilityDetails, "hasEnrolledFingerprints", false)
                        });
                    }
                });
        }

        function verify(options) {
            var command = "verify";

            if (_.isNil(_.get(options, "clientId"))) {
                return $q.reject(new Error("'clientId' is required for fingerprint verification."));
            }

            if (platform === PLATFORM_IOS) {
                //use a custom password fallback prompt (iOS only)
                if (_.get(options, "passwordFallback") === CONSTANTS.PASSWORD_FALLBACK.CUSTOM) {
                    command = "verifyFingerprintWithCustomPasswordFallback";
                }
            }

            //do fingerprint authentication
            return doPluginCommand(command, options)
                .then(function (authResponse) {
                    var clientSecret = _.get(options, "clientSecret"),
                        isRegistering = !_.isNil(clientSecret),
                        promise;

                    //set/get the client id and secret in secure storage
                    if (isRegistering) {
                        promise = FingerprintProfileUtil.setProfile(options.clientId, clientSecret);
                    }
                    else {
                        promise = FingerprintProfileUtil.getProfile(options.clientId);
                    }

                    //return the authentication response with the client secret
                    return promise.then(function (response) {
                        return _.extend(response, authResponse);
                    });
                })
                .catch(function (error) {
                    var errorResult = {
                        exceededAttempts: false,
                        userCanceled: false,
                        data: error
                    };

                    if (platform === PLATFORM_ANDROID) {
                        errorResult.exceededAttempts = (error === ANDROID_EXCEEDED_ATTEMPTS);
                        errorResult.userCanceled = (error === ANDROID_USER_CANCELED);
                    }
                    else if (platform === PLATFORM_IOS) {
                        errorResult.exceededAttempts = (error.code === IOS_EXCEEDED_ATTEMPTS);
                        errorResult.userCanceled = (error.code === IOS_USER_CANCELED || error.code === IOS_GENERIC_ERROR);
                    }

                    return $q.reject(errorResult);
                });
        }

        //Private functions:
        function doPluginCommand(command, options) {
            var deferred = $q.defer();

            PlatformUtil.waitForCordovaPlatform()
                .then(getPlugin)
                .then(function (fingerprint) {
                    var commandFunc,
                        commandParams,
                        commandFuncMapping = commonPluginMappings[command];

                    //get the plugin function for the command and the relevant parameters
                    if (_.isFunction(commandFuncMapping)) {
                        return deferred.resolve(commandFuncMapping());
                    }
                    else {
                        if (_.isEmpty(commandFuncMapping)) {
                            throw new Error("Unrecognized plugin command: " + command);
                        }

                        commandFunc = fingerprint[commandFuncMapping];
                        commandParams = getPluginCommandParams(command, options).concat([deferred.resolve, deferred.reject]);

                        //call the plugin function with the params
                        commandFunc.apply(commandFunc, commandParams);
                    }
                });

            return deferred.promise;
        }

        function getCommonPluginMappings() {
            switch (platform) {
                case PLATFORM_ANDROID:
                    return commonPluginMappingsAndroid;
                case PLATFORM_IOS:
                    return commonPluginMappingsIos;
                default:
                    throw new Error(NOT_SUPPORTED_ERROR);
            }
        }

        function getPlugin() {
            switch (platform) {
                case PLATFORM_ANDROID:
                    return window.FingerprintAuth;
                case PLATFORM_IOS:
                    return window.plugins.touchid;
                default:
                    throw new Error(NOT_SUPPORTED_ERROR);
            }
        }

        function getPluginCommandParams(command, options) {
            switch (platform) {
                case PLATFORM_ANDROID:
                    return getPluginCommandParamsAndroid(command, options);
                case PLATFORM_IOS:
                    return getPluginCommandParamsIos(command, options);
                default:
                    return [];
            }
        }

        function getPluginCommandParamsAndroid(command, options) {
            switch (command) {
                case "verify":
                    //get Android-specific config options
                    var configObject = _.pick(options, [
                        "clientId",
                        "clientSecret",
                        "locale"
                    ]);

                    //Note - Android plugin always requires a clientSecret
                    _.set(configObject, "clientSecret", _.get(configObject, "clientSecret", configObject.clientId));

                    //only enable fallback password if DEFAULT is specified
                    configObject.disableBackup = _.get(options, "passwordFallback", CONSTANTS.PASSWORD_FALLBACK.DEFAULT) !== CONSTANTS.PASSWORD_FALLBACK.DEFAULT;

                    return [configObject];
                default:
                    return [];
            }
        }

        function getPluginCommandParamsIos(command, options) {
            switch (command) {
                case "verify":
                case "verifyFingerprintWithCustomPasswordFallback":
                    return [_.get(options, "message", CONSTANTS.CONFIG.defaultMessage)];
                default:
                    return [];
            }
        }

        function init() {
            PlatformUtil.waitForCordovaPlatform(function () {
                platform = _.toLower(PlatformUtil.getPlatform());

                isSupportedPlatform().then(function () {
                    commonPluginMappings = getCommonPluginMappings();
                });
            });
        }

        function isSupportedPlatform() {
            return PlatformUtil.waitForCordovaPlatform(function () {
                return (platform === PLATFORM_ANDROID || platform === PLATFORM_IOS) ? $q.resolve() : $q.reject("Unsupported platform.");
            });
        }
    }

    angular
        .module("app.shared.integration.fingerprint")
        .factory("Fingerprint", FingerprintService);
})();
