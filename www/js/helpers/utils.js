define(["jquery", "underscore", "globals", "backbone", "moment", "moment-timezone", "moment-timezone-data", "jquery-mobile"],
    function ($, _, globals, Backbone, moment) {

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
         * Moment convenience method
         */
        utils.moment = moment;

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
         * Navigator
         */
        utils.navigator = navigator;

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
                return $.extend.apply(utils, utils._.union([true, {}], arguments));
            }

            return $.extend(true, {}, obj);
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
                });
        };

        /*
         * Backbone.history() convenience method
        */
        utils.navigate = function (viewId) {
            Backbone.history.navigate(viewId, true);
        };

        /*
         * Convenience method for accessing $mobile.changePage(), included in case any other actions are required in
         * the same step.
         *
         * @param - changeTo  : (String) Absolute or relative URL. In this app references to "#index", "#search" etc.
         * @param - effect    : (String) One of the supported jQuery mobile transition effects
         * @param - direction : (Boolean) Decides the direction the transition will run when showing the page
         * @param - updateHash: (Boolean) Decides if the hash in the location bar should be updated
        */
        utils.changePage = function (viewID, effect, direction, updateHash) {
            if (!effect) {
                effect = globals.DEFAULT.PAGE_TRANSITION;
            }
            if (!direction) {
                direction = false;
            }
            if (!updateHash) {
                updateHash = false;
            }

            utils.$(function () {
                if (updateHash) {
                    // TODO: messy fix to force viewID hash change in url, since JQM 1.4.1 doesn't seem to
                    // always update hash when asked.
                    window.location.hash = viewID.attr ? viewID.attr("id") : viewID;
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
            if (utils.navigator && utils.navigator.connection) {
                var networkState = utils.navigator.connection.type;
                return Connection.NONE !== networkState;
            }

            return true;
        };

        /**
         * Function to determine if the page id is the active page
         *
         * @param pageId the id of the page to check for being active
         * @returns {boolean} true if the page is active, false otherwise
         */
        utils.isActivePage = function (pageId) {
            if (!utils.$.mobile.activePage) {
                return false;
            }

            return pageId === utils.$.mobile.activePage.attr("id");
        };

        /**
         * Function to validate Email Address format
         *
         * @param emailAddress (String) The Email Address to validate for formatting
         * @return (Boolean) True or False as to whether the Email Address is valid
         */
        utils.isEmailAddressValid = function (emailAddress) {
            var pattern = new RegExp(globals.APP.EMAIL_ADDRESS_VALIDATION_PATTERN, "i");
            return pattern.test(emailAddress);
        };

        /**
         * Function to determine if an address is a P.O.Box
         *
         * @param address (String) address The Address to check
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
         * Function to format the provided number as currency
         * @param number the number to format as currency
         * @returns {string} the number formatted as currency
         */
        utils.formatCurrency = function (number) {
            if (number) {
                return "$" + number.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            }
        };

        return utils;
    });
