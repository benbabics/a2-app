(function () {
    "use strict";

    function groupTransactionsByDate(_) {
      var dividers = {};

      return function(input, dateKeyName) {
        var previousDate, currentDate;

        dateKeyName = dateKeyName || 'postDate';

        if ( !input || !_.isArray(input) ) return;
        var clone = _.clone( input );

        for (var i = 0, len = clone.length; i < len; i++) {
          var item = clone[i],
              isGreek = item.isGreekLoading;

          currentDate = moment( item[ dateKeyName ] );

          if ( !isGreek && (!previousDate || previousDate.format() != currentDate.format()) ) {
            item.hasDivider   = true;
            item.renderHeight = 151;
            item.displayDate  = item[ dateKeyName ];
          }
          else {
            item.renderHeight = 114;
          }

          previousDate = currentDate;
        }

        return clone;
      };
    }

    angular.module("app.components.transaction")
        .filter("groupTransactionsByDate", groupTransactionsByDate);
})();
