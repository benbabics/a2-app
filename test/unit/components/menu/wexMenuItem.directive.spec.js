(function () {
    "use strict";

    var $rootScope,
        $compile,
        $state,
        menuItem;

    describe("A WEX Menu Item directive", function () {

        beforeEach(function() {
            inject(function(_$rootScope_, _$compile_, _$state_) {
                $rootScope = _$rootScope_;
                $compile = _$compile_;
                $state = _$state_;

                menuItem = createWexMenuItem();
            });
        });

        afterEach(function() {
            menuItem.parentMenu.remove();
        });

        it("should set menu on the scope to the menu's controller", function () {
            expect(_.get(menuItem, "scope.menu.currentStateHasRoot")).toBeDefined();
        });

        describe("has an option for displaying a chevron", function() {

            describe("when the 'no-chevron' attribute is included", function() {

                describe("when it does have a value of 'true'", function() {

                    beforeEach(function () {
                        menuItem = createWexMenuItem({noChevron: "true"});
                        $rootScope.$digest();
                    });

                    afterEach(function() {
                        menuItem.parentMenu.remove();
                    });

                    it("does hide the chevron container element", function() {
                        expect(menuItem.element[0].querySelector(".chevron-container.ng-hide")).toBeTruthy();
                    });
                });

                describe("when it does NOT have a value of 'true'", function() {

                    beforeEach(function () {
                        menuItem = createWexMenuItem({noChevron: TestUtils.getRandomStringThatIsAlphaNumeric(5)});
                        $rootScope.$digest();
                    });

                    afterEach(function() {
                        menuItem.parentMenu.remove();
                    });

                    it("does NOT hide the chevron container element", function() {
                        expect(menuItem.element[0].querySelector(".chevron-container.ng-hide")).toBeFalsy();
                    });
                });
            });

            describe("when the 'no-chevron' attribute is NOT included", function() {

                beforeEach(function () {
                    menuItem = createWexMenuItem();
                    $rootScope.$digest();
                });

                afterEach(function() {
                    menuItem.parentMenu.remove();
                });

                it("shows the chevron container element", function() {
                    expect(menuItem.element[0].querySelector(".chevron-container.ng-hide")).toBeFalsy();
                });
            });
        });

        describe("has an option for displaying an icon", function() {

            describe("when the 'icon' attribute is specified", function() {

                // HTML classes can't start with a number.
                var mockIcon = "Q" + TestUtils.getRandomStringThatIsAlphaNumeric(10);

                beforeEach(function () {
                    menuItem = createWexMenuItem({icon:mockIcon});
                    $rootScope.$digest();
                });

                afterEach(function() {
                    menuItem.parentMenu.remove();
                });

                it("shows the icon element", function() {
                    expect(menuItem.element[0].querySelector("i.menu-icon")).toBeTruthy();
                });

                it("uses the specified icon class", function() {
                    expect(menuItem.element[0].querySelector("i.menu-icon."+mockIcon)).toBeTruthy();
                });
            });

            describe("when the 'icon' attribute is NOT specified", function() {

                beforeEach(function() {
                    menuItem = createWexMenuItem();
                    $rootScope.$digest();
                });

                afterEach(function() {
                    menuItem.parentMenu.remove();
                });

                it("removes the icon element", function() {
                    expect(menuItem.element[0].querySelector("i.menu-icon")).toBeNull();
                });
            });
        });

        describe("has an option for specifying a root state", function() {

            describe("when the 'root-state' attribute is specified", function() {

                var mockRootState = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                describe("when 'root-state' does match the current state", function() {

                    beforeEach(function() {
                        $state.current.name = mockRootState + "." + TestUtils.getRandomStringThatIsAlphaNumeric(10);
                        menuItem = createWexMenuItem({rootState: mockRootState});
                        $rootScope.$digest();
                    });

                    afterEach(function() {
                        menuItem.parentMenu.remove();
                    });

                    it("does apply the 'current' class to the root element", function() {
                        expect(menuItem.element.hasClass("current")).toBe(true);
                    });
                });

                describe("when 'root-state' does NOT match the current state", function() {

                    beforeEach(function() {
                        $state.current.name = TestUtils.getRandomStringThatIsAlphaNumeric(9) + "." + TestUtils.getRandomStringThatIsAlphaNumeric(9);
                        menuItem = createWexMenuItem({rootState: mockRootState});
                        $rootScope.$digest();
                    });

                    afterEach(function() {
                        menuItem.parentMenu.remove();
                    });

                    it("does NOT apply the 'current' class to the root element", function() {
                        expect(menuItem.element.hasClass("current")).toBe(false);
                    });
                });
            });

            describe("when the 'root-state' attribute is NOT specified", function() {

                beforeEach(function() {
                    menuItem = createWexMenuItem();
                    $rootScope.$digest();
                });

                afterEach(function() {
                    menuItem.parentMenu.remove();
                });

                it("does NOT apply the 'current' class to the root element", function() {
                    expect(menuItem.element.hasClass("current")).toBe(false);
                });
            });
        });

        describe("has an inline element", function() {

            var mockContent = TestUtils.getRandomStringThatIsAlphaNumeric(10);

            beforeEach(function() {
                menuItem = createWexMenuItem({mockContent:mockContent});
                $rootScope.$digest();
            });

            afterEach(function() {
                menuItem.parentMenu.remove();
            });

            it("that contains the transcluded content", function() {
               var element = menuItem.element[0].querySelector("span[ng-transclude]");
               expect(element.textContent).toEqual(mockContent);
           });
        });

    });

    function createWexMenuItem(options) {
        var scope = $rootScope.$new();
        var parentMenu,
            menuItemElement;

        parentMenu = $compile("<div wex-menu></div>")($rootScope);
        $rootScope.$digest();

        options = options || {};
        scope.icon = options.icon;
        scope.rootState = options.rootState;
        scope.noChevron = options.noChevron;

        var markup = [];
        markup.push("<wex-menu-item class='mock-menu-item' ");
        if(scope.icon) {
            markup.push(" icon='" + scope.icon + "'");
        }
        if(scope.rootState) {
            markup.push(" root-state='" + scope.rootState + "'");
        }
        if(scope.noChevron) {
            markup.push(" no-chevron='" + scope.noChevron + "'");
        }
        markup.push(">");
        if(options.mockContent) {
            markup.push(options.mockContent);
        }
        markup.push("</wex-menu-item>");

        menuItemElement = $compile(markup.join(""))(scope);
        parentMenu.append(menuItemElement);
        $rootScope.$digest();

        return {
            parentMenu : parentMenu,
            element: menuItemElement,
            scope: menuItemElement.scope()
        };
    }

})();
