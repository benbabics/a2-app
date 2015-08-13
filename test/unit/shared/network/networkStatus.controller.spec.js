(function () {
    "use strict";

    var $ionicModal,
        $rootScope,
        $scope,
        ctrl,
        mockModal,
        modalDeferred;

    describe("A NetworkStatusController", function () {
        beforeEach(function () {

            module("app.shared");
            module("app.html");

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });
            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            // mock dependencies
            $ionicModal = jasmine.createSpyObj("$ionicModal", ["fromTemplateUrl"]);
            mockModal = jasmine.createSpyObj("modal", ["show", "hide", "remove"]);

            module(function ($provide) {
                $provide.value("$ionicModal", $ionicModal);
            });

            // INJECT! This part is critical
            // $rootScope - injected to create a new $scope instance.
            // $controller - injected to create an instance of our controller.
            inject(function ($q, _$rootScope_, $controller) {

                $rootScope = _$rootScope_;
                $scope = $rootScope.$new();

                modalDeferred = $q.defer();

                $ionicModal.fromTemplateUrl.and.returnValue(modalDeferred.promise);

                ctrl = $controller("NetworkStatusController", {
                    $rootScope: $rootScope,
                    $scope: $scope
                });
            });

            modalDeferred.resolve(mockModal);
        });

        describe("has a cordovaOnline event handler function that", function () {

            describe("when the modal is disabled", function () {
                beforeEach(function () {
                    ctrl.disableModal();
                    ctrl.isOnline = null;

                    $rootScope.$broadcast("$cordovaNetwork:online");
                });

                it("should set isOnline to true", function () {
                    expect(ctrl.isOnline).toEqual(true);
                });

                it("should NOT hide the modal", function () {
                    expect(mockModal.hide).not.toHaveBeenCalled();
                });
            });

            describe("when the modal is enabled", function () {
                beforeEach(function () {
                    ctrl.enableModal();
                    $rootScope.$digest();
                    ctrl.isOnline = null;

                    $rootScope.$broadcast("$cordovaNetwork:online");
                });

                it("should set isOnline to true", function () {
                    expect(ctrl.isOnline).toEqual(true);
                });

                it("should hide the modal", function () {
                    expect(mockModal.hide).toHaveBeenCalledWith();
                });
            });

        });

        describe("has a cordovaOffline event handler function that", function () {

            describe("when the modal is disabled", function () {
                beforeEach(function () {
                    ctrl.disableModal();
                    ctrl.isOnline = null;

                    $rootScope.$broadcast("$cordovaNetwork:offline");
                });

                it("should set isOnline to false", function () {
                    expect(ctrl.isOnline).toEqual(false);
                });

                it("should NOT show the modal", function () {
                    expect(mockModal.show).not.toHaveBeenCalled();
                });
            });

            describe("when the modal is enabled", function () {
                beforeEach(function () {
                    ctrl.enableModal();
                    $rootScope.$digest();
                    ctrl.isOnline = null;

                    $rootScope.$broadcast("$cordovaNetwork:offline");
                });

                it("should set isOnline to false", function () {
                    expect(ctrl.isOnline).toEqual(false);
                });

                it("should show the modal", function () {
                    expect(mockModal.show).toHaveBeenCalledWith();
                });
            });

        });

        describe("has an enableModal function that", function () {
            beforeEach(function () {
                ctrl.enableModal();
            });

            it("should load the modal template", function () {
                var modalScope = $scope;

                modalScope.bannerText = ctrl.bannerText;

                expect($ionicModal.fromTemplateUrl).toHaveBeenCalledWith("app/shared/network/templates/networkStatus.modal.html", {
                    scope: modalScope,
                    animation: "slide-in-up",
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false
                });
            });

        });

        //TODO - Test disableModal separate from above tests?
    });

}());