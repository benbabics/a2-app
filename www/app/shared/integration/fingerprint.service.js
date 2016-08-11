/**
 * This service provides a common API to use iOS TouchID and Android Fingerprint authentication.
 */
(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function FingerprintService(_, $q, globals, PlatformUtil, SecureStorage) {
        //Private members:
        var CONSTANTS = globals.FINGERPRINT_AUTH,
            NOT_SUPPORTED_ERROR = "Fingerprint authentication is not available on this platform.",
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
            return $q.when(isSupportedPlatform())
                .then(_.partial(doPluginCommand, "isAvailable"));
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
                        promise = SecureStorage.set(options.clientId, clientSecret);
                    }
                    else {
                        promise = SecureStorage.get(options.clientId);
                    }

                    //return the authentication response with the client secret
                    return promise.then(function (response) {
                        return _.extend({clientSecret: isRegistering ? clientSecret : response}, authResponse);
                    });
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

                    if (_.isEmpty(commandFuncMapping)) {
                        throw new Error("Unrecognized plugin command: " + command);
                    }

                    //get the plugin function for the command and the relevant parameters
                    commandFunc = _.isFunction(commandFuncMapping) ? commandFuncMapping : fingerprint[commandFuncMapping];
                    commandParams = getPluginCommandParams(command, options).concat([deferred.resolve, deferred.reject]);

                    //call the plugin function with the params
                    commandFunc.apply(commandFunc, commandParams);
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
                    configObject.disableBackup = _.get(options, "passwordFallback") !== CONSTANTS.PASSWORD_FALLBACK.DEFAULT;

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
                commonPluginMappings = getCommonPluginMappings();
            });
        }

        function isSupportedPlatform() {
            return (platform === PLATFORM_ANDROID || platform === PLATFORM_IOS);
        }
    }

    angular
        .module("app.shared.integration")
        .factory("Fingerprint", FingerprintService);
})();
