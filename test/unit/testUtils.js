"use strict";

/* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll
// jshint maxparams:6

var TestUtils = (function () {

    var ALPHANUMERIC_CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        TestUtils = {
            digestError                       : digestError,
            getRandomAccount                  : getRandomAccount,
            getRandomAddress                  : getRandomAddress,
            getRandomBank                     : getRandomBank,
            getRandomBoolean                  : getRandomBoolean,
            getRandomBrandAsset               : getRandomBrandAsset,
            getRandomBrandAssets              : getRandomBrandAssets,
            getRandomCard                     : getRandomCard,
            getRandomCardReissueDetails       : getRandomCardReissueDetails,
            getRandomDate                     : getRandomDate,
            getRandomInteger                  : getRandomInteger,
            getRandomInvoiceSummary           : getRandomInvoiceSummary,
            getRandomPaymentMaintenanceDetails: getRandomPaymentMaintenanceDetails,
            getRandomNumber                   : getRandomNumber,
            getRandomNumberWithLength         : getRandomNumberWithLength,
            getRandomOnlineApplication        : getRandomOnlineApplication,
            getRandomPayment                  : getRandomPayment,
            getRandomPaymentAdd               : getRandomPaymentAdd,
            getRandomPaymentUpdate            : getRandomPaymentUpdate,
            getRandomPostedTransaction        : getRandomPostedTransaction,
            getRandomShippingCarrier          : getRandomShippingCarrier,
            getRandomShippingMethod           : getRandomShippingMethod,
            getRandomStringThatIsAlphaNumeric : getRandomStringThatIsAlphaNumeric,
            getRandomUser                     : getRandomUser,
            getRandomUserAccount              : getRandomUserAccount,
            getRandomValueFromArray           : getRandomValueFromArray,
            getRandomValueFromMap             : getRandomValueFromMap
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
        var brandAssets = [],
            numBrandAssets = getRandomInteger(1, 20);

        for (var i = 0; i < numBrandAssets; ++i) {
            brandAssets.push(getRandomBrandAsset(BrandAssetModel));
        }

        return brandAssets;
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

    function getRandomPaymentMaintenanceDetails(PaymentMaintenanceDetailsModel, STATES) {
        var paymentMaintenanceDetails = new PaymentMaintenanceDetailsModel();

        paymentMaintenanceDetails.set({
            state: getRandomValueFromMap(STATES)
        });

        return paymentMaintenanceDetails;
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

})();

module.exports = TestUtils;
