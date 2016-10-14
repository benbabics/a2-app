(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    function wexNotificationBar(_, $state, $timeout, ElementUtil, FlowUtil) {
        var directive = {
            restrict   : "E",
            transclude : true,
            link       : link,
            scope      : {
                text     : "@",
                subtext  : "@?",
                closeable: "=?",
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

        function getHighestPriorityBanner(options) {
            var container = options.global ? angular.element(document.body) : ElementUtil.getFocusedView();

            if (_.get(container, "length", 0) > 0) {
                return _(container[0].querySelectorAll("wex-notification-bar"))
                    .map(_.partial(angular.element, _))
                    .invokeMap("isolateScope")
                    .filter(function (banner) {
                        return banner && banner.ngIf() && (!options.global || banner.isGlobalBar());
                    })
                    .sortBy("priority")
                    .head();
            }
            else {
                return null;
            }
        }

        function isGlobalBar() {
            var navView = ElementUtil.getActiveNavView();

            //a notification bar is considered global if it is not contained within the nav-view
            return (!navView || !navView[0].contains(this.barElem[0]));
        }

        function isHighestPriority() {
            //global banners always take priority over page banners
            return (getHighestPriorityBanner({global: true}) || getHighestPriorityBanner({global: false})) === this;
        }

        function isVisible() {
            return this.ngIf() && !this.barElem.hasClass("hide");
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
            var contentElem = ElementUtil.getViewContent(viewElem),
                hasBarClass = "has-" + getBarType(),
                lastBarClass;

            if (contentElem) {
                lastBarClass = contentElem.attr("notification-bar-class");
                //remove the last bar class that was set on the element
                if (lastBarClass) {
                    contentElem.removeClass(lastBarClass);
                }

                if (visible) {
                    this.barElem.removeClass("hide");

                    //add the new bar class to the element
                    contentElem.addClass(hasBarClass);
                    contentElem.attr("notification-bar-class", hasBarClass);
                }
                else {
                    this.barElem.addClass("hide");

                    contentElem.removeAttr("notification-bar-class");
                }
            }
        }

        function shouldBeVisible() {
            return _.every([
                this.ngIf(),
                this.isGlobalBar() || this.initialState === $state.current.name,
                this.isHighestPriority()
            ]);
        }

        function getBarType() {
            return ElementUtil.pageHasNavBar() ? "subheader" : "header";
        }

        function link(scope, elem, attrs) {
            //private members:
            var VISIBILITY_CHECK_DELAY = 200, //ms
                removeListeners = [],
                onViewEntering = function (toState) {
                    if (!scope.isGlobalBar() && !scope.initialState) {
                        //set the initial state of the banner (unless it's global)
                        scope.initialState = toState;
                    }
                };

            //public members:
            //the ion-header-bar element
            scope.barElem = elem.children();
            scope.priority = _.toNumber(_.get(attrs, "priority", 0));

            //functions
            scope.close = _.bind(close, scope);
            scope.ngIf = _.get(scope, "ngIf", _.constant(true));
            scope.isGlobalBar = _.bind(isGlobalBar, scope);
            scope.isHighestPriority = _.bind(isHighestPriority, scope);
            scope.isVisible = _.bind(isVisible, scope);
            scope.setVisible = _.bind(setVisible, scope, _, undefined);
            scope.setSubheader = _.bind(setSubheader, scope, _);
            scope.shouldBeVisible = _.bind(shouldBeVisible, scope);

            //watchers
            scope.$watch(ElementUtil.pageHasNavBar, scope.setSubheader);
            scope.$watch(_.throttle(scope.shouldBeVisible, VISIBILITY_CHECK_DELAY), scope.setVisible);

            //event listeners
            removeListeners.concat(FlowUtil.onPageEnter(onViewEntering, scope, {once: false}));
            scope.$on("$destroy", function () {
                _.invokeMap(removeListeners, _.call);

                scope.setVisible(false);
            });
        }

        return directive;
    }

    angular.module("app.shared.widgets")
        .directive("wexNotificationBar", wexNotificationBar);
}());
