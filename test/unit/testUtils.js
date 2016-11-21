"use strict";

/* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll
// jshint maxparams:6

var TestUtils = (function () {

    var ALPHANUMERIC_CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        TestUtils = {
            digestError                        : digestError,
            getRandomAccount                   : getRandomAccount,
            getRandomAddress                   : getRandomAddress,
            getRandomNotification              : getRandomNotification,
            getRandomNotificationResponse      : getRandomNotificationResponse,
            getRandomAnalyticsEvent            : getRandomAnalyticsEvent,
            getRandomArray                     : getRandomArray,
            getRandomBank                      : getRandomBank,
            getRandomBoolean                   : getRandomBoolean,
            getRandomBrandAsset                : getRandomBrandAsset,
            getRandomBrandAssets               : getRandomBrandAssets,
            getRandomCard                      : getRandomCard,
            getRandomCardReissueDetails        : getRandomCardReissueDetails,
            getRandomDate                      : getRandomDate,
            getRandomDriver                    : getRandomDriver,
            getRandomInteger                   : getRandomInteger,
            getRandomInvoiceSummary            : getRandomInvoiceSummary,
            getRandomMap                       : getRandomMap,
            getRandomNumber                    : getRandomNumber,
            getRandomNumberWithLength          : getRandomNumberWithLength,
            getRandomOnlineApplication         : getRandomOnlineApplication,
            getRandomPayment                   : getRandomPayment,
            getRandomPaymentAdd                : getRandomPaymentAdd,
            getRandomPaymentAddAvailability    : getRandomPaymentAddAvailability,
            getRandomPaymentUpdate             : getRandomPaymentUpdate,
            getRandomPostedTransaction         : getRandomPostedTransaction,
            getRandomShippingCarrier           : getRandomShippingCarrier,
            getRandomShippingMethod            : getRandomShippingMethod,
            getRandomStringThatIsAlphaNumeric  : getRandomStringThatIsAlphaNumeric,
            getRandomUser                      : getRandomUser,
            getRandomUserAccount               : getRandomUserAccount,
            getRandomValueFromArray            : getRandomValueFromArray,
            getRandomValueFromMap              : getRandomValueFromMap,
            getRandomVersionStatus             : getRandomVersionStatus,
            getRandomNotificationModel         : getRandomNotificationModel,
            provideCommonMockDependencies      : provideCommonMockDependencies,
            provideCommonAppMockDependencies   : provideCommonAppMockDependencies,
            provideCommonSharedMockDependencies: provideCommonSharedMockDependencies,
            rejectedPromise                    : rejectedPromise,
            resolvedPromise                    : resolvedPromise,
            setFeatureFlagEnabled              : setFeatureFlagEnabled,
            setFeatureFlagsEnabled             : setFeatureFlagsEnabled,
            resetMock                          : resetMock
        };

    return TestUtils;

    //////////////////////

    /* Normally, an error thrown inside a catch statement causes Angular to continue to the rejection of the promise up the chain.
     * During testing, the error causes Angular's digest cycle to stop midway through, making it impossible to trigger any
     * additional digest cycles (which means we can't test async code that responds to the rejection of that promise).
     *
     * TODO: Remove this hack once this issue has been fixed.
     */
    function digestError(scope) {
        expect(scope.$digest).toThrow();
        delete scope.$$phase;
        scope.$digest();
    }

    //Allows for simulating a resolved promise chain without using $q
    function rejectedPromise(value) {
        return {
            then: resolvedPromise,
            catch: function (catchCallback) {
                return rejectedPromise(catchCallback(value));
            },
            finally: function (finallyCallback) {
                finallyCallback();
            }
        };
    }

    function resolvedPromise(value) {
        return {
            then: function (thenCallback) {
                return resolvedPromise(thenCallback(value));
            },
            catch: rejectedPromise,
            finally: function (finallyCallback) {
                finallyCallback();
            }
        };
    }

    function getRandomAccount(AccountModel, AddressModel, ShippingCarrierModel, ShippingMethodModel) {
        var account = new AccountModel();

        account.set({
            accountId                 : getRandomStringThatIsAlphaNumeric(5),
            accountNumber             : getRandomNumberWithLength(10),
            name                      : getRandomStringThatIsAlphaNumeric(10),
            defaultCardShippingAddress: getRandomAddress(AddressModel),
            regularCardShippingMethod : getRandomShippingMethod(ShippingMethodModel),
            cardShippingCarrier       : getRandomShippingCarrier(ShippingCarrierModel, ShippingMethodModel),
            status                    : getRandomStringThatIsAlphaNumeric(10),
            statusReason              : getRandomStringThatIsAlphaNumeric(10)
        });

        return account;
    }

    function getRandomAddress(AddressModel) {
        var address = new AddressModel();

        address.set({
            firstName   : getRandomStringThatIsAlphaNumeric(10),
            lastName    : getRandomStringThatIsAlphaNumeric(10),
            companyName : getRandomStringThatIsAlphaNumeric(15),
            addressLine1: getRandomStringThatIsAlphaNumeric(10),
            addressLine2: getRandomStringThatIsAlphaNumeric(10),
            city        : getRandomStringThatIsAlphaNumeric(10),
            state       : getRandomStringThatIsAlphaNumeric(2),
            postalCode  : getRandomNumberWithLength(5),
            countryCode : getRandomStringThatIsAlphaNumeric(5),
            residence   : getRandomBoolean()
        });

        return address;
    }

    // Returns a notification after it is parsed into a NotificationModel.
    function getRandomNotification(NotificationModel) {
        var randomNotificationItem = new NotificationModel();

        randomNotificationItem.set(getRandomNotificationResponse());

        return randomNotificationItem;
    }

    // Returns a notification as it is received from NotificationsResource.getNotifications().
    function getRandomNotificationResponse() {
        return {data: JSON.stringify(getRandomMap(3)), id: getRandomStringThatIsAlphaNumeric(5), status: getRandomStringThatIsAlphaNumeric(10), type: getRandomStringThatIsAlphaNumeric(10)};
    }

    function getRandomAnalyticsEvent() {
        var event = [],
            numParams = getRandomInteger(2, 4);

        for (var i = 0; i < numParams; ++i) {
            event.push(TestUtils.getRandomStringThatIsAlphaNumeric(10));
        }

        return event;
    }

    function getRandomArray(length, mockCreator /*...*/) {
        var array = [],
            mockArgs = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : [];

        for (var i = 0; i < length; ++i) {
            array.push(mockCreator.apply(this, mockArgs));
        }

        return array;
    }

    function getRandomBank(BankModel) {
        var randomBank = new BankModel();

        randomBank.id = getRandomNumberWithLength(5);
        randomBank.defaultBank = getRandomBoolean();
        randomBank.name = getRandomStringThatIsAlphaNumeric(5);
        randomBank.restangularized = true;

        return randomBank;
    }

    function getRandomBrandAsset(BrandAssetModel) {
        var randomBrandAsset = new BrandAssetModel();

        randomBrandAsset.assetSubtypeId = getRandomStringThatIsAlphaNumeric(5);
        randomBrandAsset.assetTypeId = getRandomStringThatIsAlphaNumeric(5);
        randomBrandAsset.assetValue = getRandomStringThatIsAlphaNumeric(15);
        randomBrandAsset.brandAssetId = getRandomStringThatIsAlphaNumeric(15);
        randomBrandAsset.clientBrandId = getRandomStringThatIsAlphaNumeric(15);
        randomBrandAsset.clientBrandName = getRandomStringThatIsAlphaNumeric(15);
        randomBrandAsset.endDate = getRandomDate();
        randomBrandAsset.startDate = getRandomDate();

        return randomBrandAsset;
    }

    function getRandomBrandAssets(BrandAssetModel) {
        return getRandomArray(getRandomInteger(1, 5), getRandomBrandAsset, BrandAssetModel);
    }

    function getRandomBoolean() {
        return Math.random() >= 0.5;
    }

    function getRandomCard(CardModel) {
        var randomCard = new CardModel();

        randomCard.cardId = getRandomNumberWithLength(12);
        randomCard.accountId = getRandomStringThatIsAlphaNumeric(10);
        randomCard.cardType = getRandomStringThatIsAlphaNumeric(10);
        randomCard.embossedAccountNumber = getRandomStringThatIsAlphaNumeric(13);
        randomCard.embossedCardNumber = getRandomStringThatIsAlphaNumeric(5);
        randomCard.embossingValue1 = getRandomStringThatIsAlphaNumeric(15);
        randomCard.embossingValue2 = getRandomStringThatIsAlphaNumeric(15);
        randomCard.embossingValue3 = getRandomStringThatIsAlphaNumeric(15);
        randomCard.status = getRandomStringThatIsAlphaNumeric(5);

        return randomCard;
    }

    function getRandomCardReissueDetails(CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel) {
        var cardReissueDetails = new CardReissueModel();

        cardReissueDetails.set({
            account               : getRandomAccount(AccountModel, AddressModel, ShippingCarrierModel, ShippingMethodModel),
            originalCard          : getRandomCard(CardModel),
            reissuedCard          : getRandomCard(CardModel),
            shippingAddress       : getRandomAddress(AddressModel),
            selectedShippingMethod: getRandomShippingMethod(ShippingMethodModel),
            shippingMethods       : (function () {
                var shippingMethods = [],
                    shippingMethod,
                    numMethods = getRandomInteger(1, 5),
                    createdDefault = false;

                for (var i = 0; i < numMethods; ++i) {
                    shippingMethod = getRandomShippingMethod(ShippingMethodModel);

                    if (!createdDefault && getRandomBoolean()) {
                        shippingMethod.default = true;

                        createdDefault = true;
                    }
                    else {
                        shippingMethod.default = false;
                    }

                    shippingMethods.push(shippingMethod);
                }

                return shippingMethods;
            })(),
            reissueReason         : getRandomStringThatIsAlphaNumeric(10)
        });

        return cardReissueDetails;
    }

    function getRandomDate(start, end) {
        start = start || new Date(1970, 1, 1);
        end = end || new Date();

        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    function getRandomDriver(DriverModel) {
        var driver = new DriverModel();

        driver.set({
            driverId: getRandomStringThatIsAlphaNumeric(5),
            promptId: getRandomStringThatIsAlphaNumeric(10),
            firstName: getRandomStringThatIsAlphaNumeric(5),
            middleName: getRandomStringThatIsAlphaNumeric(5),
            lastName: getRandomStringThatIsAlphaNumeric(5),
            status: getRandomStringThatIsAlphaNumeric(5),
            statusDate: getRandomDate(),
            sourceSystem: getRandomStringThatIsAlphaNumeric(5)
        });

        return driver;
    }

    function getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function getRandomInvoiceSummary(InvoiceSummaryModel) {
        var randomInvoiceSummary = new InvoiceSummaryModel();

        randomInvoiceSummary.accountNumber = getRandomStringThatIsAlphaNumeric(10);
        randomInvoiceSummary.availableCredit = getRandomNumberWithLength(8);
        randomInvoiceSummary.billingDate = getRandomDate();
        randomInvoiceSummary.billedAmount = getRandomNumberWithLength(5);
        randomInvoiceSummary.closingDate = getRandomDate();
        randomInvoiceSummary.creditLimit = getRandomNumberWithLength(5);
        randomInvoiceSummary.currentBalance = getRandomNumberWithLength(5);
        randomInvoiceSummary.currentBalanceAsOf = getRandomDate();
        randomInvoiceSummary.invoiceId = getRandomNumberWithLength(10);
        randomInvoiceSummary.invoiceNumber = getRandomStringThatIsAlphaNumeric(10);
        randomInvoiceSummary.minimumPaymentDue = getRandomNumberWithLength(5);
        randomInvoiceSummary.paymentDueDate = getRandomDate();
        randomInvoiceSummary.statementBalance = getRandomNumberWithLength(5);
        randomInvoiceSummary.unbilledAmount = getRandomNumberWithLength(5);

        return randomInvoiceSummary;
    }

    function getRandomMap(numEntries) {
        var map = {};
        numEntries = numEntries || getRandomInteger(1, 5);

        for (var i = 0; i < numEntries; ++i) {
            map[getRandomStringThatIsAlphaNumeric(10)] = getRandomStringThatIsAlphaNumeric(10);
        }

        return map;
    }

    function getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomNumberWithLength(length) {
        return (Math.random() + 1).toString().substr(2, length);
    }

    function getRandomOnlineApplication(ONLINE_APPLICATION) {
        return getRandomValueFromMap(ONLINE_APPLICATION);
    }

    function getRandomPayment(PaymentModel, BankModel) {
        var randomPayment = new PaymentModel();

        randomPayment.id = getRandomNumberWithLength(10);
        randomPayment.scheduledDate = getRandomDate(new Date(2012, 0, 1), new Date());
        randomPayment.amount = getRandomNumberWithLength(5);
        randomPayment.bankAccount = getRandomBank(BankModel);
        randomPayment.status = getRandomStringThatIsAlphaNumeric(5);
        randomPayment.confirmationNumber = getRandomStringThatIsAlphaNumeric(5);
        randomPayment.restangularized = true;

        return randomPayment;
    }

    function getRandomPaymentAdd(PaymentModel, BankModel) {
        var randomPaymentAdd = new PaymentModel();

        randomPaymentAdd.scheduledDate = getRandomDate(new Date(2012, 0, 1), new Date());
        randomPaymentAdd.amount = getRandomNumberWithLength(5);
        randomPaymentAdd.bankAccount = getRandomBank(BankModel).name;

        return randomPaymentAdd;
    }

    function getRandomPaymentAddAvailability(PaymentAddAvailabilityModel) {
        var paymentAddAvailability = new PaymentAddAvailabilityModel();

        paymentAddAvailability.set({
            makePaymentAllowed                    : getRandomBoolean(),
            shouldDisplayCurrentBalanceDueMessage : getRandomBoolean(),
            shouldDisplayBankAccountSetupMessage  : getRandomBoolean(),
            shouldDisplayDirectDebitEnabledMessage: getRandomBoolean(),
            shouldDisplayOutstandingPaymentMessage: getRandomBoolean()
        });

        return paymentAddAvailability;
    }

    function getRandomPaymentUpdate(PaymentModel, BankModel) {
        var randomPaymentUpdate = new PaymentModel();

        randomPaymentUpdate.scheduledDate = getRandomDate(new Date(2012, 0, 1), new Date());
        randomPaymentUpdate.amount = getRandomNumberWithLength(5);
        randomPaymentUpdate.bankAccount = getRandomBank(BankModel).name;
        randomPaymentUpdate.id = getRandomStringThatIsAlphaNumeric(5);

        return randomPaymentUpdate;
    }

    function getRandomPostedTransaction(PostedTransactionModel) {
        var randomPostedTransaction = new PostedTransactionModel();

        randomPostedTransaction.set({
            transactionId        : getRandomStringThatIsAlphaNumeric(10),
            transactionDate      : getRandomDate(),
            postDate             : getRandomDate(),
            accountName          : getRandomStringThatIsAlphaNumeric(10),
            embossedAccountNumber: getRandomStringThatIsAlphaNumeric(10),
            embossedCardNumber   : getRandomStringThatIsAlphaNumeric(5),
            driverFirstName      : getRandomStringThatIsAlphaNumeric(10),
            driverMiddleName     : getRandomStringThatIsAlphaNumeric(10),
            driverLastName       : getRandomStringThatIsAlphaNumeric(10),
            customVehicleId      : getRandomStringThatIsAlphaNumeric(10),
            merchantBrand        : getRandomStringThatIsAlphaNumeric(10),
            merchantName         : getRandomStringThatIsAlphaNumeric(10),
            merchantAddress      : getRandomStringThatIsAlphaNumeric(10),
            merchantCity         : getRandomStringThatIsAlphaNumeric(10),
            merchantState        : getRandomStringThatIsAlphaNumeric(10),
            merchantZipCode      : getRandomStringThatIsAlphaNumeric(10),
            productDescription   : getRandomStringThatIsAlphaNumeric(10),
            grossCost            : getRandomNumber(1, 9999),
            netCost              : getRandomNumber(1, 9999)
        });

        return randomPostedTransaction;
    }

    function getRandomShippingCarrier(ShippingCarrierModel, ShippingMethodModel) {
        var shippingCarrier = new ShippingCarrierModel();

        shippingCarrier.set({
            id             : getRandomStringThatIsAlphaNumeric(5),
            name           : getRandomStringThatIsAlphaNumeric(10),
            default        : getRandomBoolean(),
            wexDefault     : getRandomBoolean(),
            shippingMethods: (function () {
                var shippingMethods = [],
                    shippingMethod,
                    numMethods = getRandomInteger(1, 5),
                    createdDefault = false;

                for (var i = 0; i < numMethods; ++i) {
                    shippingMethod = getRandomShippingMethod(ShippingMethodModel);

                    if (!createdDefault && getRandomBoolean()) {
                        shippingMethod.default = true;

                        createdDefault = true;
                    }
                    else {
                        shippingMethod.default = false;
                    }

                    shippingMethods.push(shippingMethod);
                }

                return shippingMethods;
            })()
        });

        return shippingCarrier;
    }

    function getRandomShippingMethod(ShippingMethodModel) {
        var shippingMethod = new ShippingMethodModel();

        shippingMethod.set({
            id          : getRandomStringThatIsAlphaNumeric(5),
            name        : getRandomStringThatIsAlphaNumeric(10),
            cost        : getRandomNumber(1, 10),
            poBoxAllowed: getRandomBoolean(),
            default     : getRandomBoolean()
        });

        return shippingMethod;
    }

    function getRandomStringThatIsAlphaNumeric(length) {
        var result = "";
        for (var i = length; i > 0; --i) {
            result += ALPHANUMERIC_CHARACTERS[Math.round(Math.random() * (ALPHANUMERIC_CHARACTERS.length - 1))];
        }

        return result;
    }

    function getRandomJsonString(length) {
        return JSON.stringify(getRandomStringThatIsAlphaNumeric(length));
    }

    function getRandomUser(UserModel, UserAccountModel, ONLINE_APPLICATION) {
        var user = new UserModel();

        user.set({
            brand            : getRandomStringThatIsAlphaNumeric(10),
            email            : getRandomStringThatIsAlphaNumeric(10),
            firstName        : getRandomStringThatIsAlphaNumeric(10),
            id               : getRandomStringThatIsAlphaNumeric(10),
            username         : getRandomStringThatIsAlphaNumeric(10),
            company          : getRandomUserAccount(UserAccountModel),
            billingCompany   : getRandomUserAccount(UserAccountModel),
            onlineApplication: getRandomOnlineApplication(ONLINE_APPLICATION)
        });

        return user;
    }

    function getRandomUserAccount(UserAccountModel) {
        var account = new UserAccountModel();

        account.set({
            accountId       : getRandomStringThatIsAlphaNumeric(10),
            accountNumber   : getRandomStringThatIsAlphaNumeric(10),
            name            : getRandomStringThatIsAlphaNumeric(10),
            wexAccountNumber: getRandomStringThatIsAlphaNumeric(5)
        });

        return account;
    }

    function getRandomValueFromArray(array) {
        return (_.isArray(array) && array.length > 0) ? array[getRandomInteger(0, array.length)] : null;
    }

    function getRandomValueFromMap(map) {
        return _.isObject(map) ? getRandomValueFromArray(_.values(map)) : null;
    }

    function getRandomVersionStatus(VersionStatusModel) {
        var versionStatus = new VersionStatusModel();

        versionStatus.set({
            status: getRandomStringThatIsAlphaNumeric(10)
        });

        return versionStatus;
    }

    function getRandomNotificationModel(NotificationModel) {
        var notification = new NotificationModel();

        notification.set({
            id      : getRandomStringThatIsAlphaNumeric(10),
            data    : getRandomJsonString(10),
            status  : getRandomStringThatIsAlphaNumeric(5),
            type    : getRandomStringThatIsAlphaNumeric(5)
        });

        return notification;
    }

    function provideCommonMockDependencies($provide, mocks, setter, exclusions) {
        mocks = _.omit(mocks, exclusions);
        _.merge(mocks, (setter || _.noop)(mocks));

        _.forOwn(mocks, function (mock, name) {
            $provide.value(name, mock);
        });
    }

    function provideCommonAppMockDependencies($provide, setter, exclusions) {
        var mocks = {
            LoginManager: jasmine.createSpyObj("LoginManager", ["logIn", "logOut"]),
            NotificationsManager: jasmine.createSpyObj("NotificationsManager", ["onReady", "enableNotifications", "rejectBanner", "rejectPrompt", "registerUserForNotifications"])
        };

        provideCommonMockDependencies($provide, mocks, setter, exclusions);
    }

    function provideCommonSharedMockDependencies($provide, setter, exclusions) {
        var mocks = {
            $cordovaSplashscreen: jasmine.createSpyObj("$cordovaSplashscreen", ["show", "hide"]),
            AnalyticsUtil: jasmine.createSpyObj("AnalyticsUtil", [
                "getActiveTrackerId",
                "hasActiveTracker",
                "setUserId",
                "startTracker",
                "trackView",
                "trackEvent"
            ]),
            LoadingIndicator: jasmine.createSpyObj("LoadingIndicator", ["begin", "complete"]),
            Logger: jasmine.createSpyObj("Logger", ["enabled", "debug", "error", "info", "isEnabled", "log", "warn"]),
            PlatformUtil: jasmine.createSpyObj("PlatformUtil", [
                "getPlatform",
                "platformHasCordova",
                "platformSupportsAppVersion",
                "waitForCordovaPlatform",
                "isOnline"
            ]),
            SecureStorage: jasmine.createSpyObj("SecureStorage", ["isAvailable", "set", "get", "remove"]),
            UrbanAirship: jasmine.createSpyObj("UrbanAirship", ["ready"])
        };

        mocks.PlatformUtil.waitForCordovaPlatform.and.returnValue(rejectedPromise("Cordova disabled by default."));

        provideCommonMockDependencies($provide, mocks, setter, exclusions);
    }

    function resetMock(mock) {
        var isMock = function (object) {
            return _.isFunction(_.get(object, "calls.reset"));
        };

        if (isMock(mock)) {
            //reset the call record
            mock.calls.reset();
        }
        else {
            //look for mocked properties
            for(var property in mock) {
                var value = mock[property];

                if (isMock(value)) {
                    value.calls.reset();
                }
            }
        }
    }

    function setFeatureFlagEnabled(globals, featureFlag, enabled) {
        globals.FEATURE_FLAGS[featureFlag] = !!enabled;
    }

    function setFeatureFlagsEnabled(globals, enabled) {
        for(var featureFlag in globals.FEATURE_FLAGS) {
            setFeatureFlagEnabled(globals, featureFlag, enabled);
        }
    }

})();

module.exports = TestUtils;
