(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexBarButton() {
      return {
        restrict:    "E",
        require:     "?ngModel",
        replace:     true,
        transclude:  true,
        templateUrl: "app/shared/widgets/templates/wexBarButton.directive.html",
        compile: compileFn
      }

      function compileFn(element, attrs) {
        var $input = element.find( 'input' );

        if ( attrs.icon ) {
          element.children().eq(2).removeClass( 'ion-checkmark' ).addClass( attrs.icon );
        }

        angular.forEach({
          'name':        attrs.name,
          'value':       attrs.value,
          'disabled':    attrs.disabled,
          'ng-value':    attrs.ngValue,
          'ng-model':    attrs.ngModel,
          'ng-disabled': attrs.ngDisabled,
          'ng-change':   attrs.ngChange
        },
        function(value, name) {
          if ( angular.isDefined(value) ) {
            $input.attr( name, value );
          }
        });

        return function(scope, element, attrs) {
          scope.getValue = function() {
            return scope.ngValue || attrs.value;
          };
        };
      }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexBarButton", wexBarButton);
})();
