define(function (require) {

    "use strict";


    var globals;
    globals = {};

    /**
    * Webservices
    */
    globals.WEBSERVICE = {
        "ROOT_URL"                      : "@@@STRING_REPLACE_APP_URL@@@",
        "APP_PATH"                      : "/app",
        "ACCOUNTS_PATH"                 : "/accounts",
        "AUTH_PROFILES_PATH"            : "/authProfiles",
        "BANK_ACCOUNTS_PATH"            : "/payments/activeBanks",
        "CARD_PATH"                     : "/cards",
        "DRIVER_PATH"                   : "/drivers",
        "PAYMENTS_PATH"                 : "/payments",
        "INVOICE_SUMMARY_PATH"          : "/payments/currentInvoiceSummary",
        "MAKE_PAYMENT_AVAILABILITY_PATH": "/payments/makePaymentAvailability",
        "USER_AUTH_PATH"                : "/userAuth",
        "REQUEST_ERROR_TITLE"           : "Cannot complete request",
        "REQUEST_ERROR_UNKNOWN_MESSAGE" : "Please try again",
        "REQUEST_ERROR_MESSAGE_PREFIX"  : "<div class='ui-body ui-body-e'>",
        "REQUEST_ERROR_MESSAGE_SUFFIX"  : "</div>"
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
        "EMAIL_ADDRESS_VALIDATION_PATTERN": "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$",
        "POBOX_PATTERN"                   : "([\\w\\s*\\W]*(P(OST)?(\\.)?\\s*O(FF(ICE)?)?(\\.)?\\s*B(OX)?))[\\w\\s*\\W]*",
        "ZIP_CODE_PATTERN"                : "/\\d{5}-\\d{4}|\\d{5}|[A-Z]\\d[A-Z] \\d[A-Z]\\d/",
        "ALPHANUMERIC_PATTERN"            : /^[A-Z\d]+$/i,
        "ALPHANUMERIC_WITH_SPACE_PATTERN" : /^[A-Z\d ]+$/i,
        "DATE_PATTERN"                    : /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
        "NUMBER_PATTERN"                  : /^\d+(\.\d{1,2})?$/
    };

    globals.APP.constants = {
        "DEFAULT_DEPARTMENT_NAME": "UNASSIGNED",
        "DEFAULT_SHIPPING_METHOD_NAME": "STANDARD",
        "APP_VERSION_STATUS" : "appVersionStatus",
        "LAST_WARN_VERSION"  : "lastWarnVersion",
        "STATES": [
            {
                id: "AL",
                name: "Alabama",
                selected: false
            },
            {
                id: "AK",
                name: "Alaska",
                selected: false
            },
            {
                id: "AZ",
                name: "Arizona",
                selected: false
            },
            {
                id: "AR",
                name: "Arkansas",
                selected: false
            },
            {
                id: "CA",
                name: "California",
                selected: false
            },
            {
                id: "CO",
                name: "Colorado",
                selected: false
            },
            {
                id: "CT",
                name: "Connecticut",
                selected: false
            },
            {
                id: "DE",
                name: "Delaware",
                selected: false
            },
            {
                id: "DC",
                name: "District Of Columbia",
                selected: false
            },
            {
                id: "FL",
                name: "Florida",
                selected: false
            },
            {
                id: "GA",
                name: "Georgia",
                selected: false
            },
            {
                id: "HI",
                name: "Hawaii",
                selected: false
            },
            {
                id: "ID",
                name: "Idaho",
                selected: false
            },
            {
                id: "IL",
                name: "Illinois",
                selected: false
            },
            {
                id: "IN",
                name: "Indiana",
                selected: false
            },
            {
                id: "IA",
                name: "Iowa",
                selected: false
            },
            {
                id: "KS",
                name: "Kansas",
                selected: false
            },
            {
                id: "KY",
                name: "Kentucky",
                selected: false
            },
            {
                id: "LA",
                name: "Louisiana",
                selected: false
            },
            {
                id: "ME",
                name: "Maine",
                selected: false
            },
            {
                id: "MD",
                name: "Maryland",
                selected: false
            },
            {
                id: "MA",
                name: "Massachusetts",
                selected: false
            },
            {
                id: "MI",
                name: "Michigan",
                selected: false
            },
            {
                id: "MN",
                name: "Minnesota",
                selected: false
            },
            {
                id: "MS",
                name: "Mississippi",
                selected: false
            },
            {
                id: "MO",
                name: "Missouri",
                selected: false
            },
            {
                id: "MT",
                name: "Montana",
                selected: false
            },
            {
                id: "NE",
                name: "Nebraska",
                selected: false
            },
            {
                id: "NV",
                name: "Nevada",
                selected: false
            },
            {
                id: "NH",
                name: "New Hampshire",
                selected: false
            },
            {
                id: "NJ",
                name: "New Jersey",
                selected: false
            },
            {
                id: "NM",
                name: "New Mexico",
                selected: false
            },
            {
                id: "NY",
                name: "New York",
                selected: false
            },
            {
                id: "NC",
                name: "North Carolina",
                selected: false
            },
            {
                id: "ND",
                name: "North Dakota",
                selected: false
            },
            {
                id: "OH",
                name: "Ohio",
                selected: false
            },
            {
                id: "OK",
                name: "Oklahoma",
                selected: false
            },
            {
                id: "OR",
                name: "Oregon",
                selected: false
            },
            {
                id: "PA",
                name: "Pennsylvania",
                selected: false
            },
            {
                id: "RI",
                name: "Rhode Island",
                selected: false
            },
            {
                id: "SC",
                name: "South Carolina",
                selected: false
            },
            {
                id: "SD",
                name: "South Dakota",
                selected: false
            },
            {
                id: "TN",
                name: "Tennessee",
                selected: false
            },
            {
                id: "TX",
                name: "Texas",
                selected: false
            },
            {
                id: "UT",
                name: "Utah",
                selected: false
            },
            {
                id: "VT",
                name: "Vermont",
                selected: false
            },
            {
                id: "VA",
                name: "Virginia",
                selected: false
            },
            {
                id: "WA",
                name: "Washington",
                selected: false
            },
            {
                id: "WV",
                name: "West Virginia",
                selected: false
            },
            {
                id: "WI",
                name: "Wisconsin",
                selected: false
            },
            {
                id: "WY",
                name: "Wyoming",
                selected: false
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
     * Validation Errors
     */
    globals.VALIDATION_ERRORS = {
        "TITLE" : "Cannot complete request",
        "HEADER": "<div class='ui-body ui-body-e'>The following fields are required:</div>"
    };

    /**
     * Validation Warnings
     */
    globals.VALIDATION_WARNINGS = {
        "TITLE" : "Warning",
        "HEADER": "<div class='ui-body ui-body-e'>The following warnings were found:</div>",
        "FOOTER": "<div class='ui-body'>Would you like to proceed?</div>",
        "PRIMARY_BUTTON_TEXT": "Yes",
        "SECONDARY_BUTTON_TEXT": "No"
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
    globals.companyData.permissions = {
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
        "ERROR_LICENSE_PLATE_NUMBER_INVALID_CHARACTERS": "License Plate Number must contain only alphanumeric characters",
        "SELECT_STATE": {
            id: "",
            name: "Select State",
            selected: true
        }
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
        "NO_AUTH_PROFILES_MESSAGE": "The account must have at least one profile set-up to add a card."
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

    globals.cardChangedDetails = {};
    globals.cardChangedDetails.constants = {
        "SUCCESS_TITLE": "Card Confirmation",
        "RESIDENCE_YES": "Yes",
        "RESIDENCE_NO": "No"
    };
    globals.cardChangedDetails.configuration = {
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
        "shipping": {
            "method": {
                "label": "Delivery Method",
                "value": ""
            },
            "address": {
                "label": "Shipping Address",
                "firstName": {
                    "value"      : ""
                },
                "lastName": {
                    "value"      : ""
                },
                "companyName": {
                    "value"      : ""
                },
                "addressLine1": {
                    "value"      : ""
                },
                "addressLine2": {
                    "value"      : ""
                },
                "city": {
                    "value"      : ""
                },
                "state": {
                    "value"      : ""
                },
                "postalCode": {
                    "value"      : ""
                }
            },
            "residence": {
                "label": "Residence",
                "value": ""
            }
        }
    };

    /**
     * Card Edit
     */
    globals.cardEdit = {};
    globals.cardEdit.constants = {
        "NO_AUTH_PROFILES_MESSAGE": "The account must have at least one profile set-up to edit a card."
    };
    globals.cardEdit.configuration = {
        "ableToEditCard"         : null,
        "unableToEditCardMessage": null,
        "id": {
            "label": "Card Number",
            "value": ""
        },
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
     * Page :: Card Shipping
     */
    globals.cardShipping = {};
    globals.cardShipping.constants = {
        "ERROR_FIRST_NAME_REQUIRED_FIELD"  : "First Name must have a value",
        "ERROR_LAST_NAME_REQUIRED_FIELD"   : "Last Name must have a value",
        "ERROR_COMPANY_NAME_REQUIRED_FIELD": "Company must have a value",
        "ERROR_ADDRESS1_REQUIRED_FIELD"    : "Address 1 must have a value",
        "ERROR_ADDRESS1_CANNNOT_BE_POBOX"  : "Address 1 cannot contain PO. Box when the delivery method is {{shippingMethod}}",
        "ERROR_ADDRESS2_CANNNOT_BE_POBOX"  : "Address 2 cannot contain PO. Box when the delivery method is {{shippingMethod}}",
        "ERROR_CITY_REQUIRED_FIELD"        : "City must have a value",
        "ERROR_STATE_REQUIRED_FIELD"       : "State must have a value",
        "ERROR_POSTAL_CODE_REQUIRED_FIELD" : "Postal Code must have a value"
    };
    globals.cardShipping.configuration = {
        "ableToContinue"         : null,
        "unableToContinueMessage": null,
        "shippingMethod": {
            "label"      : "Delivery Method",
            "name"       : "shippingMethod",
            "enabled"    : true,
            "values"     : [],
            "warning"    : "Cards requested prior to 3pm EST will be delivered the next business day."
        },
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
        "companyName": {
            "label"      : "Company",
            "name"       : "companyName",
            "placeholder": "",
            "value"      : ""
        },
        "addressLine1": {
            "label"      : "Address 1",
            "name"       : "addressLine1",
            "placeholder": "",
            "value"      : ""
        },
        "addressLine2": {
            "label"      : "Address 2",
            "name"       : "addressLine2",
            "placeholder": "",
            "value"      : ""
        },
        "city": {
            "label"      : "City",
            "name"       : "city",
            "placeholder": "",
            "value"      : ""
        },
        "state": {
            "label"      : "State",
            "name"       : "state",
            "placeholder": "",
            "values"     : []
        },
        "postalCode": {
            "label"      : "Postal Code",
            "name"       : "postalCode",
            "placeholder": "",
            "value"      : ""
        },
        "residence": {
            "label"      : "Is this a residence?",
            "name"       : "residence",
            "placeholder": "",
            "values"     : []
        },
        "submitButton": {
            "label": "Submit"
        }
    };

    /**
     * Card Terminate
     */
    globals.cardTerminate = {};
    globals.cardTerminate.constants = {
        "CONFIRMATION_TITLE": "Terminate Card",
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
        "CONFIRMATION_TITLE": "Terminate Driver",
        "CONFIRMATION_MESSAGE": "Are you sure you want to terminate the driver?",
        "CANCEL_BTN_TEXT": "Cancel",
        "OK_BTN_TEXT": "Terminate"
    };

    /**
     * Driver Add
     */
    globals.driverAdd = {};
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
        "SUCCESS_TITLE": "Driver Confirmation",
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

    /**
     * Invoice Summary
     */
    globals.invoiceSummary = {};
    globals.invoiceSummary.constants = {
        "DIRECT_DEPOSIT_ENABLED"   : "Your account is set up for automatic direct deposit payment. Your account is not set up to submit payments.",
        "MUST_SET_UP_BANKS"        : "You must set up your financial institutions payment options online prior to scheduling a payment.",
        "PAYMENT_ALREADY_SCHEDULED": "This account already has a payment scheduled or pending."
    };
    globals.invoiceSummary.configuration = {
        "unableToMakePaymentMessage": null,
        "accountNumber": {
            "label": "Account Number",
            "value": ""
        },
        "availableCredit": {
            "label": "Available Credit",
            "value": ""
        },
        "currentBalance": {
            "label": "Current Balance",
            "value": "",
            "asOfValue": ""
        },
        "paymentDueDate": {
            "label": "Payment Due Date",
            "value": ""
        },
        "minimumPaymentDue": {
            "label": "Min. Payment Due",
            "value": ""
        },
        "invoiceNumber": {
            "label": "Invoice Number",
            "value": ""
        },
        "closingDate": {
            "label": "Closing Date",
            "value": ""
        },
        "makePaymentButton": {
            "visible": false,
            "label": "Make Payment"
        }
    };

    /**
     * Payment
     */
    globals.payment = {};
    globals.payment.constants = {
        "STATUS_SCHEDULED": "SCHEDULED",
        "ERROR_SCHEDULED_DATE_REQUIRED_FIELD": "Payment Date must have a value",
        "ERROR_SCHEDULED_DATE_MUST_BE_A_DATE": "Payment Date must be a date",
        "ERROR_SCHEDULED_DATE_AFTER_DUE_DATE": "Your payment is scheduled to be paid after the due date. This could result in late fees and service interruption to your account",
        "ERROR_SCHEDULED_DATE_BEFORE_TODAY"  : "You have entered a date for which processing has already occurred. The next available processing date is today",
        "ERROR_AMOUNT_REQUIRED_FIELD"        : "Amount must have a value",
        "ERROR_AMOUNT_MUST_BE_NUMERIC"       : "Amount must be numeric.",
        "ERROR_AMOUNT_LESS_THAN_PAYMENT_DUE" : "This amount is less than the minimum payment"
    };

    /**
     * Page :: Payment Search
     */
    globals.paymentSearch = {};
    globals.paymentSearch.constants = {
        "DEFAULT_PAGE_NUMBER": 0,
        "DEFAULT_PAGE_SIZE": 5
    };

    /**
     * Page :: Payment Search Results
     */
    globals.paymentSearchResults = {};
    globals.paymentSearchResults.constants = {
        "PAYMENT_DETAILS_BASE_URL": "#paymentDetails/"
    };
    globals.paymentSearchResults.configuration = {
        "url": {
            "value": ""
        },
        "scheduledDate": {
            "label": "Date",
            "value": ""
        },
        "amount": {
            "label": "Amount",
            "value": ""
        },
        "bankAccountName": {
            "label": "Bank Account",
            "value": ""
        },
        "status": {
            "label": "Status",
            "value": ""
        }
    };

    /**
     * Page :: Payment Details
     */
    globals.paymentDetails = {};
    globals.paymentDetails.constants = {
        "CANCEL_PAYMENT_SUCCESS_TITLE": "Payment Cancellation"
    };
    globals.paymentDetails.configuration = {
        "scheduledDate": {
            "label": "Date",
            "value": ""
        },
        "amount": {
            "label": "Amount",
            "value": ""
        },
        "bankAccountName": {
            "label": "Bank Account",
            "value": ""
        },
        "status": {
            "label": "Status",
            "value": ""
        },
        "confirmationNumber": {
            "label": "Confirmation Number",
            "value": ""
        },
        "editButton": {
            "label": "Edit Payment",
            "visible": null
        },
        "cancelButton": {
            "label": "Cancel Payment",
            "visible": null
        }
    };

    /**
     * Payment Add
     */
    globals.paymentAdd = {};
    globals.paymentAdd.constants = {
    };
    globals.paymentAdd.configuration = {
        "scheduledDate": {
            "label"      : "Payment Date",
            "name"       : "scheduledDate",
            "value"      : ""
        },
        "amount": {
            "label"      : "Amount",
            "name"       : "amount",
            "value"      : ""
        },
        "bankAccount": {
            "label"      : "Bank Account",
            "name"       : "bankAccount",
            "enabled"    : true,
            "values"     : []
        },
        "submitButton": {
            "label": "Make Payment"
        }
    };

    /**
     * Payment Edit
     */
    globals.paymentEdit = {};
    globals.paymentEdit.constants = {
    };
    globals.paymentEdit.configuration = {
        "scheduledDate": {
            "label"      : "Payment Date",
            "name"       : "scheduledDate",
            "value"      : ""
        },
        "amount": {
            "label"      : "Amount",
            "name"       : "amount",
            "value"      : ""
        },
        "bankAccount": {
            "label"      : "Bank Account",
            "name"       : "bankAccount",
            "enabled"    : true,
            "values"     : []
        },
        "submitButton": {
            "label": "Make Payment"
        }
    };

    globals.paymentChangedDetails = {};
    globals.paymentChangedDetails.constants = {
        "SUCCESS_TITLE": "Payment Confirmation"
    };
    globals.paymentChangedDetails.configuration = {
        "scheduledDate": {
            "label": "Payment Date",
            "value": ""
        },
        "amount": {
            "label": "Amount",
            "value": ""
        },
        "bankAccountName": {
            "label": "Bank Account",
            "value": ""
        },
        "confirmationNumber": {
            "label": "Confirmation Number",
            "value": ""
        }
    };

    /**
     * Payment Cancel
     */
    globals.paymentCancel = {};
    globals.paymentCancel.constants = {
        "CONFIRMATION_TITLE": "Cancel Payment",
        "CONFIRMATION_MESSAGE": "Are you sure you want to cancel this payment?",
        "CANCEL_BTN_TEXT": "No",
        "OK_BTN_TEXT": "Yes"
    };

    /**
     * Page :: Hierarchy Manager
     */
    globals.hierarchyManager = {};
    globals.hierarchyManager.constants = {
        "TOP_LEVEL_TITLE"   : "National ID List",
        "SECOND_LEVEL_TITLE": "Account List for:<br/>{{hierarchyName}}"
    };
    globals.hierarchyManager.configuration = {
        "backButton": {
            "visible": false
        },
        "title": {
            "value": ""
        },
        "name": {
            "value": ""
        },
        "displayNumber": {
            "value": ""
        }
    };

    return globals;
});
