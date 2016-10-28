(function () {
    "use strict";

    describe("A WEX Notification Bar directive", function () {

        var $compile,
            $rootScope,
            $scope,
            $state,
            ElementUtil,
            bar,
            body,
            activeNavView,
            activeView,
            activeContent,
            pageHasNavBar = true,
            mockTitleText,
            mockChildText;

        beforeAll(function () {
            this.includeAppDependencies = false;
            this.includeHtml = true;
        });

        beforeEach(function () {
            //mock dependencies
            ElementUtil = jasmine.createSpyObj("ElementUtil", [
                "getActiveNavView",
                "getFocusedView",
                "getViewContent",
                "pageHasNavBar"
            ]);

            module(function ($provide) {
                $provide.value("ElementUtil", ElementUtil);
            });

            inject(function (_$rootScope_, _$compile_, _$state_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $scope = $rootScope.$new();
                $state = _$state_;

                activeNavView = $compile("<ion-nav-view></ion-nav-view>")($scope);
                activeView = $compile("<ion-view nav-view='active'></ion-view>")($scope);
                activeContent = $compile("<ion-content></ion-content>")($scope);
                body = angular.element(document.body);

                activeView.append(activeContent);
                activeNavView.append(activeView);

                $scope.$digest();

                ElementUtil.getActiveNavView.and.returnValue(activeNavView);
                ElementUtil.getFocusedView.and.returnValue(activeView);
                ElementUtil.getViewContent.and.returnValue(activeContent);
                ElementUtil.pageHasNavBar.and.callFake(function () {
                    return pageHasNavBar;
                });

                mockTitleText = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                mockChildText = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                $scope.ngIf = true;
            });

            spyOn(_, "throttle").and.callFake(function (func) {
                return function () {
                    return func.apply(this, arguments);
                };
            });
        });

        afterEach(function () {
            activeContent.removeClass("has-header");
            activeContent.removeClass("has-subheader");

            if (bar) {
                bar.remove();
            }
        });

        describe("creates a header bar that", function () {

            beforeEach(function () {
                bar = createWexNotificationBar({
                    text: mockTitleText,
                    content: mockChildText
                });
            });

            it("should exist", function () {
                expect(bar).toBeDefined();
            });

            it("should have a ion-header-bar", function () {
                expect(bar.find("ion-header-bar")).toBeDefined();
            });

            it("should have a header class", function () {
                expect(bar.find("ion-header-bar").hasClass("bar-header")).toBeTruthy();
            });

            it("should have the transcluded child content", function () {
                expect(bar.find("ion-header-bar").html()).toContain(mockChildText);
            });

            it("should add the banner from the list of banners", function () {
                //TODO - Figure out how to test this
            });

            describe("has a title that", function () {
                var title;

                beforeEach(function () {
                    title = bar.find("h1");
                });

                it("should exist", function () {
                    expect(title).toBeDefined();
                });

                it("should contain the title text", function () {
                    expect(title.text()).toContain(mockTitleText);
                });
            });

            describe("when visible", function () {

                beforeEach(function () {
                    bar.isolateScope().setVisible(true);
                    $rootScope.$digest();
                });

                describe("should behave such that", testBarVisible);
            });

            describe("when not visible", function () {

                beforeEach(function () {
                    bar.isolateScope().remove();

                    $rootScope.$digest();
                });

                it("should NOT apply the has-header class to the active ion-content", function () {
                    expect(activeContent.hasClass("has-header")).toBeFalsy();
                });

                it("should NOT apply the has-subheader class to the active ion-content", function () {
                    expect(activeContent.hasClass("has-subheader")).toBeFalsy();
                });

                describe("should behave such that", testBarNotVisible);
            });
        });

        describe("when the banner is closeable", function () {

            beforeEach(function () {
                bar = createWexNotificationBar({
                    text: mockTitleText,
                    closeable: true,
                    content: mockChildText
                });
            });

            it("should add a close button", function () {
                expect(bar[0].querySelector(".close-button")).toBeDefined();
            });
        });

        describe("when the banner is not closeable", function () {

            beforeEach(function () {
                bar = createWexNotificationBar({
                    text: mockTitleText,
                    closeable: false,
                    content: mockChildText
                });
            });

            it("should not add a close button", function () {
                expect(bar[0].querySelector(".close-button")).toBeNull();
            });
        });

        describe("when the directive has an ngIf set", function () {
            var bars;

            beforeEach(function () {
                bars = [];
            });

            afterEach(function () {
                _.forEach(bars, function (bar) {
                    bar.remove();
                });
            });

            describe("when the ngIf is true", function () {

                beforeEach(function () {
                    var numBars = TestUtils.getRandomInteger(1, 5);

                    for (var i = 0; i < numBars; ++i) {
                        bars.push(createWexNotificationBar({
                            text: mockTitleText,
                            ngIf: true,
                            content: mockChildText,
                            priority: TestUtils.getRandomInteger(1, 10)
                        }));
                    }
                });

                describe("when the bar is a global bar", function () {

                    describe("when the bar is the highest priority", function () {

                        beforeEach(function () {
                            bar = createWexNotificationBar({
                                text: mockTitleText,
                                ngIf: true,
                                content: mockChildText,
                                priority: 0
                            });

                            _.forEach(bars.concat(bar), function (bar) {
                                body.append(bar);
                            });
                        });

                        it("should be visible", function () {
                            $rootScope.$digest();

                            expect(bar.isolateScope().isVisible()).toBe(true);
                        });

                        describe("will set the bar to be visible", testBarVisible);
                    });

                    describe("when the bar is the NOT highest priority", function () {

                        beforeEach(function () {
                            bar = createWexNotificationBar({
                                text: mockTitleText,
                                ngIf: true,
                                content: mockChildText,
                                priority: TestUtils.getRandomInteger(11, 20)
                            });

                            _.forEach(bars.concat(bar), function (bar) {
                                body.append(bar);
                            });
                        });

                        it("should NOT be visible", function () {
                            $rootScope.$digest();

                            expect(bar.isolateScope().isVisible()).toBe(false);
                        });
                    });
                });

                describe("when the bar is NOT a global bar", function () {

                    describe("when the bar is the highest priority", function () {

                        beforeEach(function () {
                            bar = createWexNotificationBar({
                                text: mockTitleText,
                                ngIf: true,
                                content: mockChildText,
                                priority: 0
                            });
                        });

                        describe("when there is a global bar", function () {

                            beforeEach(function () {
                                activeView.append(bar);

                                _.forEach(bars, function (bar) {
                                    body.append(bar);
                                });

                                //needed for unit tests since we add the element directly to the DOM
                                $rootScope.$broadcast("wexNotificationBar:priorityChange");
                            });

                            it("should NOT be visible", function () {
                                $rootScope.$digest();

                                expect(bar.isolateScope().isVisible()).toBe(false);
                            });
                        });

                        describe("when there is NOT a global bar", function () {

                            beforeEach(function () {
                                activeView.append(bar);

                                _.forEach(bars, function (bar) {
                                    activeView.append(bar);
                                });
                            });

                            it("should be visible", function () {
                                $rootScope.$digest();

                                expect(bar.isolateScope().isVisible()).toBe(true);
                            });

                            describe("will set the bar to be visible", testBarVisible);
                        });
                    });

                    describe("when the bar is NOT the highest priority", function () {

                        beforeEach(function () {
                            bar = createWexNotificationBar({
                                text: mockTitleText,
                                ngIf: true,
                                content: mockChildText,
                                priority: TestUtils.getRandomInteger(11, 20)
                            });

                            _.forEach(bars.concat(bar), function (bar) {
                                activeView.append(bar);
                            });
                        });

                        it("should NOT be visible", function () {
                            $rootScope.$digest();

                            expect(bar.isolateScope().isVisible()).toBe(false);
                        });

                        describe("will NOT set the bar to be visible", testBarNotVisible);
                    });
                });
            });

            describe("when the ngIf is false", function () {

                beforeEach(function () {
                    bar = createWexNotificationBar({
                        text: mockTitleText,
                        ngIf: false,
                        content: mockChildText
                    });

                    activeView.append(bar);
                });

                it("should NOT be visible", function () {
                    $rootScope.$digest();

                    expect(bar.isolateScope()).not.toBeDefined();
                });

                describe("will NOT set the bar to be visible", testBarNotVisible);
            });

            describe("when the page has a navBar", function () {

                beforeEach(function () {
                    pageHasNavBar = true;

                    bar = createWexNotificationBar({text: mockTitleText});

                    bar.scope().$apply();
                });

                it("should be a subheader", function () {
                    expect(bar.find("ion-header-bar").hasClass("bar-subheader")).toBeTruthy();
                });
            });

            describe("when the page does NOT have a navBar", function () {

                beforeEach(function () {
                    pageHasNavBar = false;

                    bar = createWexNotificationBar({text: mockTitleText});

                    bar.scope().$apply();
                });

                it("should NOT be a subheader", function () {
                    expect(bar.hasClass("bar-subheader")).toBeFalsy();
                });
            });

            describe("when the scope is destroyed", function () {

                beforeEach(function () {
                    bar = createWexNotificationBar({text: mockTitleText});

                    spyOn(bar.isolateScope(), "setVisible");

                    bar.scope().$broadcast("$destroy");
                    $rootScope.$digest();
                });

                it("should remove the banner from the list of banners", function () {
                    //TODO - Figure out how to test this
                });

                it("should call setVisible with the expected values", function () {
                    expect(bar.isolateScope().setVisible).toHaveBeenCalledWith(false);
                });
            });
        });

        function createWexNotificationBar(options) {
            var scope = angular.extend($scope.$new(), options || {}),
                template = [],
                element;

            scope.ngIf = _.isUndefined(scope.ngIf) ? true : scope.ngIf;

            /* NOTE: There's a bug when using ngIf in $compile in that causes it to always evaluate to false.
             * To get around this, we need to wrap the ngIf'd element in a <div>.
             */
            template.push("<div>");
            template.push("<wex-notification-bar");

            if (_.has(scope, "text")) {
                template.push(" text='{{text}}'");
            }

            if (_.has(scope, "closeable")) {
                template.push(" closeable='closeable'");
            }

            if (_.has(scope, "priority")) {
                template.push(" priority='{{priority}}'");
            }

            template.push(" ng-if='ngIf'>");

            if (_.has(scope, "content")) {
                template.push("{{content}}");
            }

            template.push("</wex-notification-bar>");
            template.push("</div>");

            element = $compile(template.join(""))(scope);
            $rootScope.$digest();

            return element.find("wex-notification-bar");
        }

        function testBarVisible() {
            describe("when the page has a navBar", function () {

                beforeEach(function () {
                    pageHasNavBar = true;

                    $rootScope.$digest();
                });

                it("should apply the has-subheader class to the active ion-content", function () {
                    expect(activeContent.hasClass("has-subheader")).toBeTruthy();
                });

                it("should NOT apply the has-header class to the active ion-content", function () {
                    expect(activeContent.hasClass("has-header")).toBeFalsy();
                });

                it("should NOT apply the hide class to the bar", function () {
                    expect(bar.hasClass("hide")).toBeFalsy();
                });
            });

            describe("when the page does NOT have a navBar", function () {

                beforeEach(function () {
                    pageHasNavBar = false;

                    $rootScope.$digest();
                });

                it("should apply the has-header class to the active ion-content", function () {
                    expect(activeContent.hasClass("has-header")).toBeTruthy();
                });

                it("should NOT apply the has-subheader class to the active ion-content", function () {
                    expect(activeContent.hasClass("has-subheader")).toBeFalsy();
                });

                it("should NOT apply the hide class to the bar", function () {
                    expect(bar.isolateScope().barElem.hasClass("hide")).toBeFalsy();
                });
            });
        }

        function testBarNotVisible() {

            beforeEach(function () {
                $rootScope.$digest();
            });

            it("should apply the hide class to the bar", function () {
                if (bar.isolateScope()) {
                    expect(bar.isolateScope().barElem.hasClass("hide")).toBeTruthy();
                }
            });
        }
    });
}());
