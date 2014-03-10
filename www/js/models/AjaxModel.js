define(["backbone", "globals", "utils", "facade"],
    function (Backbone, globals, utils, facade) {

        "use strict";


        var AjaxModel = Backbone.Model.extend({

            sync: function (method, model, options) {
                var successCallback = options.success || function () { },
                    errorCallback = options.error || function () { },
                    beforeSendCallback = options.beforeSend || function () { },
                    modifiedOptions = utils._.clone(options);

                // Set the Success Callback for AJAX requests
                modifiedOptions.success = function (data, textStatus, jqXHR) {

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

                        errorCallback();
                    }
                    // the response was successful
                    else {
                        successCallback(data);
                    }
                };

                // Set the Error Callback for AJAX requests
                modifiedOptions.error = function (jqXHR, textStatus, errorThrown) {
                    facade.publish("app", "alert", {
                        title          : globals.WEBSERVICE.REQUEST_ERROR_TITLE,
                        message        : globals.WEBSERVICE.REQUEST_ERROR_UNKNOWN_MESSAGE,
                        primaryBtnLabel: globals.DIALOG.DEFAULT_BTN_TEXT
                    });

                    errorCallback();
                };

                // Set the beforeSend Callback for setting values in the Header of AJAX requests
                modifiedOptions.beforeSend = function (xhr) {
                    xhr.setRequestHeader("AJAX_CLIENT", 1);
                    xhr.setRequestHeader("Cache-Control", "no-cache"); // This is needed to prevent iOS 6 from caching
                                                                       // identical subsequent POST requests

                    beforeSendCallback(xhr);
                };

                AjaxModel.__super__.sync.apply(this, [method, model, modifiedOptions]);
            }
        });


        return AjaxModel;
    });
