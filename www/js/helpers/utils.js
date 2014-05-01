define(["jquery", "underscore", "globals", "backbone", "jquery-mobile"],
    function ($, _, globals, Backbone) {

        "use strict";


        var utils = {};

        /*
         * jQuery convenience method
        */
        utils.$ = $;

        /*
         * Underscore convenience method
        */
        utils._ = _;

        /*
         * Backbone convenience method
        */
        utils.Backbone = Backbone;

        /*
         * Array Slice convenience method
        */
        utils.__slice = [].slice;

        /*
         * Object Has Property convenience method
        */
        utils.__hasProp = {}.hasOwnProperty;

        /*
         * Trim Text Helper Method
        */
        utils.trim = utils.$.trim;

        /*
         * inArray Helper Method
        */
        utils.inArray = utils.$.inArray;

        /*
         * Is Function Helper Method
        */
        utils.isFn = utils.isFunction = utils.$.isFunction;

        /*
         * Is Plain Object Helper Method
        */
        utils.isPlainObject = utils.$.isPlainObject;

        /*
         * GET JSON Helper Method
        */
        utils.getJSON = utils.$.getJSON;

        /*
         * POST Ajax Helper Method
        */
        utils.post = utils.$.post;

        /*
         * Deferred Helper Method
        */
        utils.Deferred = utils.$.Deferred;

        /*
         * Deferred When Helper Method
        */
        utils.when = utils.$.when;

        /*
         * Is Mobile
        */
        utils.isMobile = utils.$.mobile.media(globals.MEDIA_QUERY.MOBILE);

        /*
         * Is Retina
        */
        utils.isRetina = utils.isMobile && utils.$.mobile.media(globals.MEDIA_QUERY.RETINA);

        /*
         * FileType
        */
        utils.fileType = globals.DEFAULT["FILETYPE_" + (utils.isRetina ? "RETINA" : "NORMAL")];

        /*
         * Extend Classes
        */
        utils.extend = function (child, parent) {
            for (var key in parent) {
                if ( this.__hasProp.call(parent, key) ) {
                    child[key] = parent[key];
                }
            }

            function Ctor() {
                this.constructor = child;
            }
            Ctor.prototype = parent.prototype;

            child.prototype = new Ctor();
            child.__super__ = parent.prototype;

            return child;
        };

        /*
         * Deep copy an object.  When more than one object is supplied the
         * objects are merged together.
         *
         * @param obj1 object from which to make a deep copy
         * @param objN additional objects containing properties to merge in
         * @returns {Object} the deep copy of the object(s)
         */
        utils.deepClone = function (obj) {
            if (arguments.length > 1) {
                return $.extend(true, {}, arguments);
            } else {
                return $.extend(true, {}, obj);
            }
        };

        /*
         * Converts a list of values into an object of the format used
         * for the globals.<page>.configuration objects
         *
         * @param values a list of values
         * @returns {Object} a configuration formatted object
         */
        utils.convertToConfigurationObject = function (values) {
            return utils._.map(values,
                function (value) {
                    return {
                        "label": value,
                        "value": value
                    };
                }
            );
        };

        /*
         * Lowercase first character of string
         *
         * @param : string
         * @return: string
        */
        utils.uncapitalize = function (str) {
            return str.replace(/^[A-Z]/, function(m) {
                return m.toLowerCase();
            });
        };

        /*
         * CamelCase object keys
         *
         * @param : object
         * @return: object
        */
        utils.camelcaseKeys = function (attributes) {
            return utils._.object(
                utils._.map(utils._.keys(attributes), utils.uncapitalize),
                utils._.values(attributes)
            );
        };

        /*
         * Backbone.history() convenience method
        */
        utils.navigate = function (viewId) {
            Backbone.history.navigate(viewId, true);
        };

        /*
         * Convenience method for accessing $mobile.changePage(), included in case any other actions are required in the same step.
         *
         * @param - changeTo  : (String) Absolute or relative URL. In this app references to "#index", "#search" etc.
         * @param - effect    : (String) One of the supported jQuery mobile transition effects
         * @param - direction : (Boolean) Decides the direction the transition will run when showing the page
         * @param - updateHash: (Boolean) Decides if the hash in the location bar should be updated
        */
        utils.changePage = function (viewID, effect, direction, updateHash) {
            if (effect === undefined || effect === null) {
                effect = globals.DEFAULT.PAGE_TRANSITION;
            }
            if (direction === undefined || direction === null) {
                direction = false;
            }
            if (updateHash === undefined) {
                updateHash = false;
            }

            utils.$(function() {
                if(updateHash){
                    window.location.hash = viewID.attr ? viewID.attr("id") : viewID; // TODO: messy fix to force viewID hash change in url, since JQM 1.3.1 doesn't seem to
                                                                                     //always update hash when asked.
                }

                utils.$.mobile.changePage(viewID, {
                    transition: effect,
                    reverse   : direction,
                    changeHash: updateHash
                });

            });
        };

        /**
         * Function to determine if the device has a data connection
         *
         * @returns {boolean} true if there is a connection, false otherwise
         */
        utils.hasNetworkConnection = function () {
            if (navigator && navigator.connection) {
                var networkState = navigator.connection.type;
                return Connection.NONE !== networkState;
            }
            else {
                return true;
            }
        };

        /**
         * Function to determine if the page id is the active page
         *
         * @param pageId the id of the page to check for being active
         * @returns {boolean} true if the page is active, false otherwise
         */
        utils.isActivePage = function (pageId) {
            if (utils.$.mobile.activePage === undefined || utils.$.mobile.activePage === null) {
                return false;
            }

            return pageId === utils.$.mobile.activePage.attr("id");
        };

        /*
         * Function to validate Email Address format
         *
         * @param (String) emailAddress The Email Address to validate for formatting
         * @return (Boolean) True or False as to whether the Email Address is valid
         */
        utils.isEmailAddressValid = function (emailAddress) {
            var pattern = new RegExp(globals.APP.EMAIL_ADDRESS_VALIDATION_PATTERN);
            return pattern.test(emailAddress);
        };

        /*
         * Function to determine if an address is a P.O.Box
         *
         * @param (String) address The Address to check
         * @return (Boolean) True or False as to whether the Address is a P.O. Box
         */
        utils.isPOBox = function (address) {
            if (address) {
                var pattern = new RegExp(globals.APP.POBOX_PATTERN, "i");
                return pattern.test(address);
            }

            return false;
        };

        /**
         * Function to add hours to the provided date
         *
         * @param startingDate the date to add hours to
         * @param hoursToAdd the number of hours to add
         * @returns {Date} the date that results from the addition
         */
        utils.addHours = function (startingDate, hoursToAdd) {
            var copiedDate = new Date(startingDate.getTime());
            copiedDate.setTime(copiedDate.getTime() + (hoursToAdd * 60 * 60 * 1000));
            return copiedDate;
        };

        /**
         * Function to add minutes to the provided date
         *
         * @param startingDate the date to add minutes to
         * @param minutesToAdd the number of minutes to add
         * @returns {Date} the date that results from the addition
         */
        utils.addMinutes = function (startingDate, minutesToAdd) {
            var copiedDate = new Date(startingDate.getTime());
            copiedDate.setTime(copiedDate.getTime() + (minutesToAdd * 60 * 1000));
            return copiedDate;
        };

        /**
         * Funciton to format the provided number as currency
         * @param number the number to format as currency
         * @returns {string} the number formatted as currency
         */
        utils.formatCurrency = function(number) {
            if (number) {
                return "$" + number.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            }
        };

        /**
         * Function to fetch a collection wrapped up as a promise
         *
         * @param collection to fetch
         * @param data the information to pass to collection.fetch()
         * @returns a promise
         */
        utils.fetchCollection = function (collection, data) {
            var deferred = utils.Deferred();

            collection
                .once("sync",
                    function () {
                        deferred.resolve();
                    },
                    this)
                .once("error",
                    function () {
                        deferred.reject();
                    },
                    this)
                .fetch(data); // fetch new data with supplied params

            return deferred.promise();
        };

        return utils;
    });
