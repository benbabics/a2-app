(function () {
    "use strict";

    function groupTransactionsByDate(_) {
      var dividers = {};

      return function(input) {
        var previousDate, currentDate;

        if ( !input || !_.isArray(input) ) return;
        var clone = _.clone( input );

        for (var i = 0, len = clone.length; i < len; i++) {
          var item = clone[i];
          currentDate = moment( item.postDate );

          if ( !previousDate || previousDate.format() != currentDate.format() ) {
            item.hasDivider   = true;
            item.renderHeight = 171;
          }
          else {
            item.renderHeight = 134;
          }

          previousDate = currentDate;
        }

        return clone;
      };
    }

    angular.module("app.components.transaction")
        .filter("groupTransactionsByDate", groupTransactionsByDate);
})();
