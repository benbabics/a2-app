(function () {
    "use strict";

    function groupAlertsByDate(_, moment) {

        return function (input, dateKeyName) {
            var previousDate, currentDate;

            dateKeyName = dateKeyName || "postDate";

            if (!input || !_.isArray(input)) {
                return;
            }

            var clone = _.clone(input);

            for (var i = 0, len = clone.length; i < len; i++) {
                var item = clone[i],
                    isGreek = item.isGreekLoading;

                currentDate = moment(item[dateKeyName]).startOf("day");

                if (!isGreek && (!previousDate || !previousDate.isSame(currentDate))) {
                    item.hasDivider = true;
                    item.renderHeight = 151;
                    item.displayDate = item[dateKeyName];
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
