(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    function wexNotificationBar(_, $rootScope, $timeout, ElementUtil) {
        var EVENT_PRIORITY_CHANGE = "wexNotificationBar:priorityChange",
            banners = [];

        var directive = {
            restrict   : "E",
            transclude : true,
            link       : link,
            scope      : {
                text     : "@",
                closeable: "=?"
            },
            templateUrl: "app/shared/widgets/templates/notificationBar.directive.html"
        };

        activate();
        /////////////////////
        //Public functions:

        function isGlobalBar() {
            var navView = ElementUtil.getActiveNavView();

            //a notification bar is considered global if it is not contained within the nav-view
            return (!navView || !navView[0].contains(this.barElem[0]));
        }

        function isVisible() {
            return !this.barElem.hasClass("hide");
        }

        function remove() {
            _.remove(banners, this);

            $timeout(() => this.$emit("notificationBar:closed"));

            this.setVisible(false);
            updateBanners();
        }

        function setSubheader(subheader) {
            if (subheader) {
                this.barElem.addClass("bar-subheader");
            }
            else {
                this.barElem.removeClass("bar-subheader");
                this.barElem.addClass("bar-header");
            }

            //update the content classes if this is the active banner
            if (this.isVisible()) {
                applyContentClass(true);
            }
        }

        function setVisible(visible) {
            if (visible) {
                this.barElem.removeClass("hide");
            }
            else {
                this.barElem.addClass("hide");
            }
        }
        /////////////////////
        //Private functions:

        function activate() {
            $rootScope.$on(EVENT_PRIORITY_CHANGE, function () {
                //global banners always take priority over page banners
                var highestPriorityBanner = getHighestPriorityBanner({global: true}) || getHighestPriorityBanner({global: false});

                banners.forEach((banner) => banner.setVisible(banner === highestPriorityBanner));

                applyContentClass(highestPriorityBanner);
            });
        }

        //set either has-header or has-subheader on the active ion-content element if banner is visible
        function applyContentClass(visible) {
            var contentElem = ElementUtil.getViewContent(),
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

        function getHighestPriorityBanner(options) {
            return _(banners)
                .filter(function (banner) {
                    return banner && (!options.global || banner.isGlobalBar());
                })
                .sortBy("priority")
                .head();
        }

        function link(scope, elem, attrs) {

            banners.push(scope);

            //public members:
            //the ion-header-bar element
            scope.barElem = elem.children();
            scope.priority = _.toNumber(_.get(attrs, "priority", 0));

            //functions
            scope.isGlobalBar = _.bind(isGlobalBar, scope);
            scope.isVisible = _.bind(isVisible, scope);
            scope.remove = _.bind(remove, scope);
            scope.setVisible = _.bind(setVisible, scope, _, undefined);
            scope.setSubheader = _.bind(setSubheader, scope, _);

            //watchers
            scope.$watch(ElementUtil.pageHasNavBar, scope.setSubheader);
            scope.$watch("priority", updateBanners);
            scope.$watch( "text", val => scope.textIsLong = val && val.length >= 30 );

            //event listeners
            scope.$on("$destroy", scope.remove);

            updateBanners();
        }

        function updateBanners() {
            $rootScope.$broadcast("wexNotificationBar:priorityChange");
        }

        return directive;
    }

    angular.module("app.shared.widgets")
        .directive("wexNotificationBar", wexNotificationBar);
}());
