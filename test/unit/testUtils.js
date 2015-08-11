"use strict";

/* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

var TestUtils = (function () {

    var ALPHANUMERIC_CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        TestUtils = {
            getRandomBank                    : getRandomBank,
            getRandomInteger: getRandomInteger,
            getRandomNumber                  : getRandomNumber,
            getRandomNumberWithLength: getRandomNumberWithLength,
            getRandomPayment                 : getRandomPayment,
            getRandomPaymentAdd              : getRandomPaymentAdd,
            getRandomStringThatIsAlphaNumeric: getRandomStringThatIsAlphaNumeric
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

        randomPayment.id = getRandomNumberWithLength(5);
        randomPayment.scheduledDate = getRandomNumberWithLength(13);
        randomPayment.amount = getRandomNumberWithLength(5);
        randomPayment.bankAccount = getRandomBank(BankModel);
        randomPayment.status = getRandomStringThatIsAlphaNumeric(5);
        randomPayment.confirmationNumber = getRandomStringThatIsAlphaNumeric(5);
        randomPayment.restangularized = true;

        return randomPayment;
    }

    function getRandomPaymentAdd(PaymentModel, BankModel) {
        var randomPaymentAdd = new PaymentModel();

        randomPaymentAdd.scheduledDate = getRandomNumberWithLength(13);
        randomPaymentAdd.amount = getRandomNumberWithLength(5);
        randomPaymentAdd.bankAccount = getRandomBank(BankModel).name;

        return randomPaymentAdd;
    }

    function getRandomStringThatIsAlphaNumeric(length) {
        var result = "";
        for (var i = length; i > 0; --i) {
            result += ALPHANUMERIC_CHARACTERS[Math.round(Math.random() * (ALPHANUMERIC_CHARACTERS.length - 1))];
        }

        return result;
    }

})();

module.exports = TestUtils;
