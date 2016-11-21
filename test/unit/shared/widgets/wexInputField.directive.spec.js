(function () {
    "use strict";

    describe("A WEX Input Field directive", function () {

        var $scope,
            $rootScope,
            _,
            element,
            directive,
            mockForm,
            mockLabelText = TestUtils.getRandomStringThatIsAlphaNumeric(10),
            mockFieldName = TestUtils.getRandomStringThatIsAlphaNumeric(5),
            mockInputField = "<input ng-model='fieldModel' " +
                "name='" + mockFieldName + "' " +
                "type='" + TestUtils.getRandomStringThatIsAlphaNumeric(5) + "' " +
                "class=" + TestUtils.getRandomStringThatIsAlphaNumeric(5) + "' " +
                "mockAttribute1 mockAttribute2>",
            mockErrors = {
                required: TestUtils.getRandomStringThatIsAlphaNumeric(10)
            };

        beforeEach(inject(function (___, _$rootScope_, $compile) {
            $rootScope = _$rootScope_;
            _ = ___;

            $scope = $rootScope.$new();

            //Compile the angular markup to get an instance of the directive
            element = "<form name=\"form\">" +
                "<wex-input-field label=\"{{label}}\" " +
                "errors=\"{{errors}}\" " +
                "tool-tip=\"{{toolTip}}\" tool-tip-options=\"{{toolTipOptions}}\">" +
                mockInputField +
                "</wex-input-field>" +
                "</form>";
            directive = $compile(element)($scope);

            $scope.label = mockLabelText;
            $scope.errors = mockErrors;
            $scope.toolTip = true;
            $scope.toolTipOptions = {};
        }));

        afterEach(function() {
            directive.remove();
        });

        describe("creates an input field element", function () {

            var inputElement,
                expectedElement;

            beforeEach(function () {
                $scope.$digest();

                inputElement = angular.element(directive[0].querySelector("ion-input")).find("input");
                expectedElement = angular.element(mockInputField);
            });

            it("should have the transcluded input content", function () {
                expect(inputElement.attr("name")).toEqual(expectedElement.attr("name"));
                expect(inputElement.attr("ngModel")).toEqual(expectedElement.attr("ngModel"));
                expect(inputElement.attr("type")).toEqual(expectedElement.attr("type"));
                expect(inputElement.hasClass(expectedElement.attr("class"))).toBeTruthy();
            });

        });

        describe("creates a label element for the input field", function () {

            var labelElement;

            beforeEach(function () {
                $scope.label = mockLabelText;
                $scope.$digest();

                labelElement = angular.element(directive[0].querySelector("ion-label"));
            });

            it("should include the label text", function () {
                expect(labelElement.text()).toContain(mockLabelText);
            });

        });

        describe("has an option for displaying a toolTip next to the label", function () {

            var labelElement,
                toolTipElement;

            describe("when the toolTip attribute is set to true", function () {

                beforeEach(function () {
                    $scope.toolTip = true;
                    $scope.toolTipOptions = {
                        option1: "value1",
                        option2: "value2"
                    };

                    $scope.$digest();

                    labelElement = angular.element(directive[0].querySelector("ion-label"));
                    toolTipElement = labelElement.find("a");
                });

                it("should include a wex-tool-tip element", function () {
                    expect(toolTipElement.hasClass("icon-tooltip")).toBeTruthy();
                });

                it("should pass the toolTip options to the toolTip element", function () {
                    var toolTipElementOptions = toolTipElement.attr("options");

                    _.forEach($scope.toolTipOptions, function (value, key) {
                        expect(toolTipElementOptions).toContain(key);
                        expect(toolTipElementOptions).toContain(value);
                    });
                });

            });

            describe("when the toolTip attribute is undefined", function () {

                beforeEach(function () {
                    $scope.toolTip = undefined;
                    $scope.toolTipOptions = {};

                    $scope.$digest();

                    labelElement = angular.element(directive[0].querySelector("ion-label"));
                    toolTipElement = labelElement.find("a");
                });

                it("should NOT include a wex-tool-tip element", function () {
                    expect(toolTipElement.hasClass("icon-tooltip")).toBeFalsy();
                });

            });

        });

        describe("when the associated form has been submitted", function () {

            var labelElement,
                inputElement,
                fieldErrorsContainerElement,
                fieldErrorElement;

            beforeEach(function () {
                mockForm = $scope.form;
                mockForm.$submitted = true;
            });

            describe("when an errors attribute has been provided", function () {

                beforeEach(function () {
                    $scope.errors = mockErrors;
                    $scope.$digest();
                });

                describe("when the associated field has a valid error property", function () {

                    describe("when the error is empty", function () {

                        beforeEach(function () {
                            mockForm[mockFieldName].$error = {};

                            $scope.$digest();

                            labelElement = angular.element(directive[0].querySelector("ion-label"));
                            inputElement = angular.element(directive[0].querySelector("ion-input"));
                            fieldErrorsContainerElement = angular.element(directive[0].querySelector("div.wex-field-errors"));
                            fieldErrorElement = fieldErrorsContainerElement.find("div");
                        });

                        it("should NOT have the error-text class on the field label", function () {
                            expect(labelElement.hasClass("error-text")).toBeFalsy();
                        });

                        it("should NOT have the error-field class on the input field", function () {
                            expect(inputElement.hasClass("error-field")).toBeFalsy();
                        });

                        it("should NOT display an error message", function () {
                            expect(_.isEmpty(fieldErrorElement)).toBeTruthy();
                        });
                    });

                    describe("when the error has at least one property", function () {

                        describe("when at least one of the error properties match the provided errors attribute", function () {

                            var errorReasons,
                                mockErrorReason;

                            beforeEach(function () {
                                errorReasons = _.keys(mockErrors);
                                mockErrorReason = errorReasons[0];

                                mockForm[mockFieldName].$error[mockErrorReason] = "mock value";

                                $scope.$digest();

                                labelElement = angular.element(directive[0].querySelector("ion-label"));
                                inputElement = angular.element(directive[0].querySelector("ion-input"));
                                fieldErrorsContainerElement = angular.element(directive[0].querySelector("div.wex-field-errors"));
                                fieldErrorElement = fieldErrorsContainerElement.find("div");
                            });

                            it("should have the error-text class on the field label", function () {
                                expect(labelElement.hasClass("error-text")).toBeTruthy();
                            });

                            it("should have the error-field class on the input field", function () {
                                expect(inputElement.hasClass("error-field")).toBeTruthy();
                            });

                            it("should display the provided error message", function () {
                                expect(fieldErrorElement.text()).toContain(mockErrors[mockErrorReason]);
                            });

                            it("should display an error icon next to the error message", function () {
                                expect(fieldErrorElement[0].querySelector("span.icon-alert")).toBeDefined();
                            });

                            it("should have the error-msg class around the error message", function () {
                                expect(fieldErrorElement[0].querySelector("span.error-msg")).toBeDefined();
                            });

                        });

                        describe("when none of the error properties match the provided errors attribute", function () {

                            beforeEach(function () {
                                mockForm[mockFieldName].$error.mockProperty = "mock value";

                                $scope.$digest();

                                labelElement = angular.element(directive[0].querySelector("ion-label"));
                                inputElement = angular.element(directive[0].querySelector("ion-input"));
                                fieldErrorsContainerElement = angular.element(directive[0].querySelector("div.wex-field-errors"));
                                fieldErrorElement = fieldErrorsContainerElement.find("div");
                            });

                            it("should have the error-text class on the field label", function () {
                                expect(labelElement.hasClass("error-text")).toBeTruthy();
                            });

                            it("should have the error-field class on the input field", function () {
                                expect(inputElement.hasClass("error-field")).toBeTruthy();
                            });

                            it("should NOT display an error message", function () {
                                expect(_.isEmpty(fieldErrorElement)).toBeTruthy();
                            });

                        });

                    });
                });

                describe("when the associated field has no error property", function () {

                    beforeEach(function () {
                        delete mockForm[mockFieldName].$error;

                        $scope.$digest();

                        labelElement = angular.element(directive[0].querySelector("ion-label"));
                        inputElement = angular.element(directive[0].querySelector("ion-input"));
                        fieldErrorsContainerElement = angular.element(directive[0].querySelector("div.wex-field-errors"));
                        fieldErrorElement = fieldErrorsContainerElement.find("div");
                    });

                    it("should NOT have the error-text class", function () {
                        expect(labelElement.hasClass("error-text")).toBeFalsy();
                    });

                    it("should NOT have the error-field class on the input field", function () {
                        expect(inputElement.hasClass("error-field")).toBeFalsy();
                    });

                    it("should NOT display an error message", function () {
                        expect(_.isEmpty(fieldErrorElement)).toBeTruthy();
                    });
                });

                describe("when the associated field has a null error property", function () {

                    beforeEach(function () {
                        mockForm[mockFieldName].$error = null;

                        $scope.$digest();

                        labelElement = angular.element(directive[0].querySelector("ion-label"));
                        inputElement = angular.element(directive[0].querySelector("ion-input"));
                        fieldErrorsContainerElement = angular.element(directive[0].querySelector("div.wex-field-errors"));
                        fieldErrorElement = fieldErrorsContainerElement.find("div");
                    });

                    it("should NOT have the error-text class", function () {
                        expect(labelElement.hasClass("error-text")).toBeFalsy();
                    });

                    it("should NOT have the error-field class on the input field", function () {
                        expect(inputElement.hasClass("error-field")).toBeFalsy();
                    });

                    it("should NOT display an error message", function () {
                        expect(_.isEmpty(fieldErrorElement)).toBeTruthy();
                    });
                });

            });

            describe("when an errors attribute has NOT been provided", function () {

                beforeEach(function () {
                    $scope.errors = undefined;
                    $scope.$digest();
                });

                describe("when the associated field has a valid error property", function () {

                    describe("when the error is empty", function () {

                        beforeEach(function () {
                            mockForm[mockFieldName].$error = {};

                            $scope.$digest();

                            labelElement = angular.element(directive[0].querySelector("ion-label"));
                            inputElement = angular.element(directive[0].querySelector("ion-input"));
                            fieldErrorsContainerElement = angular.element(directive[0].querySelector("div.wex-field-errors"));
                            fieldErrorElement = fieldErrorsContainerElement.find("div");
                        });

                        it("should NOT have the error-text class on the field label", function () {
                            expect(labelElement.hasClass("error-text")).toBeFalsy();
                        });

                        it("should NOT have the error-field class on the input field", function () {
                            expect(inputElement.hasClass("error-field")).toBeFalsy();
                        });

                        it("should NOT display an error message", function () {
                            expect(_.isEmpty(fieldErrorElement)).toBeTruthy();
                        });
                    });

                    describe("when the error has at least one property", function () {

                        beforeEach(function () {
                            mockForm[mockFieldName].$error.mockProperty = "mock value";

                            $scope.$digest();

                            labelElement = angular.element(directive[0].querySelector("ion-label"));
                            inputElement = angular.element(directive[0].querySelector("ion-input"));
                            fieldErrorsContainerElement = angular.element(directive[0].querySelector("div.wex-field-errors"));
                            fieldErrorElement = fieldErrorsContainerElement.find("div");
                        });

                        it("should have the error-text class", function () {
                            expect(labelElement.hasClass("error-text")).toBeTruthy();
                        });

                        it("should have the error-field class on the input field", function () {
                            expect(inputElement.hasClass("error-field")).toBeTruthy();
                        });

                        it("should NOT display an error message", function () {
                            expect(_.isEmpty(fieldErrorElement)).toBeTruthy();
                        });
                    });
                });

                describe("when the associated field has no error property", function () {

                    beforeEach(function () {
                        delete mockForm[mockFieldName].$error;

                        $scope.$digest();

                        labelElement = angular.element(directive[0].querySelector("ion-label"));
                        inputElement = angular.element(directive[0].querySelector("ion-input"));
                        fieldErrorsContainerElement = angular.element(directive[0].querySelector("div.wex-field-errors"));
                        fieldErrorElement = fieldErrorsContainerElement.find("div");
                    });

                    it("should NOT have the error-text class", function () {
                        expect(labelElement.hasClass("error-text")).toBeFalsy();
                    });

                    it("should NOT have the error-field class on the input field", function () {
                        expect(inputElement.hasClass("error-field")).toBeFalsy();
                    });

                    it("should NOT display an error message", function () {
                        expect(_.isEmpty(fieldErrorElement)).toBeTruthy();
                    });
                });

                describe("when the associated field has a null error property", function () {

                    beforeEach(function () {
                        mockForm[mockFieldName].$error = null;

                        $scope.$digest();

                        labelElement = angular.element(directive[0].querySelector("ion-label"));
                        inputElement = angular.element(directive[0].querySelector("ion-input"));
                        fieldErrorsContainerElement = angular.element(directive[0].querySelector("div.wex-field-errors"));
                        fieldErrorElement = fieldErrorsContainerElement.find("div");
                    });

                    it("should NOT have the error-text class", function () {
                        expect(labelElement.hasClass("error-text")).toBeFalsy();
                    });

                    it("should NOT have the error-field class on the input field", function () {
                        expect(inputElement.hasClass("error-field")).toBeFalsy();
                    });

                    it("should NOT display an error message", function () {
                        expect(_.isEmpty(fieldErrorElement)).toBeTruthy();
                    });
                });

            });
        });

        describe("when the associated form has NOT been submitted", function () {

            var labelElement,
                inputElement,
                fieldErrorsContainerElement,
                fieldErrorElement;

            beforeEach(function () {
                mockForm = $scope.form;
                mockForm.$submitted = false;
            });

            describe("when an errors attribute has been provided", function () {

                beforeEach(function () {
                    $scope.errors = mockErrors;
                    $scope.$digest();

                    labelElement = angular.element(directive[0].querySelector("ion-label"));
                    inputElement = angular.element(directive[0].querySelector("ion-input"));
                    fieldErrorsContainerElement = angular.element(directive[0].querySelector("div.wex-field-errors"));
                    fieldErrorElement = fieldErrorsContainerElement.find("div");
                });

                it("should NOT have the error-text class", function () {
                    expect(labelElement.hasClass("error-text")).toBeFalsy();
                });

                it("should NOT have the error-field class on the input field", function () {
                    expect(inputElement.hasClass("error-field")).toBeFalsy();
                });

                it("should NOT display an error message", function () {
                    expect(_.isEmpty(fieldErrorElement)).toBeTruthy();
                });

            });

            describe("when an errors attribute has NOT been provided", function () {

                beforeEach(function () {
                    $scope.errors = undefined;
                    $scope.$digest();

                    labelElement = angular.element(directive[0].querySelector("ion-label"));
                    inputElement = angular.element(directive[0].querySelector("ion-input"));
                    fieldErrorsContainerElement = angular.element(directive[0].querySelector("div.wex-field-errors"));
                    fieldErrorElement = fieldErrorsContainerElement.find("div");
                });

                it("should NOT have the error-text class", function () {
                    expect(labelElement.hasClass("error-text")).toBeFalsy();
                });

                it("should NOT have the error-field class on the input field", function () {
                    expect(inputElement.hasClass("error-field")).toBeFalsy();
                });

                it("should NOT display an error message", function () {
                    expect(_.isEmpty(fieldErrorElement)).toBeTruthy();
                });

            });

        });
    });
}());