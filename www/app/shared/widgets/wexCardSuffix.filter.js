(function () {
    "use strict";

    /* @ngInject */
    function wexCardSuffix(CommonService) {

        var _ = CommonService._;

        return function (item) {
            var cardSuffix = "";

            if (!_.isEmpty(item)) {
                cardSuffix = item.substr(0, 4) + "-" + item.substr(4, 1);
            }

            return cardSuffix;
        };
    }

    angular
        .module("app.shared.widgets")
        .filter("wexCardSuffix", wexCardSuffix);
})();
