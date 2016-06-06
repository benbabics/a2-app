(function () {
    "use strict";

    describe("A WEX Notification Bar directive", function () {

        var $compile,
            $rootScope,
            $scope,
            ElementUtil,
            FlowUtil,
            bar,
            activeNavView,
            activeView,
            activeContent,
            pageHasNavBar = true,
            mockTitleText,
            mockSubtitleText,
            mockChildText;

        beforeEach(function () {
            //mock dependencies
            ElementUtil = jasmine.createSpyObj("ElementUtil", ["getActiveNavView", "getFocusedView", "pageHasNavBar"]);
            FlowUtil = jasmine.createSpyObj("FlowUtil", ["onPageEnter", "onPageLeave"]);

            module("app.shared", function ($provide) {
                $provide.value("ElementUtil", ElementUtil);
                $provide.value("FlowUtil", FlowUtil);
            });
            module("app.html");

            inject(function (_$rootScope_, _$compile_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $scope = $rootScope.$new();

                activeNavView = $compile("<ion-nav-view></ion-nav-view>")($scope);
                activeView = $compile("<ion-view nav-view='active'></ion-view>")($scope);
                activeContent = $compile("<ion-content></ion-content>")($scope);

                activeView.append(activeContent);
                activeNavView.append(activeView);

                $scope.$digest();

                ElementUtil.getActiveNavView.and.returnValue(activeNavView);
                ElementUtil.getFocusedView.and.returnValue(activeView);
                ElementUtil.pageHasNavBar.and.callFake(function () {
                    return pageHasNavBar;
                });

                mockTitleText = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                mockSubtitleText = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                mockChildText = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                $scope.barVisible = true;
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

            it("should be a ion-header-bar", function () {
                expect(bar.prop("tagName")).toBeDefined();
                expect(bar.prop("tagName").toLowerCase()).toEqual("ion-header-bar");
            });

            it("should be a header", function () {
                expect(bar.hasClass("bar-header")).toBeTruthy();
            });

            it("should have the transcluded child content", function () {
                expect(bar.html()).toContain(mockChildText);
            });

            it("should call FlowUtil.onPageEnter with the expected values", function () {
                expect(FlowUtil.onPageEnter).toHaveBeenCalledWith(jasmine.any(Function), bar.scope(), {once: false});
            });

            it("should call FlowUtil.onPageLeave with the expected values", function () {
                expect(FlowUtil.onPageLeave).toHaveBeenCalledWith(jasmine.any(Function), bar.scope(), {once: false});
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

            function testBarVisible() {
                describe("when the page has a navBar", function () {

                    beforeEach(function () {
                        pageHasNavBar = true;

                        bar.scope().$apply();

                        toggleBarVisibility(true);
                    });

                    it("should apply the has-subheader class to the active ion-content", function () {
                        expect(activeContent.hasClass("has-subheader")).toBeTruthy();
                    });

                    it("should NOT apply the has-header class to the active ion-content", function () {
                        expect(activeContent.hasClass("has-header")).toBeFalsy();
                    });
                });

                describe("when the page does NOT have a navBar", function () {

                    beforeEach(function () {
                        pageHasNavBar = false;

                        bar.scope().$apply();

                        toggleBarVisibility(true);
                    });

                    it("should apply the has-header class to the active ion-content", function () {
                        expect(activeContent.hasClass("has-header")).toBeTruthy();
                    });

                    it("should NOT apply the has-subheader class to the active ion-content", function () {
                        expect(activeContent.hasClass("has-subheader")).toBeFalsy();
                    });
                });
            }

            function testBarNotVisible() {

                it("should NOT apply the has-header class to the active ion-content", function () {
                    expect(activeContent.hasClass("has-header")).toBeFalsy();
                });

                it("should NOT apply the has-subheader class to the active ion-content", function () {
                    expect(activeContent.hasClass("has-subheader")).toBeFalsy();
                });
            }

            describe("when the banner is visible", function () {

                describe("when the banner is global", function () {

                    beforeEach(function () {
                        activeNavView.append(bar);

                        bar.scope().$apply();
                    });

                    it("should set initialState to the current toState", function () {
                        //TODO - Figure out how to test this
                    });

                    it("should set the bar to be visible", testBarVisible);
                });

                describe("when the banner is NOT global", function () {

                    beforeEach(function () {
                        activeContent.append(bar);

                        bar.scope().$apply();
                    });

                    describe("when the banner has an initial state already set", function () {

                        xdescribe("when the initial state is equal to the toState", function () {

                            //TODO - Figure out how to test this

                            it("should set initialState to the current toState", function () {
                            });

                            it("should set the bar to be visible", testBarVisible);
                        });

                        describe("when the initial state is NOT equal to the toState", function () {

                            it("should NOT set the bar to be visible", testBarNotVisible);
                        });
                    });

                    xdescribe("when the banner does NOT have an initial state already set", function () {

                        //TODO - Figure out how to test this

                        it("should set initialState to the current toState", function () {
                        });

                        it("should set the bar to be visible", testBarVisible);
                    });
                });
            });

            describe("when the banner is NOT visible", function () {

                beforeEach(function () {
                    toggleBarVisibility(false);
                });

                afterEach(function () {
                    toggleBarVisibility(true);
                });

                it("should NOT set the bar to be visible", testBarNotVisible);
            });

            describe("when the page has a navBar", function () {

                beforeEach(function () {
                    pageHasNavBar = true;

                    bar.scope().$apply();
                });

                it("should be a subheader", function () {
                    expect(bar.hasClass("bar-subheader")).toBeTruthy();
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
                    spyOn(bar.scope(), "setVisible");

                    bar.scope().$broadcast("$destroy");
                    $rootScope.$digest();
                });

                it("should remove all listeners", function () {
                    //TODO - Figure out how to test this
                });

                it("should call setVisible with the expected values", function () {
                    expect(bar.scope().setVisible).toHaveBeenCalledWith(false, activeView);
                });
            });
        });

        function createWexNotificationBar(options) {
            var scope = angular.extend($scope.$new(), options || {}),
                template = [],
                element;

            /* TODO/NOTE: There's a bug when using ngIf in $compile in that causes it to always evaluate to false.
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

            template.push(" ng-if='barVisible'>");

            if (_.has(scope, "content")) {
                template.push("{{content}}");
            }

            template.push("</wex-notification-bar>");
            template.push("</div>");

            element = $compile(template.join(""))(scope);
            $rootScope.$digest();

            return element.children().find("ion-header-bar");
        }

        function toggleBarVisibility(visible) {
            visible = _.isUndefined(visible) ? !$scope.barVisible : visible;

            if (visible === $scope.barVisible) {
                toggleBarVisibility();
            }

            $scope.barVisible = visible;
            $rootScope.$digest();
        }
    });
}());
