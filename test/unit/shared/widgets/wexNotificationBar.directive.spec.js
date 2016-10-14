(function () {
    "use strict";

    describe("A WEX Notification Bar directive", function () {

        var $compile,
            $rootScope,
            $scope,
            $state,
            ElementUtil,
            FlowUtil,
            bar,
            body,
            activeNavView,
            activeView,
            activeContent,
            pageHasNavBar = true,
            mockTitleText,
            mockSubtitleText,
            mockChildText;

        beforeEach(function () {
            //mock dependencies
            ElementUtil = jasmine.createSpyObj("ElementUtil", [
                "getActiveNavView",
                "getFocusedView",
                "getViewContent",
                "pageHasNavBar"
            ]);
            FlowUtil = jasmine.createSpyObj("FlowUtil", ["onPageEnter"]);

            module("app.shared", function ($provide) {
                $provide.value("ElementUtil", ElementUtil);
                $provide.value("FlowUtil", FlowUtil);
            });
            module("app.html");

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
                mockSubtitleText = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                mockChildText = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                $scope.barVisible = true;
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

            it("should call FlowUtil.onPageEnter with the expected values", function () {
                expect(FlowUtil.onPageEnter).toHaveBeenCalledWith(jasmine.any(Function), bar.isolateScope(), {once: false});
            });

            describe("when the banner has subtitle text", function () {

                beforeEach(function () {
                    bar = createWexNotificationBar({
                        text: mockTitleText,
                        subtext: mockSubtitleText
                    });
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

                    it("should contain the subtitle text", function () {
                        expect(title.text()).toContain(mockSubtitleText);
                    });
                });
            });

            describe("when the banner does NOT have subtitle text", function () {

                beforeEach(function () {
                    bar = createWexNotificationBar({text: mockTitleText});
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
                    _.forEach(bars.concat(bar), function (bar) {
                        bar.remove();
                    });
                });

                describe("when the ngIf is true", function () {

                    beforeEach(function () {
                        var numBars = TestUtils.getRandomInteger(1, 5);

                        for (var i = 0; i < numBars; ++i) {
                            bars.push(createWexNotificationBar({
                                text: mockTitleText,
                                barVisible: true,
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
                                    barVisible: true,
                                    content: mockChildText,
                                    priority: 0
                                });

                                _.forEach(bars.concat(bar), function (bar) {
                                    body.append(bar);
                                });
                            });

                            it("should be visible", function () {
                                $rootScope.$digest();

                                expect(bar.isolateScope().shouldBeVisible()).toBe(true);
                            });

                            describe("will set the bar to be visible", testBarVisible);
                        });

                        describe("when the bar is the NOT highest priority", function () {

                            beforeEach(function () {
                                bar = createWexNotificationBar({
                                    text: mockTitleText,
                                    barVisible: true,
                                    content: mockChildText,
                                    priority: TestUtils.getRandomInteger(11, 20)
                                });

                                _.forEach(bars.concat(bar), function (bar) {
                                    body.append(bar);
                                });
                            });

                            it("should NOT be visible", function () {
                                $rootScope.$digest();

                                expect(bar.isolateScope().shouldBeVisible()).toBe(false);
                            });
                        });
                    });

                    describe("when the bar is NOT a global bar", function () {
                        var initialState;

                        beforeEach(function () {
                            initialState = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                        });

                        describe("when the current state is the initial state", function () {

                            beforeEach(function () {
                                _.set($state, "current.name", initialState);
                            });

                            describe("when the bar is the highest priority", function () {

                                beforeEach(function () {
                                    bar = createWexNotificationBar({
                                        text: mockTitleText,
                                        barVisible: true,
                                        content: mockChildText,
                                        priority: 0
                                    });

                                    bar.isolateScope().initialState = initialState;
                                });

                                describe("when there is a global bar", function () {

                                    beforeEach(function () {
                                        activeView.append(bar);

                                        _.forEach(bars, function (bar) {
                                            body.append(bar);
                                        });
                                    });

                                    it("should NOT be visible", function () {
                                        $rootScope.$digest();

                                        expect(bar.isolateScope().shouldBeVisible()).toBe(false);
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

                                        expect(bar.isolateScope().shouldBeVisible()).toBe(true);
                                    });

                                    describe("will set the bar to be visible", testBarVisible);
                                });
                            });

                            describe("when the bar is NOT the highest priority", function () {

                                beforeEach(function () {
                                    bar = createWexNotificationBar({
                                        text: mockTitleText,
                                        barVisible: true,
                                        content: mockChildText,
                                        priority: TestUtils.getRandomInteger(11, 20)
                                    });

                                    bar.isolateScope().initialState = initialState;

                                    _.forEach(bars.concat(bar), function (bar) {
                                        activeView.append(bar);
                                    });
                                });

                                it("should NOT be visible", function () {
                                    $rootScope.$digest();

                                    expect(bar.isolateScope().shouldBeVisible()).toBe(false);
                                });

                                describe("will NOT set the bar to be visible", testBarNotVisible);
                            });
                        });

                        describe("when the current state is NOT the initial state", function () {

                            beforeEach(function () {
                                bar = createWexNotificationBar({
                                    text: mockTitleText,
                                    barVisible: true,
                                    content: mockChildText,
                                    priority: 0
                                });

                                bar.isolateScope().initialState = initialState;

                                activeView.append(bar);
                            });

                            it("should NOT be visible", function () {
                                $rootScope.$digest();

                                expect(bar.isolateScope().shouldBeVisible()).toBe(false);
                            });

                            describe("will NOT set the bar to be visible", testBarNotVisible);
                        });
                    });
                });

                describe("when the ngIf is false", function () {

                    beforeEach(function () {
                        bar = createWexNotificationBar({
                            text: mockTitleText,
                            barVisible: false,
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
            });

            describe("when the page has a navBar", function () {

                beforeEach(function () {
                    pageHasNavBar = true;

                    bar.scope().$apply();
                });

                it("should be a subheader", function () {
                    expect(bar.find("ion-header-bar").hasClass("bar-subheader")).toBeTruthy();
                });
            });

            describe("when the page does NOT have a navBar", function () {

                beforeEach(function () {
                    pageHasNavBar = false;

                    bar.scope().$apply();
                });

                it("should NOT be a subheader", function () {
                    expect(bar.hasClass("bar-subheader")).toBeFalsy();
                });
            });

            describe("when the scope is destroyed", function () {

                beforeEach(function () {
                    spyOn(bar.isolateScope(), "setVisible");

                    bar.scope().$broadcast("$destroy");
                    $rootScope.$digest();
                });

                it("should remove all listeners", function () {
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

            /* NOTE: There's a bug when using ngIf in $compile in that causes it to always evaluate to false.
             * To get around this, we need to wrap the ngIf'd element in a <div>.
             */
            template.push("<div>");
            template.push("<wex-notification-bar");

            if (_.has(scope, "text")) {
                template.push(" text='{{text}}'");
            }

            if (_.has(scope, "subtext")) {
                template.push(" subtext='{{subtext}}'");
            }

            if (_.has(scope, "closeable")) {
                template.push(" closeable='closeable'");
            }

            if (_.has(scope, "priority")) {
                template.push(" priority='{{priority}}'");
            }

            template.push(" ng-if='barVisible'>");

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

            it("should NOT apply the has-header class to the active ion-content", function () {
                expect(activeContent.hasClass("has-header")).toBeFalsy();
            });

            it("should NOT apply the has-subheader class to the active ion-content", function () {
                expect(activeContent.hasClass("has-subheader")).toBeFalsy();
            });

            it("should apply the hide class to the bar", function () {
                if (bar.isolateScope()) {
                    expect(bar.isolateScope().barElem.hasClass("hide")).toBeTruthy();
                }
            });
        }
    });
}());
