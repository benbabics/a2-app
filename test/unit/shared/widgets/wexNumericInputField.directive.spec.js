(function () {
    "use strict";

    describe("A WEX Numeric Input Field directive", function () {
        var KEY_NUMERIC = "numeric",
            KEY_DECIMAL = "decimal",
            KEY_DELETE = "delete",
            _,
            $rootScope,
            $compile,
            scope,
            directive,
            isolateScope,
            viewContent;

        beforeEach(function () {
            module("app.shared");
            module("app.html");

            inject(function (_$rootScope_, _$compile_, CommonService) {
                $rootScope = _$rootScope_;
                $compile = _$compile_;

                _ = CommonService._;

                viewContent = $compile("<ion-content></ion-content>")($rootScope);

                spyOn(CommonService, "getViewContent").and.returnValue(viewContent);
                spyOn(angular.element.prototype, "on").and.callThrough();
                spyOn(window, "addEventListener").and.callThrough();

                scope = $rootScope.$new();
                scope.model = "";

                directive = createDirective();
                isolateScope = directive.isolateScope();
            });
        });

        it("should allow decimals by default", function () {
            expect(isolateScope.allowDecimal()).toBeTruthy();
        });

        //TODO figure out a better way to test this
        it("should set the model display element to the directive's element by default", function () {
            //a child element containing the model should be added
            expect(directive.children().length).toEqual(1);
        });

        //TODO jasmine turns ng-include elements into comments. Figure out why so that this can be tested
        xit("should add a numeric keypad to the active view content", function () {
            expect(viewContent[0].querySelector(".numeric-keypad")).not.toEqual(null);
        });

        it("should set a click handler on the directive element", function () {
            expect(angular.element.prototype.on).toHaveBeenCalledWith("click", isolateScope.toggleKeypad);
        });

        it("should add a native.keyboardshow listener", function () {
            expect(window.addEventListener).toHaveBeenCalledWith("native.keyboardshow", isolateScope.closeKeypad);
        });

        describe("when decimals the allow-decimal attribute is set to true", function () {

            beforeEach(function () {
                directive = createDirective(true);
                isolateScope = directive.isolateScope();
            });

            it("should allow decimals", function () {
                expect(isolateScope.allowDecimal()).toBeTruthy();
            });
        });

        describe("when decimals the allow-decimal attribute is set to false", function () {

            beforeEach(function () {
                directive = createDirective(false);
                isolateScope = directive.isolateScope();
            });

            it("should not allow decimals", function () {
                expect(isolateScope.allowDecimal()).toBeFalsy();
            });
        });

        describe("when the model should be shown on a nested element", function () {

            beforeEach(function () {
                directive = createDirective(undefined, true);
                isolateScope = directive.isolateScope();
            });

            //TODO figure out a better way to test this
            it("should set the model display element to that element", function () {
                var nestedElement = angular.element(directive[0].querySelector("[data-display-model]"));

                //a child element containing the model should be added
                expect(nestedElement.children().length).toEqual(1);
            });
        });

        describe("when the model should NOT be shown on a nested element", function () {

            beforeEach(function () {
                directive = createDirective(undefined, false);
                isolateScope = directive.isolateScope();
            });

            //TODO figure out a better way to test this
            it("should set the model display element to the directive's element", function () {
                //a child element containing the model should be added
                expect(directive.children().length).toEqual(1);
            });
        });

        describe("when the directive is destroyed", function () {

            beforeEach(function () {
                spyOn(isolateScope, "removeEventListeners").and.callThrough();

                directive.remove();
                isolateScope.$destroy();
                $rootScope.$digest();
            });

            //TODO this doesn't work because the spy function is different from the original function that was passed
            //figure out how to test this
            xit("should call removeEventListeners", function () {
                expect(isolateScope.removeEventListeners).toHaveBeenCalledWith();
            });
        });

        describe("has a keyIsDisabled function that", function () {

            describe("when the keyType is a numeric key", function () {
                var keyType = {type: KEY_NUMERIC};

                it("should return false", function () {
                    expect(isolateScope.keyIsDisabled(keyType)).toBeFalsy();
                });
            });

            describe("when the keyType is a decimal key", function () {
                var keyType = {type: KEY_DECIMAL};

                describe("when decimals are allowed", function () {

                    beforeEach(function () {
                        spyOn(isolateScope, "allowDecimal").and.returnValue(true);
                    });

                    it("should return false", function () {
                        expect(isolateScope.keyIsDisabled(keyType)).toBeFalsy();
                    });
                });

                describe("when decimals are not allowed", function () {

                    beforeEach(function () {
                        spyOn(isolateScope, "allowDecimal").and.returnValue(false);
                    });

                    it("should return true", function () {
                        expect(isolateScope.keyIsDisabled(keyType)).toBeTruthy();
                    });
                });
            });

            describe("when the keyType is a delete key", function () {
                var keyType = {type: KEY_DELETE};

                it("should return false", function () {
                    expect(isolateScope.keyIsDisabled(keyType)).toBeFalsy();
                });
            });
        });

        describe("has a showKeypad function that", function () {

            describe("when setting show to true", function () {

                beforeEach(function () {
                    isolateScope.showKeypad(true);
                    isolateScope.$digest();
                });

                it("should set keypadVisible to true", function () {
                    expect(isolateScope.keypadVisible).toBeTruthy();
                });
            });

            describe("when setting show to false", function () {

                beforeEach(function () {
                    isolateScope.showKeypad(false);
                    isolateScope.$digest();
                });

                it("should set keypadVisible to false", function () {
                    expect(isolateScope.keypadVisible).toBeFalsy();
                });
            });
        });

        describe("has a toggleKeypad function that", function () {

            describe("when keypadVisible is true", function () {

                beforeEach(function () {
                    isolateScope.keypadVisible = true;

                    isolateScope.toggleKeypad();
                    isolateScope.$digest();
                });

                it("should set keypadVisible to false", function () {
                    expect(isolateScope.keypadVisible).toBeFalsy();
                });
            });

            describe("when keypadVisible is false", function () {

                beforeEach(function () {
                    isolateScope.keypadVisible = false;

                    isolateScope.toggleKeypad();
                    isolateScope.$digest();
                });

                it("should set keypadVisible to true", function () {
                    expect(isolateScope.keypadVisible).toBeTruthy();
                });
            });
        });

        describe("has an onKeyPress function that", function () {
            var initialModelValue = "12345678";

            beforeEach(function () {
                isolateScope.model = initialModelValue;
            });

            describe("when the key value is a numeric character", function () {
                var number = 9;

                beforeEach(function () {
                    isolateScope.onKeyPress(number);
                });

                it("should append the value to the model", function () {
                    expect(isolateScope.model).toEqual(initialModelValue + number);
                });
            });

            describe("when the key value is a decimal character", function () {
                var decimal = ".";

                beforeEach(function () {
                    isolateScope.onKeyPress(decimal);
                });

                it("should append the value to the model", function () {
                    expect(isolateScope.model).toEqual(initialModelValue + decimal);
                });
            });

            describe("when the key value is a backspace character", function () {
                var backspace = "\b";

                describe("when the model has characters in it", function () {

                    it("should remove the last character from the model", function () {
                        isolateScope.onKeyPress(backspace);

                        expect(isolateScope.model).toEqual(initialModelValue.slice(0, -1));
                    });
                });

                describe("when the model does NOT have characters in it", function () {

                    beforeEach(function () {
                        isolateScope.model = "";
                    });

                    it("should have no effect on the model", function () {
                        isolateScope.onKeyPress(backspace);

                        expect(isolateScope.model).toEqual("");
                    });
                });
            });
        });

        describe("has a removeEventListeners function that", function () {

            beforeEach(function () {
                spyOn(window, "removeEventListener").and.callThrough();
                spyOn(angular.element.prototype, "off").and.callThrough();

                isolateScope.removeEventListeners();
            });

            it("should remove the native.keyboardshow listener", function () {
                expect(window.removeEventListener).toHaveBeenCalledWith(
                    "native.keyboardshow",
                    isolateScope.closeKeypad
                );
            });

            it("should remove the directive element's click handler", function () {
                expect(angular.element.prototype.off).toHaveBeenCalledWith("click", isolateScope.toggleKeypad);
            });
        });

        function createDirective(allowDecimal, nestedModelDisplayElem) {
            allowDecimal = _.isUndefined(allowDecimal) ? true : allowDecimal;

            var markup = [];
            markup.push("<div ng-model='model' wex-numeric-input-field allow-decimal='" + allowDecimal + "'>");

            if (nestedModelDisplayElem) {
                markup.push("<div data-display-model></div>");
            }

            markup.push("</div>");

            return $compile(markup.join(""))(scope);
        }
    });
})();