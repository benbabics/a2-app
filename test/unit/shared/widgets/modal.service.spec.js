(function () {
    "use strict";

    describe("A Modal service", function () {
        var _,
            $cordovaKeyboard,
            $ionicModal,
            $q,
            $rootScope,
            Modal,
            modals,
            resolveHandler,
            rejectHandler,
            newScope;

        beforeEach(function () {
            //create mock dependencies:
            $cordovaKeyboard = jasmine.createSpyObj("$cordovaKeyboard", ["close"]);
            $ionicModal = jasmine.createSpyObj("$ionicModal", ["fromTemplate", "fromTemplateUrl"]);

            module(function ($provide) {
                $provide.value("$cordovaKeyboard", $cordovaKeyboard);
                $provide.value("$ionicModal", $ionicModal);
            });

            inject(function (___, _$q_, _$rootScope_, _Modal_) {
                _ = ___;
                $q = _$q_;
                $rootScope = _$rootScope_;
                Modal = _Modal_;
            });

            //setup mocks:
            newScope = $rootScope.$new(); //define a static scope to return from $new
            spyOn($rootScope, "$new").and.returnValue(newScope);
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
            Modal.setAll(modals = getRandomModals());
        });

        describe("when the 'app:logout' event is broadcast", function () {

            beforeEach(function () {
                $rootScope.$broadcast("app:logout");
                $rootScope.$digest();
            });

            it("should close all active modals", function () {
                _.forEach(modals, function (modal) {
                    expect(modal.hide).toHaveBeenCalledWith();
                });
            });
        });

        describe("has a closeAll function that", function () {

            beforeEach(function () {
                Modal.closeAll();
            });

            it("should close all active modals", function () {
                _.forEach(modals, function (modal) {
                    expect(modal.hide).toHaveBeenCalledWith();
                });
            });
        });

        describe("has a createByType function that", function () {
            var type;

            beforeEach(function () {
                type = {options: TestUtils.getRandomMap(TestUtils.getRandomInteger(1, 5))};
            });

            describe("when the given type has a template", function () {
                var options,
                    result;

                beforeEach(function () {
                    $ionicModal.fromTemplate.and.callFake(getRandomModal);
                });

                beforeEach(function () {
                    type.template = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    options = TestUtils.getRandomMap(TestUtils.getRandomInteger(1, 5));

                    Modal.createByType(type, options)
                        .then(function (modal) {
                            result = modal;
                            return result;
                        })
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call $ionicModal.fromTemplate with the expected values", function () {
                    expect($ionicModal.fromTemplate).toHaveBeenCalledWith(type.template, mapOptions(_.merge({}, _.get(type, "options", {}), options)));
                });

                it("should resolve", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(result);
                });

                it("should add the modal to the global list", function () {
                    expect(modals).toContain(result);
                });

                describe("should override the modal's remove function such that", function () {

                    beforeEach(function () {
                        result.remove();
                        $rootScope.$digest();
                    });

                    it("should remove the modal globally", function () {
                        expect(modals).not.toContain(result);
                    });

                    it("should call ionicModal.remove", function () {
                        //TODO - Figure out how to test this
                    });
                });

                describe("should override the modal's show function such that", function () {

                    beforeEach(function () {
                        result.show();
                        $rootScope.$digest();
                    });

                    it("should call $cordovaKeyboard.close", function () {
                        expect($cordovaKeyboard.close).toHaveBeenCalledWith(undefined);
                    });

                    it("should call ionicModal.show", function () {
                        //TODO - Figure out how to test this
                    });
                });
            });

            describe("when the given type has a templateUrl", function () {
                var options,
                    result;

                beforeEach(function () {
                    $ionicModal.fromTemplateUrl.and.returnValue($q.when(getRandomModal()));
                });

                beforeEach(function () {
                    type.templateUrl = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    options = TestUtils.getRandomMap(TestUtils.getRandomInteger(1, 5));

                    Modal.createByType(type, options)
                        .then(function (modal) {
                            result = modal;
                            return result;
                        })
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call $ionicModal.fromTemplateUrl with the expected values", function () {
                    expect($ionicModal.fromTemplateUrl).toHaveBeenCalledWith(type.templateUrl, mapOptions(_.merge({}, _.get(type, "options", {}), options)));
                });

                it("should resolve", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(result);
                });

                it("should add the modal to the global list", function () {
                    expect(modals).toContain(result);
                });

                describe("should override the modal's remove function such that", function () {

                    beforeEach(function () {
                        result.remove();
                        $rootScope.$digest();
                    });

                    it("should remove the modal globally", function () {
                        expect(modals).not.toContain(result);
                    });

                    it("should call ionicModal.remove", function () {
                        //TODO - Figure out how to test this
                    });
                });

                describe("should override the modal's show function such that", function () {

                    beforeEach(function () {
                        result.show();
                        $rootScope.$digest();
                    });

                    it("should call $cordovaKeyboard.close", function () {
                        expect($cordovaKeyboard.close).toHaveBeenCalledWith(undefined);
                    });

                    it("should call ionicModal.show", function () {
                        //TODO - Figure out how to test this
                    });
                });
            });

            describe("when the given type has neither a templateUrl or template", function () {

                beforeEach(function () {
                    Modal.createByType(type)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should reject with the expected error", function () {
                    var error = "Failed to create modal from unknown type. ";

                    expect(rejectHandler).toHaveBeenCalledWith(error);
                });
            });
        });

        describe("has a createFromTemplate function that", function () {
            var template,
                options,
                result;

            beforeEach(function () {
                $ionicModal.fromTemplate.and.callFake(getRandomModal);
            });

            beforeEach(function () {
                template = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                options = TestUtils.getRandomMap(TestUtils.getRandomInteger(1, 5));

                result = Modal.createFromTemplate(template, options);
            });

            it("should call $ionicModal.fromTemplate with the expected values", function () {
                expect($ionicModal.fromTemplate).toHaveBeenCalledWith(template, mapOptions(options));
            });

            it("should add the modal to the global list", function () {
                expect(modals).toContain(result);
            });

            describe("should override the modal's remove function such that", function () {

                beforeEach(function () {
                    result.remove();
                    $rootScope.$digest();
                });

                it("should remove the modal globally", function () {
                    expect(modals).not.toContain(result);
                });

                it("should call ionicModal.remove", function () {
                    //TODO - Figure out how to test this
                });
            });

            describe("should override the modal's show function such that", function () {

                beforeEach(function () {
                    result.show();
                    $rootScope.$digest();
                });

                it("should call $cordovaKeyboard.close", function () {
                    expect($cordovaKeyboard.close).toHaveBeenCalledWith(undefined);
                });

                it("should call ionicModal.show", function () {
                    //TODO - Figure out how to test this
                });
            });
        });

        describe("has a createFromTemplateUrl function that", function () {
            var templateUrl,
                options,
                result;

            beforeEach(function () {
                $ionicModal.fromTemplateUrl.and.returnValue($q.when(getRandomModal()));
            });

            beforeEach(function () {
                templateUrl = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                options = TestUtils.getRandomMap(TestUtils.getRandomInteger(1, 5));

                Modal.createFromTemplateUrl(templateUrl, options)
                    .then(function (modal) {
                        result = modal;
                        return result;
                    })
                    .then(resolveHandler)
                    .catch(rejectHandler);
                $rootScope.$digest();
            });

            it("should call $ionicModal.fromTemplateUrl with the expected values", function () {
                expect($ionicModal.fromTemplateUrl).toHaveBeenCalledWith(templateUrl, mapOptions(options));
            });

            it("should resolve", function () {
                expect(resolveHandler).toHaveBeenCalledWith(result);
            });

            it("should add the modal to the global list", function () {
                expect(modals).toContain(result);
            });

            describe("should override the modal's remove function such that", function () {

                beforeEach(function () {
                    result.remove();
                    $rootScope.$digest();
                });

                it("should remove the modal globally", function () {
                    expect(modals).not.toContain(result);
                });

                it("should call ionicModal.remove", function () {
                    //TODO - Figure out how to test this
                });
            });

            describe("should override the modal's show function such that", function () {

                beforeEach(function () {
                    result.show();
                    $rootScope.$digest();
                });

                it("should call $cordovaKeyboard.close", function () {
                    expect($cordovaKeyboard.close).toHaveBeenCalledWith(undefined);
                });

                it("should call ionicModal.show", function () {
                    //TODO - Figure out how to test this
                });
            });
        });

        describe("has a getAll function that", function () {

            it("should get the expected modals", function () {
                expect(Modal.getAll()).toEqual(modals);
            });
        });

        describe("has a setAll function that", function () {
            var modals;

            beforeEach(function () {
                Modal.setAll(modals = getRandomModals());
            });

            it("should set the modals to the expected value", function () {
                expect(Modal.getAll()).toEqual(modals);
            });
        });

        function getRandomModal() {
            var modal = jasmine.createSpyObj("Modal", ["hide", "isShown", "remove", "show"]);

            modal.isShown.and.callFake(TestUtils.getRandomBoolean);

            _.forEach(["hide", "remove", "show"], function (fn) {
                modal[fn].and.returnValue($q.resolve());
            });

            return modal;
        }

        function getRandomModals() {
            var modals = [],
                numModals = TestUtils.getRandomInteger(1, 5);

            for (var i = 0; i < numModals; ++i) {
                modals.push(getRandomModal());
            }

            return modals;
        }

        function mapOptions(options) {
            var modalOptions = _.pick(options, [
                "scope",
                "animation",
                "focusFirstInput",
                "backdropClickToClose",
                "hardwareBackButtonClose"
            ]);

            //create a new scope if one is not given
            if (!_.get(modalOptions, "scope")) {
                modalOptions.scope = $rootScope.$new();
            }

            //apply any given scope variables to the scope
            if (_.has(options, "scopeVars")) {
                _.merge(modalOptions.scope, options.scopeVars);
            }

            return modalOptions;
        }
    });
})();
