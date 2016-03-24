(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    function wexNotificationBar(_, $timeout, ElementUtil, FlowUtil) {
        var directive = {
            restrict   : "E",
            transclude : true,
            link       : link,
            scope      : {
                text     : "@",
                subtext  : "@",
                closeable: "=",
                ngIf     : "&?"
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

        function getBarType() {
            return ElementUtil.pageHasNavBar() ? "subheader" : "header";
        }

        function link(scope, elem) {
            //private members:
            var initialState,
                removeListeners = [],
                onViewEntering = function (toState) {
                    if (!initialState || toState === initialState) {
                        //add the bar to the new view (if visible)
                        scope.setVisible(scope.ngIf(), ElementUtil.getFocusedView());

                        initialState = toState;
                    }
                },
                onViewLeaving = function (fromState) {
                    if (fromState === initialState) {
                        //remove the bar from the old view
                        scope.setVisible(false, ElementUtil.getFocusedView());
                    }
                };

            //public members:
            //the ion-header-bar element
            scope.barElem = elem.children();

            //functions
            scope.close = _.bind(close, scope);
            scope.setVisible = _.bind(setVisible, scope, _, undefined);
            scope.setSubheader = _.bind(setSubheader, scope, _);

            //watchers
            scope.$watch(ElementUtil.pageHasNavBar, scope.setSubheader);
            scope.$watch(scope.ngIf, scope.setVisible);

            //event listeners
            removeListeners.concat(FlowUtil.onPageEnter(onViewEntering, scope, {once: false}));
            removeListeners.concat(FlowUtil.onPageLeave(onViewLeaving, scope, {once: false}));
            scope.$on("$destroy", function () {
                _.invoke(removeListeners, _.call);

                onViewLeaving(initialState);
            });
        }

        return directive;
    }

    angular.module("app.shared.widgets")
        .directive("wexNotificationBar", wexNotificationBar);
}());
