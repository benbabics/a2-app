(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    // jshint maxparams:5
    function wexNotificationBar($rootScope, $compile, $window, $timeout, CommonService) {
        var directive = {
                restrict: "E",
                transclude: true,
                link: link,
                scope: {
                    text: "@",
                    closeable: "=",
                    ngIf: "="
                },
                templateUrl: "app/shared/widgets/templates/notificationBar.directive.html"
            },
            _ = CommonService._;

        function close() {
            var self = this;

            self.setVisible(false);

            $timeout(function () {
                self.$emit("notificationBar:bannerClosed");
            });
        }

        function setSubheader(subheader) {
            if (subheader) {
                this.barElem.addClass("bar-subheader");
            }
            else {
                this.barElem.removeClass("bar-subheader");
                this.barElem.addClass("bar-header");
            }
        }

        //sets either has-header or has-subheader (based on the bar type) on the active ion-content element if true
        function setVisible(visible, viewElem) {
            viewElem = viewElem || CommonService.getActiveNavView();
            var contentElem = angular.element(viewElem.find("ion-content")),
                hasBarClass = "has-" + getBarType(),
                lastBarClass;

            if (contentElem) {
                lastBarClass = contentElem.attr("notification-bar-class");
                //remove the last bar class that was set on the element
                if (lastBarClass) {
                    contentElem.removeClass(lastBarClass);
                }

                if (visible) {
                    //add the new bar class to the element
                    contentElem.addClass(hasBarClass);
                    contentElem.attr("notification-bar-class", hasBarClass);
                }
                else {
                    contentElem.removeAttr("notification-bar-class");
                }
            }
        }

        function onViewLeaving() {
            //remove the bar from the old view
            this.setVisible(false, CommonService.getFocusedView());
        }

        function onViewEntering() {
            //add the bar to the new view
            this.setVisible(this.ngIf, CommonService.getFocusedView());
        }

        function getBarType() {
            return CommonService.pageHasNavBar() ? "subheader" : "header";
        }

        function deregisterEventListeners() {

            _.each(this.listenerDestroyers, function (deregister) {
                deregister();
            });
        }

        function link(scope, elem) {
            //public members:
            //the ion-header-bar element
            scope.barElem = elem.children();
            //the default header bar title size for data-fittext-max
            scope.titleSize = $window.getComputedStyle(elem[0], null).getPropertyValue("font-size");
            //all deregister functions for event listeners
            scope.listenerDestroyers = [];

            //functions
            scope.close = _.bind(close, scope);
            scope.setVisible = _.bind(setVisible, scope, _, undefined);
            scope.setSubheader = _.bind(setSubheader, scope, _);
            scope.onViewLeaving = _.bind(onViewLeaving, scope);
            scope.onViewEntering = _.bind(onViewEntering, scope);
            scope.deregisterEventListeners = _.bind(deregisterEventListeners, scope);

            //watchers
            scope.$watch(CommonService.pageHasNavBar, scope.setSubheader);
            scope.$watch("ngIf", scope.setVisible);

            //event listeners
            scope.listenerDestroyers.push($rootScope.$on("$ionicView.beforeLeave", scope.onViewLeaving));
            scope.listenerDestroyers.push($rootScope.$on("$ionicView.afterEnter", scope.onViewEntering));
            scope.$on("$destroy", scope.deregisterEventListeners);
            scope.$on("$destroy", _.partial(scope.setVisible, false));

            //note: title must be compiled here instead of in the template file or else ngFitText won't work properly
            var titleNode = $compile([
                "<h1 class='title'>",
                "<span class='title-text' data-fittext data-fittext-max='{{titleSize}}'>",
                "&nbsp;{{text}}",
                "</span>",
                "</h1>"
            ].join(""))(scope);

            scope.barElem.append(titleNode);
        }

        return directive;
    }

    angular.module("app.shared.widgets")
        .directive("wexNotificationBar", wexNotificationBar);
}());
