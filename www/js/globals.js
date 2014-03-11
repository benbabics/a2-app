define(function (require) {

    "use strict";


    var globals;
    globals = {};

    /**
    * Webservices
    */
    globals.WEBSERVICE = {
        "ROOT_URL"                     : "@@@STRING_REPLACE_APP_URL@@@",
        "APP_PATH"                     : "/app",
        "USER_AUTH_PATH"               : "/userAuth",
        "REQUEST_ERROR_TITLE"          : "Cannot complete request",
        "REQUEST_ERROR_UNKNOWN_MESSAGE": "Please try again"
    };
    globals.WEBSERVICE.SECURE = {
        "ROOT_URL": globals.WEBSERVICE.ROOT_URL + "/secure"
    };
	// App Version Status
    globals.WEBSERVICE.APP_VERSION_STATUS = {
        "URL"           : globals.WEBSERVICE.ROOT_URL +
                          globals.WEBSERVICE.APP_PATH +
                          "/accountMaintenanceVersionStatus",
        "VERSION_NUMBER": "versionNumber=",
        "PLATFORM"      : "platform="
    };
    // User Login
    globals.WEBSERVICE.LOGIN = {
        "URL": globals.WEBSERVICE.ROOT_URL + globals.WEBSERVICE.USER_AUTH_PATH + "/login"
    };
    // User Logout
    globals.WEBSERVICE.LOGOUT = {
        "URL": globals.WEBSERVICE.ROOT_URL + globals.WEBSERVICE.USER_AUTH_PATH + "/logout"
    };
	// Contact Us
    globals.WEBSERVICE.CONTACT_US = {
        "URL": globals.WEBSERVICE.SECURE.ROOT_URL + "/contactUs"
    };

    /**
     * App
     */
    globals.APP = {
        "NAME"                            : "WEXonline",
        "EMAIL_ADDRESS_VALIDATION_PATTERN": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$",
        "ZIP_CODE_PATTERN"                : "/\\d{5}-\\d{4}|\\d{5}|[A-Z]\\d[A-Z] \\d[A-Z]\\d/"
    };

    globals.APP.constants = {
        "APP_VERSION_STATUS" : "appVersionStatus",
        "LAST_WARN_VERSION"  : "lastWarnVersion"
    };

    /**
     * Database
     */
    globals.DATABASE = {
        "DATABASE_NAME"        : "Database",
        "DATABASE_VERSION"     : "1.0",
        "DATABASE_DISPLAY_NAME": "wexonline",
        "TIMEOUT"              : 200000,
        "SUCCESS"              : "Database operation successful."
    };

    /**
     * Media Queries
     */
    globals.MEDIA_QUERY = {
        "MOBILE": "screen and (min-width: 320px)",
        "RETINA": "screen and (-webkit-min-device-pixel-ratio: 2)"
    };

    /**
     * Defaults
     */
    globals.DEFAULT = {
        "PAGE_TRANSITION": "none",
        "FILETYPE_NORMAL": ".png",
        "FILETYPE_RETINA": "@2x.png",
        "UNDEFINED"      : undefined,
        "EMPTY_STRING"   : ""
    };

    globals.DIALOG = {
        "ID"              : "popupDialog",
        "TITLE_ID"        : "title",
        "BODY_ID"         : "message",
        "PRIMARY_BTN_ID"  : "primary",
        "SECONDARY_BTN_ID": "secondary",
        "TERTIARY_BTN_ID" : "tertiary",
        "DEFAULT_MESSAGE" : "If you are seeing this, someone didn't set up this popup window correctly!",
        "DEFAULT_BTN_TEXT": "OK"
    };

    /**
     * Validation
     */
    globals.VALIDATION_ERRORS = {
        "TITLE" : "Cannot complete request",
        "HEADER": "<div class='ui-body ui-body-e'>The following fields are required:</div>"
    };

    /**
     * Update the App
     */
    globals.UPDATE_APP = {
        "TITLE"              : "Update Available",
        "FAIL_MESSAGE"       : "A new version of WEXonline is available. Please update to continue using WEXonline.",
        "WARN_MESSAGE"       : "A new version of WEXonline is available. Please update.",
        "URL"                : "@@@STRING_REPLACE_APP_STORE_URL@@@",
        "PRIMARY_BTN_LABEL"  : "Update",
        "SECONDARY_BTN_LABEL": "Not Now"
    };

    /**
     * Page :: Login
     */
    globals.login = {};
    globals.login.constants = {
        "WEBSERVICE"                   : globals.WEBSERVICE.LOGIN.URL,
        "ERROR_USERNAME_REQUIRED_FIELD": "Username must have a value",
        "ERROR_PASSWORD_REQUIRED_FIELD": "Password must have a value"
    };
    globals.login.configuration = {
        "userName": {
            "label"      : "Username",
            "name"       : "userName",
            "placeholder": "",
            "value"      : ""
        },
        "password": {
            "label"      : "Password",
            "name"       : "password",
            "placeholder": "",
            "value"      : ""
        },
        "submitButton": {
            "label": "Login"
        }
    };

    /*
     * Page :: Contact Us
     */
    globals.contactUs = {};
    globals.contactUs.constants = {
        "WEBSERVICE"                  : globals.WEBSERVICE.CONTACT_US.URL + "/emailRequest",
        "ERROR_SENDER_REQUIRED_FIELD" : "Email must have a value",
        "ERROR_SUBJECT_REQUIRED_FIELD": "Subject must have a value",
        "ERROR_MESSAGE_REQUIRED_FIELD": "Message must have a value",
        "SUCCESS_TITLE": "Message Sent"
    };
    globals.contactUs.configuration = {
        "sender": {
            "label"      : "Email",
            "name"       : "sender",
            "maxLength"  : 60,
            "placeholder": "",
            "value"      : ""
        },
        "subject": {
            "label"      : "Subject",
            "name"       : "subject",
            "placeholder": "",
            "value"      : ""
        },
        "message": {
            "label"      : "Message",
            "name"       : "message",
            "maxLength"  : 1024,
            "placeholder": "",
            "value"      : ""
        },
        "submitButton": {
            "label": "Submit"
        }
    };

    return globals;
});
