define(["backbone", "globals", "utils", "facade"],
    function (Backbone, globals, utils, facade) {

        "use strict";


        var AjaxModel = Backbone.Model.extend({

            sync: function (method, model, options) {
                var self = this,
                    originalSync = Backbone.sync,
                    successCallback = options.success || function () { },
                    errorCallback = options.error || function () { },
                    beforeSendCallback = options.beforeSend || function () { },
                    modifiedOptions = utils._.clone(options),
                    errorMessage;

                // Set the beforeSend Callback for setting values in the Header of AJAX requests
                modifiedOptions.beforeSend = function (xhr) {
                    xhr.setRequestHeader("AJAX_CLIENT", 1);
                    xhr.setRequestHeader("Cache-Control", "no-cache"); // This is needed to prevent iOS 6 from caching
                                                                       // identical subsequent POST requests

                    beforeSendCallback(xhr);
                };

                // Clear out the success and error callbacks as we are going to handle them here instead
                modifiedOptions.success = null;
                modifiedOptions.error = null;

                // Call the original Backbone sync with the modified Options
                utils
                    .when(originalSync(method, model, modifiedOptions))
                    .done(function (data, textStatus, jqXHR) { // Handle the successful AJAX request

                        // the response was 200 OK but still indicates that it was not successful
                        if (!data.successFlag) {
                            errorMessage = self.getErrorMessage(data);

                            // Message the user with the appropriate Error message
                            if (data.message.type === "ERROR") {
                                facade.publish("app", "alert", {
                                    title          : globals.WEBSERVICE.REQUEST_ERROR_TITLE,
                                    message        : errorMessage,
                                    primaryBtnLabel: globals.DIALOG.DEFAULT_BTN_TEXT
                                });
                            }

                            errorCallback({
                                type: data.message.type,
                                message: errorMessage
                            });
                        }
                        // the response was successful
                        else {
                            if (utils._.size(data.data) === 1) {
                                successCallback(utils._.extend({}, utils.deepClone(data.data[0]), {
                                    message: data.message.text
                                }));
                            }
                            else {
                                successCallback({
                                    data: data.data,
                                    message: data.message.text
                                });
                            }
                        }

                    })
                    .fail(function (jqXHR, textStatus, errorThrown) { // Handle the failed AJAX request

                        facade.publish("app", "alert", {
                            title          : globals.WEBSERVICE.REQUEST_ERROR_TITLE,
                            message        : globals.WEBSERVICE.REQUEST_ERROR_UNKNOWN_MESSAGE,
                            primaryBtnLabel: globals.DIALOG.DEFAULT_BTN_TEXT
                        });

                        errorCallback();
                    });
            },

            getErrorMessage: function (data) {
                if (data) {
                    if (data.data) {
                        var errorMessage = globals.WEBSERVICE.REQUEST_ERROR_MESSAGE_PREFIX +
                            data.message.text +
                            globals.WEBSERVICE.REQUEST_ERROR_MESSAGE_SUFFIX;
                        errorMessage += "<ul>";
                        utils._.each(data.data, function (value) {
                            errorMessage += "<li>" + value.message + "</li>";
                        });
                        errorMessage += "</ul>";

                        return errorMessage;
                    }

                    if (data.message.text) {
                        return data.message.text;
                    }
                }

                return globals.WEBSERVICE.REQUEST_ERROR_UNKNOWN_MESSAGE;
            }
        });


        return AjaxModel;
    });
