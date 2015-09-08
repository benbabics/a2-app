"use strict";

/* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

var TestUtils = (function () {

    var ALPHANUMERIC_CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        TestUtils = {
            getRandomAccount                 : getRandomAccount,
            getRandomBank                    : getRandomBank,
            getRandomBoolean                 : getRandomBoolean,
            getRandomDate                    : getRandomDate,
            getRandomInteger                 : getRandomInteger,
            getRandomInvoiceSummary          : getRandomInvoiceSummary,
            getRandomNumber                  : getRandomNumber,
            getRandomNumberWithLength        : getRandomNumberWithLength,
            getRandomPayment                 : getRandomPayment,
            getRandomPaymentAdd              : getRandomPaymentAdd,
            getRandomPaymentUpdate           : getRandomPaymentUpdate,
            getRandomPostedTransaction       : getRandomPostedTransaction,
            getRandomStringThatIsAlphaNumeric: getRandomStringThatIsAlphaNumeric,
            getRandomUser                    : getRandomUser,
            getRandomValueFromArray          : getRandomValueFromArray,
            getRandomValueFromMap            : getRandomValueFromMap
        };

    return TestUtils;

    //////////////////////

    function getRandomAccount(AccountModel) {
        var account = new AccountModel();

        account.set({
            accountId    : getRandomStringThatIsAlphaNumeric(10),
            accountNumber: getRandomStringThatIsAlphaNumeric(10),
            name         : getRandomStringThatIsAlphaNumeric(10)
        });

        return account;
    }

    function getRandomBank(BankModel) {
        var randomBank = new BankModel();

        randomBank.id = getRandomNumberWithLength(5);
        randomBank.defaultBank = getRandomBoolean();
        randomBank.name = getRandomStringThatIsAlphaNumeric(5);
        randomBank.restangularized = true;

        return randomBank;
    }

    function getRandomBoolean() {
        return Math.random() >= 0.5;
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
            transactionId     : getRandomStringThatIsAlphaNumeric(10),
            transactionDate   : getRandomDate(),
            postDate          : getRandomDate(),
            accountNumber     : getRandomStringThatIsAlphaNumeric(10),
            accountName       : getRandomStringThatIsAlphaNumeric(10),
            cardNumber        : getRandomStringThatIsAlphaNumeric(10),
            driverFirstName   : getRandomStringThatIsAlphaNumeric(10),
            driverMiddleName  : getRandomStringThatIsAlphaNumeric(10),
            driverLastName    : getRandomStringThatIsAlphaNumeric(10),
            customVehicleId   : getRandomStringThatIsAlphaNumeric(10),
            merchantBrand     : getRandomStringThatIsAlphaNumeric(10),
            merchantName      : getRandomStringThatIsAlphaNumeric(10),
            merchantAddress   : getRandomStringThatIsAlphaNumeric(10),
            merchantCity      : getRandomStringThatIsAlphaNumeric(10),
            merchantState     : getRandomStringThatIsAlphaNumeric(10),
            merchantZipCode   : getRandomStringThatIsAlphaNumeric(10),
            productDescription: getRandomStringThatIsAlphaNumeric(10),
            grossCost         : getRandomNumber(1, 9999),
            netCost           : getRandomNumber(1, 9999)
        });

        return randomPostedTransaction;
    }

    function getRandomStringThatIsAlphaNumeric(length) {
        var result = "";
        for (var i = length; i > 0; --i) {
            result += ALPHANUMERIC_CHARACTERS[Math.round(Math.random() * (ALPHANUMERIC_CHARACTERS.length - 1))];
        }

        return result;
    }

    function getRandomUser(UserModel, AccountModel) {
        var user = new UserModel();

        user.set({
            email         : getRandomStringThatIsAlphaNumeric(10),
            firstName     : getRandomStringThatIsAlphaNumeric(10),
            username      : getRandomStringThatIsAlphaNumeric(10),
            company       : getRandomAccount(AccountModel),
            billingCompany: getRandomAccount(AccountModel)
        });

        return user;
    }

    function getRandomValueFromArray(array) {
        return array ? array[getRandomInteger(0, array.length)] : null;
    }

    function getRandomValueFromMap(map) {
        return map ? getRandomValueFromArray(_.values(map)) : null;
    }

})();

module.exports = TestUtils;
