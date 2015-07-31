(function () {
    "use strict";

    var $scope,
        $rootScope,
        element,
        directive,
        directiveScope,
        $ionicModal,
        modalDeferred,
        mockToolTip;

    describe("A WEX ToolTip Directive", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");

            // mock dependencies
            $ionicModal = jasmine.createSpyObj("$ionicModal", ["fromTemplateUrl"]);

            module(function ($provide) {
                $provide.value("$ionicModal", $ionicModal);
            });

            inject(function (_$rootScope_, $compile, $q) {
                $rootScope = _$rootScope_;
                $scope = $rootScope.$new();

                modalDeferred = $q.defer();

                element = "<wex-tool-tip options='{{options}}' title='{{title}}' body='{{body}}' " +
                        "close-button='{{closeButton}}' on-show='showHandler()' on-hide='hideHandler()' " +
                        "on-close='closeHandler()'></wex-tool-tip>";
                directive = $compile(element)($scope);
            });

            // set up spies
            mockToolTip = jasmine.createSpyObj("toolTip", ["show", "hide", "remove"]);
            $ionicModal.fromTemplateUrl.and.returnValue(modalDeferred.promise);
            modalDeferred.resolve(mockToolTip);
        });

        it("should replace the wex-tool-tip element with a help button", function () {
            $scope.$digest();

            expect(directive.hasClass("button")).toBeTruthy();
            expect(directive.hasClass("button-icon")).toBeTruthy();
            expect(directive.hasClass("icon")).toBeTruthy();
            expect(directive.hasClass("ion-help-circled")).toBeTruthy();
            expect(directive.hasClass("icon-tooltip")).toBeTruthy();
        });

        describe("when an options attribute is provided", function () {

            beforeEach(function () {
                $scope.options = {
                    "title": "Card Number",
                    "body": "<img src=\"img/card_number.png\">",
                    "closeButton": "Close"
                };

                $scope.$digest();

                directiveScope = directive.isolateScope();
            });

            // TODO: figure out why the isolateScope() does not return the values that have been
            // set on the scope within the link function

            xit("should set the title on the directive's scope", function () {
                expect(directiveScope.title).toEqual($scope.options.title);
            });

            xit("should set the body on the directive's scope", function () {
                expect(directiveScope.body).toEqual($scope.options.body);
            });

            xit("should set the closeButton on the directive's scope", function () {
                expect(directiveScope.closeButton).toEqual($scope.options.closeButton);
            });
        });

        describe("when an options attribute is NOT provided", function () {

            beforeEach(function () {
                $scope.options = undefined;
            });

            describe("when any of the property attributes are distinctly provided", function () {

                beforeEach(function () {
                    $scope.title = "Card Number";
                    $scope.body = "<img src=\"img/card_number.png\">";
                    $scope.closeButton = "Close";

                    $scope.$digest();

                    directiveScope = directive.isolateScope();
                });

                it("should set the title on the directive's scope", function () {
                    expect(directiveScope.title).toEqual($scope.title);
                });

                it("should set the body on the directive's scope", function () {
                    expect(directiveScope.body).toEqual($scope.body);
                });

                it("should set the closeButton on the directive's scope", function () {
                    expect(directiveScope.closeButton).toEqual($scope.closeButton);
                });
            });

            describe("when any of the property attributes are null", function () {

                beforeEach(function () {
                    $scope.title = null;
                    $scope.body = null;
                    $scope.closeButton = null;

                    $scope.$digest();

                    directiveScope = directive.isolateScope();
                });

                it("should set the title on the directive's scope to empty string", function () {
                    expect(directiveScope.title).toEqual("");
                });

                it("should set the body on the directive's scope to empty string", function () {
                    expect(directiveScope.body).toEqual("");
                });

                it("should set the closeButton on the directive's scope to empty string", function () {
                    expect(directiveScope.closeButton).toEqual("");
                });
            });

            describe("when any of the property attributes are undefined", function () {

                beforeEach(function () {
                    $scope.title = undefined;
                    $scope.body = undefined;
                    $scope.closeButton = undefined;

                    $scope.$digest();

                    directiveScope = directive.isolateScope();
                });

                it("should set the title on the directive's scope to empty string", function () {
                    expect(directiveScope.title).toEqual("");
                });

                it("should set the body on the directive's scope to empty string", function () {
                    expect(directiveScope.body).toEqual("");
                });

                it("should set the closeButton on the directive's scope to empty string", function () {
                    expect(directiveScope.closeButton).toEqual("");
                });
            });
        });

        describe("when the ToolTip is created", function () {

            var templateUrlArg,
                modalOptionsArg;

            beforeEach(function () {
                $scope.$digest();

                directiveScope = directive.isolateScope();
                templateUrlArg = $ionicModal.fromTemplateUrl.calls.mostRecent().args[0];
                modalOptionsArg = $ionicModal.fromTemplateUrl.calls.mostRecent().args[1];
            });

            it("should create a Modal from a ToolTip Modal Template", function () {
                expect(templateUrlArg).toEqual("app/shared/widgets/templates/toolTip/tooltipModal.html");
            });

            it("should set the scope on the Modal to the directive's scope", function () {
                expect(modalOptionsArg.scope).toEqual(directiveScope);
            });

            it("should set the ToolTip's animation to slide-in-up", function () {
                expect(modalOptionsArg.animation).toEqual("slide-in-up");
            });

            it("should disable the ability to close the ToolTip by clicking on the Backdrop", function () {
                expect(modalOptionsArg.backdropClickToClose).toBeFalsy();
            });

            it("should add the ToolTip Modal to the directive's scope", function () {
                expect(directiveScope.toolTip).toBeDefined();
            });
        });

        describe("has an openToolTip function that", function () {

            var mockEvent = "some event";

            beforeEach(function () {
                $scope.$digest();

                directiveScope = directive.isolateScope();

                directiveScope.openToolTip(mockEvent);
            });

            it("should call the modal's show function", function () {
                expect(mockToolTip.show).toHaveBeenCalledWith(mockEvent);
            });

        });

        describe("has an closeToolTip function that", function () {

            beforeEach(function () {
                $scope.$digest();

                directiveScope = directive.isolateScope();

                directiveScope.closeToolTip();
            });

            it("should call the modal's hide function", function () {
                expect(mockToolTip.hide).toHaveBeenCalledWith();
            });

        });

        describe("when the modal.shown event is fired", function () {

            var onShowHandler;

            beforeEach(function () {
                onShowHandler = jasmine.createSpy("onShow");
            });

            describe("when an onShow handler is specified", function () {

                beforeEach(function () {
                    $scope.showHandler = onShowHandler;

                    $scope.$digest();

                    $rootScope.$broadcast("modal.shown");
                });

                it("should call the registered onShow handler", function () {
                    expect(onShowHandler).toHaveBeenCalled();
                });

            });

        });

        describe("when the modal.hidden event is fired", function () {

            var onHideHandler;

            beforeEach(function () {
                onHideHandler = jasmine.createSpy("onHide");
            });

            describe("when an onHide handler is specified", function () {

                beforeEach(function () {
                    $scope.hideHandler = onHideHandler;

                    $scope.$digest();

                    $rootScope.$broadcast("modal.hidden");
                });

                it("should call the registered onHide handler", function () {
                    expect(onHideHandler).toHaveBeenCalled();
                });

            });

        });

        describe("when the modal.removed event is fired", function () {

            var onCloseHandler;

            beforeEach(function () {
                onCloseHandler = jasmine.createSpy("onClose");
            });

            describe("when an onClose handler is specified", function () {

                beforeEach(function () {
                    $scope.closeHandler = onCloseHandler;

                    $scope.$digest();

                    $rootScope.$broadcast("modal.removed");
                });

                it("should call the registered onClose handler", function () {
                    expect(onCloseHandler).toHaveBeenCalled();
                });

            });

        });

        describe("when the scope is destroyed", function () {

            beforeEach(function () {
                $scope.$digest();

                $rootScope.$broadcast("$destroy");
            });

            it("should call the modal's remove function", function () {
                expect(mockToolTip.remove).toHaveBeenCalledWith();
            });

        });

    });

})();
