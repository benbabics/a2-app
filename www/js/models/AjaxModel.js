define(["backbone", "globals", "utils", "facade"],
    function (Backbone, globals, utils, facade) {

        "use strict";


        var AjaxModel = Backbone.Model.extend({

            sync: function (method, model, options) {
                var successCallback = options.success || function () { },
                    errorCallback = options.error || function () { },
                    beforeSendCallback = options.beforeSend || function () { };

                // Set the Success Callback for AJAX requests
                options.success = function (data, textStatus, jqXHR) {

                    // the response was 200 OK but still indicates that it was not successful
                    if (!data.successFlag) {

                        // Message the user with the appropriate Error message
                        if (data.message.type === "ERROR") {
                            if (data.message.text) {
                                facade.publish("app", "alert", {
                                    title          : globals.WEBSERVICE.REQUEST_ERROR_TITLE,
                                    message        : data.message.text,
                                    primaryBtnLabel: globals.DIALOG.DEFAULT_BTN_TEXT
                                });
                            }
                            else {
                                facade.publish("app", "alert", {
                                    title          : globals.WEBSERVICE.REQUEST_ERROR_TITLE,
                                    message        : globals.WEBSERVICE.REQUEST_ERROR_UNKNOWN_MESSAGE,
                                    primaryBtnLabel: globals.DIALOG.DEFAULT_BTN_TEXT
                                });
                            }
                        }

                        errorCallback.call(this, model, jqXHR, options);
                    }
                    // the response was successful
                    else {
                        successCallback.call(this, model, data, options);
                    }
                };

                // Set the Error Callback for AJAX requests
                options.error = function (jqXHR, textStatus, errorThrown) {
                    facade.publish("app", "alert", {
                        title          : globals.WEBSERVICE.REQUEST_ERROR_TITLE,
                        message        : globals.WEBSERVICE.REQUEST_ERROR_UNKNOWN_MESSAGE,
                        primaryBtnLabel: globals.DIALOG.DEFAULT_BTN_TEXT
                    });

                    errorCallback.call(this, model, jqXHR, options);
                };

                // Set the beforeSend Callback for setting values in the Header of AJAX requests
                options.beforeSend = function (xhr) {
                    xhr.setRequestHeader("AJAX_CLIENT", 1);
                    xhr.setRequestHeader("Cache-Control", "no-cache"); // This is needed to prevent iOS 6 from caching
                                                                       // identical subsequent POST requests

                    beforeSendCallback.call(this, xhr);
                };

                AjaxModel.__super__.sync.apply(this, arguments);
            }
        });


        return AjaxModel;
    });
