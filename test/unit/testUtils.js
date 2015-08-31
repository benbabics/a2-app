"use strict";

/* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

var TestUtils = (function () {

    var ALPHANUMERIC_CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        TestUtils = {
            getRandomBank                    : getRandomBank,
            getRandomBoolean                 : getRandomBoolean,
            getRandomDate                    : getRandomDate,
            getRandomInteger                 : getRandomInteger,
            getRandomNumber                  : getRandomNumber,
            getRandomNumberWithLength        : getRandomNumberWithLength,
            getRandomPayment                 : getRandomPayment,
            getRandomPaymentAdd              : getRandomPaymentAdd,
            getRandomPaymentUpdate           : getRandomPaymentUpdate,
            getRandomStringThatIsAlphaNumeric: getRandomStringThatIsAlphaNumeric,
            getRandomValueFromArray          : getRandomValueFromArray,
            getRandomValueFromMap            : getRandomValueFromMap
        };

    return TestUtils;

    //////////////////////

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

    function getRandomStringThatIsAlphaNumeric(length) {
        var result = "";
        for (var i = length; i > 0; --i) {
            result += ALPHANUMERIC_CHARACTERS[Math.round(Math.random() * (ALPHANUMERIC_CHARACTERS.length - 1))];
        }

        return result;
    }

    function getRandomValueFromArray(array) {
        return array ? array[getRandomInteger(0, array.length)] : null;
    }

    function getRandomValueFromMap(map) {
        return map ? getRandomValueFromArray(_.values(map)) : null;
    }

})();

module.exports = TestUtils;
