(function () {
    "use strict";

    /* @ngInject */
    function wexSuperText($sce) {
        return function(text, delimiter, displayDelimiter) {
            var segments, delimiterChar;

            delimiter        = delimiter || ".";
            segments         = text.split( delimiter );
            displayDelimiter = displayDelimiter || false;
            delimiterChar    = displayDelimiter ? delimiter : "";

            if ( segments[1] !== "" ) {
                text = segments[0] + "<sup>" + delimiterChar + segments[1] + "</sup>";
                text = $sce.trustAsHtml( text );
            }

            return text;
        };
    }

    angular
        .module("app.shared.widgets")
        .filter("wexSuperText", wexSuperText);
})();
