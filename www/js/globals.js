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
        "DRIVER_PATH"                  : "/driverMaintenance",
        "USER_AUTH_PATH"               : "/userAuth",
        "REQUEST_ERROR_TITLE"          : "Cannot complete request",
        "REQUEST_ERROR_UNKNOWN_MESSAGE": "Please try again",
        "REQUEST_ERROR_MESSAGE_PREFIX" : "<div class='ui-body ui-body-e'>",
        "REQUEST_ERROR_MESSAGE_SUFFIX" : "</div>"
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
    // Driver
    globals.WEBSERVICE.DRIVER = {
    };
    // Driver Add
    globals.WEBSERVICE.DRIVER.ADD = {
        "URL": globals.WEBSERVICE.SECURE.ROOT_URL + globals.WEBSERVICE.DRIVER_PATH + "/addDriver"
    };
    // Driver Reactivate
    globals.WEBSERVICE.DRIVER.REACTIVATE = {
        "URL": globals.WEBSERVICE.SECURE.ROOT_URL + globals.WEBSERVICE.DRIVER_PATH + "/reactivate"
    };
    // Driver Search
    globals.WEBSERVICE.DRIVER.SEARCH = {
        "URL": globals.WEBSERVICE.SECURE.ROOT_URL + globals.WEBSERVICE.DRIVER_PATH + "/search"
    };
    // Driver Terminate
    globals.WEBSERVICE.DRIVER.TERMINATE = {
        "URL": globals.WEBSERVICE.SECURE.ROOT_URL + globals.WEBSERVICE.DRIVER_PATH + "/terminate"
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
     * User Data
     */
    globals.userData = {};
    globals.userData.permissions = {
        "USER"                   : false,
        "MOBILE_CARD_VIEW"       : false,
        "MOBILE_CARD_EDIT"       : false,
        "MOBILE_CARD_ADD"        : false,
        "MOBILE_DRIVER_FULL_VIEW": false,
        "MOBILE_DRIVER_EDIT"     : false,
        "MOBILE_DRIVER_ADD"      : false,
        "MOBILE_PAYMENT_VIEW"    : false,
        "MOBILE_PAYMENT_MAKE"    : false
    };

    /**
     * Company Data
     */
    globals.companyData = {};
    globals.companyData.requiredFields = {
        "DRIVER_ID"             : false,
        "VIN_NUMBER"            : false,
        "LICENSE_PLATE_NUMBER"  : false,
        "VEHICLE_DESCRIPTION"   : false,
        "COMPANY_VEHICLE_NUMBER": false
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

    /**
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

    /**
     * Page :: Driver Search
     */
    globals.driverSearch = {};
    globals.driverSearch.constants = {
        "WEBSERVICE": globals.WEBSERVICE.DRIVER.SEARCH.URL,
        "DEFAULT_PAGE_NUMBER": 0,
        "DEFAULT_PAGE_SIZE": 25,
        "SHOW_ALL_PAGE_SIZE": 1000,
        "ALL": {
            id: "",
            name: "All"
        }
    };
    globals.driverSearch.configuration = {
        "filterFirstName": {
            "label"      : "First Name",
            "name"       : "filterFirstName",
            "placeholder": "",
            "value"      : ""
        },
        "filterLastName": {
            "label"      : "Last Name",
            "name"       : "filterLastName",
            "placeholder": "",
            "value"      : ""
        },
        "filterDriverId": {
            "label"      : "Driver ID",
            "name"       : "filterDriverId",
            "value"      : ""
        },
        "filterStatus": {
            "label"      : "Status",
            "name"       : "filterStatus",
            "values"     : [
                {
                    id: "",
                    name: "All"
                },
                {
                    id: "A",
                    name: "Active"
                },
                {
                    id: "T",
                    name: "Terminated"
                }
            ]
        },
        "filterDepartmentId": {
            "label"      : "Department",
            "name"       : "filterDepartmentId",
            "enabled"    : true,
            "values"     : [
                {
                    id: "",
                    name: "All"
                }
            ]
        },
        "submitButton": {
            "label": "Search"
        }
    };

    /**
     * Page :: Driver Search Results
     */
    globals.driverSearchResults = {};
    globals.driverSearchResults.constants = {
        "TOTAL_RESULTS_FORMAT"   : "Displaying {{numberDisplayed}} of {{totalResults}} results",
        "NO_RESULTS_MESSAGE"     : "No results found. Please try again.",
        "DRIVER_DETAILS_BASE_URL": "#driverDetails/"
    };
    globals.driverSearchResults.configuration = {
        "url": {
            "value": ""
        },
        "driverName": {
            "label": "Driver Name",
            "value": ""
        },
        "driverId": {
            "label": "Driver ID",
            "value": ""
        },
        "driverStatus": {
            "label": "Status",
            "value": ""
        },
        "driverDepartment": {
            "label": "Department",
            "value": ""
        },
        "totalResults": {
            "value": ""
        },
        "submitButton": {
            "label"  : "Show All Drivers",
            "visible": null
        }
    };

    /**
     * Page :: Driver Edit
     */
    globals.driverEdit = {};
    globals.driverEdit.constants = {
        "STATUS_CHANGE_SUCCESS_TITLE": "Driver Status Confirmation",
        "STATUS_ACTIVE": "ACTIVE",
        "STATUS_TERMINATED": "TERMINATED",
        "BUTTON_ACTIVATE": "ACTIVATE",
        "BUTTON_TERMINATE": "TERMINATE"
    };
    globals.driverEdit.configuration = {
        "driverName": {
            "label": "Driver Name",
            "value": ""
        },
        "driverId": {
            "label": "Driver ID",
            "value": ""
        },
        "driverDepartment": {
            "label": "Department",
            "value": ""
        },
        "driverStatus": {
            "label": "Status",
            "value": ""
        },
        "driverStatusDate": {
            "label": "Status Date",
            "value": ""
        },
        "submitButton": {
            "label": ""
        }
    };

    /**
     * Driver Reactivate
     */
    globals.driverReactivate = {};
    globals.driverReactivate.constants = {
        "WEBSERVICE": globals.WEBSERVICE.DRIVER.REACTIVATE.URL
    };

    /**
     * Driver Terminate
     */
    globals.driverTerminate = {};
    globals.driverTerminate.constants = {
        "WEBSERVICE": globals.WEBSERVICE.DRIVER.TERMINATE.URL,
        "SUCCESS_TITLE": "Driver Status Confirmation",
        "CONFIRMATION_TITLE": "Terminate<br/>Driver",
        "CONFIRMATION_MESSAGE": "Are you sure you want to terminate the driver?",
        "CANCEL_BTN_TEXT": "Cancel",
        "OK_BTN_TEXT": "Terminate"
    };

    /**
     * Driver Add
     */
    globals.driverAdd = {};
    globals.driverAdd.constants = {
        "WEBSERVICE"                          : globals.WEBSERVICE.DRIVER.ADD.URL,
        "DEFAULT_DEPARTMENT_NAME"             : "UNASSIGNED",
        "ERROR_FIRST_NAME_REQUIRED_FIELD"     : "First Name must have a value",
        "ERROR_FIRST_NAME_INVALID_LENGTH"     : "First Name cannot exceed 11 characters",
        "ERROR_FIRST_NAME_INVALID_CHARACTERS" : "First Name must contain only alphanumeric characters",
        "ERROR_LAST_NAME_REQUIRED_FIELD"      : "Last Name must have a value",
        "ERROR_LAST_NAME_INVALID_LENGTH"      : "Last Name cannot exceed 12 characters",
        "ERROR_LAST_NAME_INVALID_CHARACTERS"  : "Last Name must contain only alphanumeric characters",
        "ERROR_MIDDLE_NAME_INVALID_LENGTH"    : "Middle Name cannot exceed 1 character",
        "ERROR_MIDDLE_NAME_INVALID_CHARACTERS": "Middle Name must contain only alpha characters",
        "ERROR_DRIVER_ID_REQUIRED_FIELD"      : "Driver ID must have a value",
        "ERROR_DRIVER_ID_INVALID_FORMAT"      : "Driver ID must be numeric",
        "ERROR_DRIVER_ID_INVALID_LENGTH"      : "Driver ID must be {{driverIdLength}} digits",
        "DRIVER_ID_PLACEHOLDER_FORMAT"        : "Must be {{driverIdLength}} digits"
    };
    globals.driverAdd.configuration = {
        "firstName": {
            "label"      : "First Name",
            "name"       : "firstName",
            "maxLength"  : 11,
            "placeholder": "",
            "value"      : ""
        },
        "middleInitial": {
            "label"      : "Middle Initial",
            "name"       : "middleInitial",
            "maxLength"  : 1,
            "placeholder": "",
            "value"      : ""
        },
        "lastName": {
            "label"      : "Last Name",
            "name"       : "lastName",
            "maxLength"  : 12,
            "placeholder": "",
            "value"      : ""
        },
        "driverId": {
            "label"      : "Driver ID",
            "name"       : "driverId",
            "maxLength"  : 4,
            "placeholder": "",
            "value"      : ""
        },
        "departmentId": {
            "label"      : "Department",
            "name"       : "departmentId",
            "enabled"    : true,
            "values"     : []
        },
        "submitButton": {
            "label": "Add"
        }
    };

    globals.driverAddedDetails = {};
    globals.driverAddedDetails.constants = {
        "SUCCESS_TITLE": "Driver<br/>Confirmation",
        "STATUS_ACTIVE": "ACTIVE",
        "STATUS_TERMINATED": "TERMINATED",
        "BUTTON_ACTIVATE": "ACTIVATE",
        "BUTTON_TERMINATE": "TERMINATE"
    };
    globals.driverAddedDetails.configuration = {
        "driverName": {
            "label": "Driver Name",
            "value": ""
        },
        "driverId": {
            "label": "Driver ID",
            "value": ""
        },
        "driverDepartment": {
            "label": "Department",
            "value": ""
        },
        "driverStatus": {
            "label": "Status",
            "value": ""
        },
        "driverStatusDate": {
            "label": "Status Date",
            "value": ""
        }
    };

    return globals;
});
