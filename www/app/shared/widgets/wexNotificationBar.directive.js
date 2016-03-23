(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    function wexNotificationBar(_, $rootScope, $timeout, ElementUtil) {
        var directive = {
            restrict   : "E",
            transclude : true,
            link       : link,
            scope      : {
                text     : "@",
                subtext  : "@",
                closeable: "=",
                ngIf     : "="
            },
            templateUrl: "app/shared/widgets/templates/notificationBar.directive.html"
        };

        function close() {
            var self = this;

            self.setVisible(false);

            $timeout(function () {
                self.$emit("notificationBar:closed");
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
            viewElem = viewElem || ElementUtil.getActiveNavView();
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
            this.setVisible(false, ElementUtil.getFocusedView());
        }

        function onViewEntering() {
            //add the bar to the new view
            this.setVisible(this.ngIf, ElementUtil.getFocusedView());
        }

        function getBarType() {
            return ElementUtil.pageHasNavBar() ? "subheader" : "header";
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
            scope.$watch(ElementUtil.pageHasNavBar, scope.setSubheader);
            scope.$watch("ngIf", scope.setVisible);

            //event listeners
            scope.listenerDestroyers.push($rootScope.$on("$ionicView.beforeLeave", scope.onViewLeaving));
            scope.listenerDestroyers.push($rootScope.$on("$ionicView.afterEnter", scope.onViewEntering));
            scope.$on("$destroy", scope.deregisterEventListeners);
            scope.$on("$destroy", _.partial(scope.setVisible, false));
        }

        return directive;
    }

    angular.module("app.shared.widgets")
        .directive("wexNotificationBar", wexNotificationBar);
}());
