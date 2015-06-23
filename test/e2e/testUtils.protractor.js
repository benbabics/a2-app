"use strict";

/* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

var _ = require("lodash");

var TestUtils = (function () {

    var TestUtils = {
        hasClass: hasClass,
        waitForElementRemoval: waitForElementRemoval,
        waitForElementHiding: waitForElementHiding
    };

    return TestUtils;

    //////////////////////

    function hasClass(element, cls) {
        return element.getAttribute("class")
            .then(function (classes) {
                return classes.split(" ").indexOf(cls) !== -1;
            });
    }

    function waitForElementRemoval(testElement, waitTimeout) {
        return browser.wait(function () {
            var deferred = protractor.promise.defer();

            testElement.isPresent()
                .then(function (isPresent) {
                    deferred.fulfill(!isPresent);
                });

            return deferred.promise;
        }, waitTimeout);
    }

    function waitForElementHiding(testElement, waitTimeout) {
        return browser.wait(function () {
            var deferred = protractor.promise.defer();

            testElement.isDisplayed()
                .then(function (isDisplayed) {
                    deferred.fulfill(!isDisplayed);
                });

            return deferred.promise;
        }, waitTimeout);
    }

})();

module.exports = TestUtils;
