(function () {
    "use strict";

    describe("A Popup service", function () {

        var Popup,
            $compile,
            $ionicPopup,
            $q,
            $rootScope,
            alertDeferred,
            confirmDeferred,
            alertPromise,
            confirmPromise;

        beforeEach(function () {

            module("app.shared");

            //mock dependencies
            $ionicPopup = jasmine.createSpyObj("$ionicPopup", ["alert", "confirm"]);

            module(function ($provide) {
                $provide.value("$ionicPopup", $ionicPopup);
            });

            inject(function (_$compile_, _$q_, _$rootScope_, _Popup_) {
                Popup = _Popup_;
                $q = _$q_;
                $compile = _$compile_;
                $rootScope = _$rootScope_;

                alertDeferred = $q.defer();
                confirmDeferred = $q.defer();
            });

            //setup spies
            alertPromise = alertDeferred.promise;
            alertPromise.close = jasmine.createSpy("close");

            confirmPromise = confirmDeferred.promise;
            confirmPromise.close = jasmine.createSpy("close");

            $ionicPopup.alert.and.returnValue(alertPromise);
            alertDeferred.resolve();

            $ionicPopup.confirm.and.returnValue(confirmPromise);
            confirmDeferred.resolve();
        });

        describe("has a closeAlert function that", function () {

            describe("should NOT close an alert when none have been displayed", function () {

                beforeEach(function () {
                    Popup.closeAlert();
                });

                it("should NOT try to close the alert", function () {
                    expect(alertPromise.close).not.toHaveBeenCalled();
                });

            });

            describe("should close an alert when one has been displayed", function () {

                beforeEach(function () {
                    Popup.displayAlert();

                    Popup.closeAlert();
                });

                it("should call close the alert", function () {
                    expect(alertPromise.close).toHaveBeenCalledWith();
                });

            });

        });

        describe("has a closeConfirm function that", function () {

            describe("should NOT close a confirm when none have been displayed", function () {

                beforeEach(function () {
                    Popup.closeConfirm();
                });

                it("should NOT try to close the confirm", function () {
                    expect(confirmPromise.close).not.toHaveBeenCalled();
                });

            });

            describe("should close a confirm when one has been displayed", function () {

                beforeEach(function () {
                    Popup.displayConfirm();

                    Popup.closeConfirm();
                });

                it("should call close the confirm", function () {
                    expect(confirmPromise.close).toHaveBeenCalledWith();
                });

            });

        });

        describe("has a closeAllPopups function that", function () {
            var datePicker,
                mockScope,
                popup;

            beforeEach(function () {
                datePicker = $compile("<div class='ionic_datepicker_popup'></div>")($rootScope);
                mockScope = {$parent: {}};
                popup = jasmine.createSpyObj("popup", ["close"]);

                spyOn(angular.element.prototype, "scope").and.returnValue(mockScope);
            });

            describe("should NOT close an alert when none have been displayed", function () {

                beforeEach(function () {
                    Popup.closeAlert();
                });

                it("should NOT try to close the alert", function () {
                    expect(alertPromise.close).not.toHaveBeenCalled();
                });

            });

            describe("should close an alert when one has been displayed", function () {

                beforeEach(function () {
                    Popup.displayAlert();

                    Popup.closeAlert();
                });

                it("should call close the alert", function () {
                    expect(alertPromise.close).toHaveBeenCalledWith();
                });

            });

            describe("should NOT close a confirm when none have been displayed", function () {

                beforeEach(function () {
                    Popup.closeConfirm();
                });

                it("should NOT try to close the confirm", function () {
                    expect(confirmPromise.close).not.toHaveBeenCalled();
                });

            });

            describe("should close a confirm when one has been displayed", function () {

                beforeEach(function () {
                    Popup.displayConfirm();

                    Popup.closeConfirm();
                });

                it("should call close the confirm", function () {
                    expect(confirmPromise.close).toHaveBeenCalledWith();
                });

            });

            describe("when there is an open date picker", function () {

                beforeEach(function () {
                    angular.element(document.body).append(datePicker);
                    $rootScope.$digest();
                });

                describe("when there is a popup on the parent scope", function () {

                    beforeEach(function () {
                        mockScope.$parent.popup = popup;
                    });

                    beforeEach(function () {
                        Popup.closeDatePicker();
                    });

                    it("should call close on the open date picker's popup", function () {
                        expect(popup.close).toHaveBeenCalledWith();
                    });
                });

                describe("when there is NOT a popup on the parent scope", function () {

                    beforeEach(function () {
                        delete mockScope.$parent.popup;
                    });

                    beforeEach(function () {
                        Popup.closeDatePicker();
                    });

                    it("should NOT call close on the open date picker's popup", function () {
                        expect(popup.close).not.toHaveBeenCalled();
                    });
                });
            });

            describe("when there is NOT an open date picker", function () {

                beforeEach(function () {
                    Popup.closeDatePicker();
                });

                it("should NOT call close on the open date picker's popup", function () {
                    expect(popup.close).not.toHaveBeenCalled();
                });
            });

        });

        describe("has a displayAlert function that", function () {

            describe("when options are NOT provided", function () {

                beforeEach(function () {
                    Popup.displayAlert();
                });

                it("should call $ionicPopup.alert with the default cssClass", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({cssClass: "wex-alert-popup"});
                });

            });

            describe("when options.title is provided", function () {

                var options = {
                    title: "Test Title"
                };

                beforeEach(function () {
                    Popup.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({title: "Test Title", cssClass: "wex-alert-popup"});
                });

            });

            describe("when options.subTitle is provided", function () {

                var options = {
                    subTitle: "Test SubTitle"
                };

                beforeEach(function () {
                    Popup.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({subTitle: "Test SubTitle", cssClass: "wex-alert-popup"});
                });

            });

            describe("when options.cssClass is provided", function () {

                var options = {
                    cssClass: "wex-alert-dialog"
                };

                beforeEach(function () {
                    Popup.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({cssClass: "wex-alert-dialog"});
                });

            });

            describe("when options.content is provided", function () {

                var options = {
                    content: "Test Content"
                };

                beforeEach(function () {
                    Popup.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({template: "Test Content", cssClass: "wex-alert-popup"});
                });

            });

            describe("when options.contentUrl is provided", function () {

                var options = {
                    contentUrl: TestUtils.getRandomStringThatIsAlphaNumeric(20)
                };

                beforeEach(function () {
                    Popup.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({
                        templateUrl: options.contentUrl,
                        cssClass: "wex-alert-popup"
                    });
                });

            });

            describe("when options.buttonText is provided", function () {

                var options = {
                    buttonText: "Button Text"
                };

                beforeEach(function () {
                    Popup.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({okText: "Button Text", cssClass: "wex-alert-popup"});
                });

            });

            describe("when options.buttonCssClass is provided", function () {

                var options = {
                    buttonCssClass: "wex-alert-button"
                };

                beforeEach(function () {
                    Popup.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({okType: "wex-alert-button", cssClass: "wex-alert-popup"});
                });

            });

        });

        describe("has a displayConfirm function that", function () {
            var defaultCssClass = "wex-confirm-popup";

            describe("when options are NOT provided", function () {

                beforeEach(function () {
                    Popup.displayConfirm();
                });

                it("should call $ionicPopup.confirm with the default cssClass", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({cssClass: defaultCssClass});
                });

            });

            describe("when options.title is provided", function () {

                var options = {
                    title: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    Popup.displayConfirm(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        title: options.title,
                        cssClass: defaultCssClass
                    });
                });

            });

            describe("when options.subTitle is provided", function () {

                var options = {
                    subTitle: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    Popup.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        subTitle: options.subTitle,
                        cssClass: defaultCssClass
                    });
                });

            });

            describe("when options.cssClass is provided", function () {

                var options = {
                    cssClass: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    Popup.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({cssClass: options.cssClass});
                });

            });

            describe("when options.content is provided", function () {

                var options = {
                    content: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    Popup.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        template: options.content,
                        cssClass: defaultCssClass
                    });
                });

            });

            describe("when options.contentUrl is provided", function () {

                var options = {
                    contentUrl: TestUtils.getRandomStringThatIsAlphaNumeric(20)
                };

                beforeEach(function () {
                    Popup.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        templateUrl: options.contentUrl,
                        cssClass: defaultCssClass
                    });
                });

            });

            describe("when options.okButtonText is provided", function () {

                var options = {
                    okButtonText: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    Popup.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        okText: options.okButtonText,
                        cssClass: defaultCssClass});
                });

            });

            describe("when options.okButtonCssClass is provided", function () {

                var options = {
                    okButtonCssClass: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    Popup.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        okType: options.okButtonCssClass,
                        cssClass: defaultCssClass});
                });

            });

            describe("when options.cancelButtonText is provided", function () {

                var options = {
                    cancelButtonText: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    Popup.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        cancelText: options.cancelButtonText,
                        cssClass: defaultCssClass});
                });

            });

            describe("when options.cancelButtonCssClass is provided", function () {

                var options = {
                    cancelButtonCssClass: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    Popup.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        cancelType: options.cancelButtonCssClass,
                        cssClass: defaultCssClass});
                });

            });
        });

        describe("has a closeDatePicker function that", function () {
            var datePicker,
                mockScope,
                popup;

            beforeEach(function () {
                datePicker = $compile("<div class='ionic_datepicker_popup'></div>")($rootScope);
                mockScope = {$parent: {}};
                popup = jasmine.createSpyObj("popup", ["close"]);

                spyOn(angular.element.prototype, "scope").and.returnValue(mockScope);
            });

            describe("when there is an open date picker", function () {

                beforeEach(function () {
                    angular.element(document.body).append(datePicker);
                    $rootScope.$digest();
                });

                describe("when there is a popup on the parent scope", function () {

                    beforeEach(function () {
                        mockScope.$parent.popup = popup;
                    });

                    beforeEach(function () {
                        Popup.closeDatePicker();
                    });

                    it("should call close on the open date picker's popup", function () {
                        expect(popup.close).toHaveBeenCalledWith();
                    });
                });

                describe("when there is NOT a popup on the parent scope", function () {

                    beforeEach(function () {
                        delete mockScope.$parent.popup;
                    });

                    beforeEach(function () {
                        Popup.closeDatePicker();
                    });

                    it("should NOT call close on the open date picker's popup", function () {
                        expect(popup.close).not.toHaveBeenCalled();
                    });
                });
            });

            describe("when there is NOT an open date picker", function () {

                beforeEach(function () {
                    Popup.closeDatePicker();
                });

                it("should NOT call close on the open date picker's popup", function () {
                    expect(popup.close).not.toHaveBeenCalled();
                });
            });
        });
    });
})();
