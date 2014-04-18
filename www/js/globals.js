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
        "ACCOUNTS_PATH"                : "/accounts",
        "AUTH_PROFILES_PATH"           : "/authProfiles",
        "CARD_PATH"                    : "/cards",
        "DRIVER_PATH"                  : "/drivers",
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
    // Accounts
    globals.WEBSERVICE.ACCOUNTS = {
        "URL": globals.WEBSERVICE.SECURE.ROOT_URL + globals.WEBSERVICE.ACCOUNTS_PATH
    };
    // Cards
    globals.WEBSERVICE.CARDS = {
        "TERMINATE_PATH": "/terminate"
    };

    /**
     * App
     */
    globals.APP = {
        "NAME"                            : "WEXonline",
        "EMAIL_ADDRESS_VALIDATION_PATTERN": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$",
        "ZIP_CODE_PATTERN"                : "/\\d{5}-\\d{4}|\\d{5}|[A-Z]\\d[A-Z] \\d[A-Z]\\d/",
        "ALPHANUMERIC_PATTERN"            : /^[A-Z\d]+$/i,
        "ALPHANUMERIC_WITH_SPACE_PATTERN" : /^[A-Z\d ]+$/i
    };

    globals.APP.constants = {
        "APP_VERSION_STATUS" : "appVersionStatus",
        "LAST_WARN_VERSION"  : "lastWarnVersion",
        "STATES": [
            {
                id: "AL",
                name: "Alabama"
            },
            {
                id: "AK",
                name: "Alaska"
            },
            {
                id: "AZ",
                name: "Arizona"
            },
            {
                id: "AR",
                name: "Arkansas"
            },
            {
                id: "CA",
                name: "California"
            },
            {
                id: "CO",
                name: "Colorado"
            },
            {
                id: "CT",
                name: "Connecticut"
            },
            {
                id: "DE",
                name: "Delaware"
            },
            {
                id: "DC",
                name: "District Of Columbia"
            },
            {
                id: "FL",
                name: "Florida"
            },
            {
                id: "GA",
                name: "Georgia"
            },
            {
                id: "HI",
                name: "Hawaii"
            },
            {
                id: "ID",
                name: "Idaho"
            },
            {
                id: "IL",
                name: "Illinois"
            },
            {
                id: "IN",
                name: "Indiana"
            },
            {
                id: "IA",
                name: "Iowa"
            },
            {
                id: "KS",
                name: "Kansas"
            },
            {
                id: "KY",
                name: "Kentucky"
            },
            {
                id: "LA",
                name: "Louisiana"
            },
            {
                id: "ME",
                name: "Maine"
            },
            {
                id: "MD",
                name: "Maryland"
            },
            {
                id: "MA",
                name: "Massachusetts"
            },
            {
                id: "MI",
                name: "Michigan"
            },
            {
                id: "MN",
                name: "Minnesota"
            },
            {
                id: "MS",
                name: "Mississippi"
            },
            {
                id: "MO",
                name: "Missouri"
            },
            {
                id: "MT",
                name: "Montana"
            },
            {
                id: "NE",
                name: "Nebraska"
            },
            {
                id: "NV",
                name: "Nevada"
            },
            {
                id: "NH",
                name: "New Hampshire"
            },
            {
                id: "NJ",
                name: "New Jersey"
            },
            {
                id: "NM",
                name: "New Mexico"
            },
            {
                id: "NY",
                name: "New York"
            },
            {
                id: "NC",
                name: "North Carolina"
            },
            {
                id: "ND",
                name: "North Dakota"
            },
            {
                id: "OH",
                name: "Ohio"
            },
            {
                id: "OK",
                name: "Oklahoma"
            },
            {
                id: "OR",
                name: "Oregon"
            },
            {
                id: "PA",
                name: "Pennsylvania"
            },
            {
                id: "RI",
                name: "Rhode Island"
            },
            {
                id: "SC",
                name: "South Carolina"
            },
            {
                id: "SD",
                name: "South Dakota"
            },
            {
                id: "TN",
                name: "Tennessee"
            },
            {
                id: "TX",
                name: "Texas"
            },
            {
                id: "UT",
                name: "Utah"
            },
            {
                id: "VT",
                name: "Vermont"
            },
            {
                id: "VA",
                name: "Virginia"
            },
            {
                id: "WA",
                name: "Washington"
            },
            {
                id: "WV",
                name: "West Virginia"
            },
            {
                id: "WI",
                name: "Wisconsin"
            },
            {
                id: "WY",
                name: "Wyoming"
            }
        ]
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
     * Card
     */
    globals.card = {};
    globals.card.constants = {
        "STATUS_ACTIVE"         : "ACTIVE",
        "STATUS_TERMINATED"     : "TERMINATED",
        "VIN_PLACEHOLDER_FORMAT": "Must be {{vinFixedLength}} characters.",
        "ERROR_CUSTOMER_VEHICLE_ID_REQUIRED_FIELD"    : "Customer Vehicle ID must have a value",
        "ERROR_CUSTOMER_VEHICLE_ID_INVALID_LENGTH"    : "Customer Vehicle ID cannot exceed {{maxLength}} characters",
        "ERROR_CUSTOMER_VEHICLE_ID_INVALID_CHARACTERS": "Customer Vehicle ID must contain only alphanumeric characters",
        "ERROR_VEHICLE_DESCRIPTION_REQUIRED_FIELD"    : "Vehicle Description must have a value",
        "ERROR_VEHICLE_DESCRIPTION_INVALID_LENGTH"    : "Vehicle Description cannot exceed {{maxLength}} characters",
        "ERROR_VEHICLE_DESCRIPTION_INVALID_CHARACTERS": "Vehicle Description must contain only alphanumeric characters",
        "ERROR_VIN_REQUIRED_FIELD"    : "VIN must have a value",
        "ERROR_VIN_INVALID_LENGTH"    : "VIN must contain {{fixedLength}} characters",
        "ERROR_VIN_INVALID_CHARACTERS": "VIN must contain only alphanumeric characters",
        "ERROR_LICENSE_PLATE_NUMBER_REQUIRED_FIELD"    : "License Plate Number must have a value",
        "ERROR_LICENSE_PLATE_NUMBER_INVALID_LENGTH"    : "License Plate Number cannot exceed {{maxLength}} characters",
        "ERROR_LICENSE_PLATE_NUMBER_INVALID_CHARACTERS": "License Plate Number must contain only alphanumeric characters"
    };

    /**
     * Page :: Card Search
     */
    globals.cardSearch = {};
    globals.cardSearch.constants = {
        "DEFAULT_PAGE_NUMBER": 0,
        "DEFAULT_PAGE_SIZE": 25,
        "SHOW_ALL_PAGE_SIZE": 1000,
        "ALL": {
            id: "",
            name: "All"
        }
    };
    globals.cardSearch.configuration = {
        "id": {
            "label"      : "Vehicle Card Number",
            "name"       : "id",
            "placeholder": "",
            "value"      : ""
        },
        "customVehicleId": {
            "label"      : "Customer Vehicle ID",
            "name"       : "customVehicleId",
            "placeholder": "",
            "value"      : ""
        },
        "licensePlateNumber": {
            "label"      : "License Plate Number",
            "name"       : "licensePlateNumber",
            "placeholder": "",
            "value"      : ""
        },
        "status": {
            "label"      : "Status",
            "name"       : "status",
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
        "departmentId": {
            "label"      : "Department",
            "name"       : "departmentId",
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
     * Page :: Card Search Results
     */
    globals.cardSearchResults = {};
    globals.cardSearchResults.constants = {
        "TOTAL_RESULTS_FORMAT"   : "Displaying {{numberDisplayed}} of {{totalResults}} results",
        "NO_RESULTS_MESSAGE"     : "No results found. Please try again.",
        "CARD_DETAILS_BASE_URL": "#cardDetails/"
    };
    globals.cardSearchResults.configuration = {
        "url": {
            "value": ""
        },
        "id": {
            "label": "Card Number",
            "value": ""
        },
        "customVehicleId": {
            "label": "Customer Vehicle ID",
            "value": ""
        },
        "vehicleDescription": {
            "label": "Vehicle Description",
            "value": ""
        },
        "licensePlateNumber": {
            "label": "License Plate Number",
            "value": ""
        },
        "licensePlateState": {
            "label": "License Plate State",
            "value": ""
        },
        "department": {
            "label": "Department",
            "value": ""
        },
        "status": {
            "label": "Status",
            "value": ""
        },
        "totalResults": {
            "value": ""
        },
        "submitButton": {
            "label"  : "Show All Cards",
            "visible": null
        }
    };

    /**
     * Page :: Card Details
     */
    globals.cardDetails = {};
    globals.cardDetails.constants = {
        "STATUS_CHANGE_SUCCESS_TITLE": "Card Status Confirmation"
    };
    globals.cardDetails.configuration = {
        "id": {
            "label": "Card Number",
            "value": ""
        },
        "customVehicleId": {
            "label": "Customer Vehicle ID",
            "value": ""
        },
        "vehicleDescription": {
            "label": "Vehicle Description",
            "value": ""
        },
        "licensePlateNumber": {
            "label": "License Plate Number",
            "value": ""
        },
        "licensePlateState": {
            "label": "License Plate State",
            "value": ""
        },
        "department": {
            "label": "Department",
            "value": ""
        },
        "status": {
            "label": "Status",
            "value": ""
        },
        "editButton": {
            "label": "Edit",
            "visible": null
        },
        "terminateButton": {
            "label": "Terminate",
            "visible": null
        }
    };

    /**
     * Card Add
     */
    globals.cardAdd = {};
    globals.cardAdd.constants = {
        "DEFAULT_DEPARTMENT_NAME": "UNASSIGNED",
        "NO_AUTH_PROFILES_MESSAGE": "The account must have at least one profile set-up to add a card.",
        "SELECT_STATE": {
            id: "",
            name: "Select State"
        }
    };
    globals.cardAdd.configuration = {
        "ableToAddCard"         : null,
        "unableToAddCardMessage": null,
        "customVehicleId": {
            "label"      : "Customer Vehicle ID",
            "name"       : "customVehicleId",
            "maxLength"  : null,
            "placeholder": "",
            "value"      : ""
        },
        "vehicleDescription": {
            "label"      : "Vehicle Description",
            "name"       : "vehicleDescription",
            "maxLength"  : null,
            "placeholder": "",
            "value"      : ""
        },
        "vin": {
            "label"      : "VIN",
            "name"       : "vin",
            "maxLength"  : null,
            "placeholder": "",
            "value"      : ""
        },
        "licensePlateNumber": {
            "label"      : "License Plate Number",
            "name"       : "licensePlateNumber",
            "maxLength"  : null,
            "placeholder": "",
            "value"      : ""
        },
        "licensePlateState": {
            "label"      : "License Plate State",
            "name"       : "licensePlateState",
            "enabled"    : true,
            "values"     : []
        },
        "departmentId": {
            "label"      : "Department",
            "name"       : "departmentId",
            "enabled"    : true,
            "values"     : []
        },
        "authorizationProfileName": {
            "label"      : "Profile Assignment",
            "name"       : "authorizationProfileName",
            "enabled"    : true,
            "values"     : []
        },
        "submitButton": {
            "label": "Next"
        }
    };

    /**
     * Card Terminate
     */
    globals.cardTerminate = {};
    globals.cardTerminate.constants = {
        "CONFIRMATION_TITLE": "Terminate<br/>Card",
        "CONFIRMATION_MESSAGE": "Are you sure you want to terminate this card?<br/>This action cannot be undone.",
        "CANCEL_BTN_TEXT": "Cancel",
        "OK_BTN_TEXT": "Terminate"
    };

    /**
     * Driver
     */
    globals.driver = {};
    globals.driver.constants = {
        "STATUS_ACTIVE": "ACTIVE",
        "STATUS_TERMINATED": "TERMINATED",
        "ERROR_FIRST_NAME_REQUIRED_FIELD"     : "First Name must have a value",
        "ERROR_FIRST_NAME_INVALID_LENGTH"     : "First Name cannot exceed {{firstNameMaxLength}} characters",
        "ERROR_FIRST_NAME_INVALID_CHARACTERS" : "First Name must contain only alphanumeric characters",
        "ERROR_LAST_NAME_REQUIRED_FIELD"      : "Last Name must have a value",
        "ERROR_LAST_NAME_INVALID_LENGTH"      : "Last Name cannot exceed {{lastNameMaxLength}} characters",
        "ERROR_LAST_NAME_INVALID_CHARACTERS"  : "Last Name must contain only alphanumeric characters",
        "ERROR_MIDDLE_NAME_INVALID_LENGTH"    : "Middle Name cannot exceed {{middleNameMaxLength}} character(s)",
        "ERROR_MIDDLE_NAME_INVALID_CHARACTERS": "Middle Name must contain only alpha characters",
        "ERROR_DRIVER_ID_REQUIRED_FIELD"      : "Driver ID must have a value",
        "ERROR_DRIVER_ID_INVALID_FORMAT"      : "Driver ID must be numeric",
        "ERROR_DRIVER_ID_INVALID_LENGTH"      : "Driver ID must be {{idFixedLength}} digits",
        "DRIVER_ID_PLACEHOLDER_FORMAT"        : "Must be {{idFixedLength}} digits"
    };

    /**
     * Page :: Driver Search
     */
    globals.driverSearch = {};
    globals.driverSearch.constants = {
        "DEFAULT_PAGE_NUMBER": 0,
        "DEFAULT_PAGE_SIZE": 25,
        "SHOW_ALL_PAGE_SIZE": 1000,
        "ALL": {
            id: "",
            name: "All"
        }
    };
    globals.driverSearch.configuration = {
        "firstName": {
            "label"      : "First Name",
            "name"       : "firstName",
            "placeholder": "",
            "value"      : ""
        },
        "lastName": {
            "label"      : "Last Name",
            "name"       : "lastName",
            "placeholder": "",
            "value"      : ""
        },
        "id": {
            "label"      : "Driver ID",
            "name"       : "id",
            "placeholder": "",
            "value"      : ""
        },
        "status": {
            "label"      : "Status",
            "name"       : "status",
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
        "departmentId": {
            "label"      : "Department",
            "name"       : "departmentId",
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
        "id": {
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
        "BUTTON_ACTIVATE": "ACTIVATE",
        "BUTTON_TERMINATE": "TERMINATE"
    };
    globals.driverEdit.configuration = {
        "driverName": {
            "label": "Driver Name",
            "value": ""
        },
        "id": {
            "label": "Driver ID",
            "value": ""
        },
        "department": {
            "label": "Department",
            "value": ""
        },
        "status": {
            "label": "Status",
            "value": ""
        },
        "statusDate": {
            "label": "Status Date",
            "value": ""
        },
        "submitButton": {
            "label": ""
        }
    };

    /**
     * Driver Terminate
     */
    globals.driverTerminate = {};
    globals.driverTerminate.constants = {
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
        "DEFAULT_DEPARTMENT_NAME"             : "UNASSIGNED"
    };
    globals.driverAdd.configuration = {
        "firstName": {
            "label"      : "First Name",
            "name"       : "firstName",
            "maxLength"  : null,
            "placeholder": "",
            "value"      : ""
        },
        "middleName": {
            "label"      : "Middle Initial",
            "name"       : "middleName",
            "maxLength"  : null,
            "placeholder": "",
            "value"      : ""
        },
        "lastName": {
            "label"      : "Last Name",
            "name"       : "lastName",
            "maxLength"  : null,
            "placeholder": "",
            "value"      : ""
        },
        "id": {
            "label"      : "Driver ID",
            "name"       : "id",
            "maxLength"  : null,
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
        "BUTTON_ACTIVATE": "ACTIVATE",
        "BUTTON_TERMINATE": "TERMINATE"
    };
    globals.driverAddedDetails.configuration = {
        "driverName": {
            "label": "Driver Name",
            "value": ""
        },
        "id": {
            "label": "Driver ID",
            "value": ""
        },
        "department": {
            "label": "Department",
            "value": ""
        },
        "status": {
            "label": "Status",
            "value": ""
        },
        "statusDate": {
            "label": "Status Date",
            "value": ""
        }
    };

    return globals;
});
