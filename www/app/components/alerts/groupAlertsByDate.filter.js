(function () {
    "use strict";

    function groupAlertsByDate(_, moment) {

        return function (input, dateKeyName) {
            var previousDate, currentDate;

            dateKeyName = dateKeyName || "authorizationDate";

            if (!input || !_.isArray(input)) {
                return;
            }

            var clone = _.clone(input);

            for (var i = 0, len = clone.length; i < len; i++) {
                var item = clone[i],
                    isGreek = item.isGreekLoading,
                    displayDate = _.get(item, dateKeyName);

                currentDate = moment(displayDate).startOf("day");

                if (!isGreek && (!previousDate || !previousDate.isSame(currentDate))) {
                    item.hasDivider = true;
                    item.renderHeight = 142;
                    item.displayDate = displayDate;
                }
                else {
                    item.renderHeight = 114;
                }

                previousDate = currentDate;
            }

            return clone;
        };
    }

    angular.module("app.components.alerts")
        .filter("groupAlertsByDate", groupAlertsByDate);
})();
