"use strict";

/* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

var TestUtils = (function () {

    var ALPHANUMERIC_CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        TestUtils = {
            getRandomBank                    : getRandomBank,
            getRandomNumber                  : getRandomNumber,
            getRandomPayment                 : getRandomPayment,
            getRandomStringThatIsAlphaNumeric: getRandomStringThatIsAlphaNumeric
        };

    return TestUtils;

    //////////////////////

    function getRandomBank(BankModel) {
        var randomBank = new BankModel();

        randomBank.id = getRandomNumber(5);
        randomBank.defaultBank = getRandomBoolean();
        randomBank.name = getRandomStringThatIsAlphaNumeric(5);
        randomBank.restangularized = true;

        return randomBank;
    }

    function getRandomBoolean() {
        return Math.random() >= 0.5;
    }

    function getRandomNumber(length) {
        return (Math.random() + 1).toString().substr(2, length);
    }

    function getRandomPayment(PaymentModel, BankModel) {
        var randomPayment = new PaymentModel();

        randomPayment.id = getRandomNumber(5);
        randomPayment.scheduledDate = getRandomNumber(13);
        randomPayment.amount = getRandomNumber(5);
        randomPayment.bankAccount = getRandomBank(BankModel);
        randomPayment.status = getRandomStringThatIsAlphaNumeric(5);
        randomPayment.confirmationNumber = getRandomStringThatIsAlphaNumeric(5);
        randomPayment.restangularized = true;

        return randomPayment;
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
