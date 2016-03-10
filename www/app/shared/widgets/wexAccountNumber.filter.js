(function () {
    "use strict";

    /* @ngInject */
    function wexAccountNumber(_) {

        return function (item) {
            var accountNumber = "";

            if (!_.isEmpty(item)) {
                // Replace all but the last 4 characters with *
                accountNumber = item.replace(/.(?=.{4})/g, "*");
            }

            return accountNumber;
        };
    }

    angular
        .module("app.shared.widgets")
        .filter("wexAccountNumber", wexAccountNumber);
})();
