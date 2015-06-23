(function () {
    "use strict";

    describe("A WEX Field Label directive", function () {

        var $scope,
            $rootScope,
            CommonService,
            directive,
            mockForm = {
                $submitted: true,
                mockField: {}
            },
            mockLabelText = "Mock label text.";

        beforeEach(function () {
            module("app.shared");
            module("app.html");

            inject(function (_$rootScope_, $compile, _CommonService_) {
                $rootScope = _$rootScope_;

                CommonService = _CommonService_;

                $scope = $rootScope.$new();

                $scope.mockForm = mockForm;

                //Compile the angular markup to get an instance of the directive
                directive = $compile([
                    '<wex-field-label form="mockForm" field-name="mockField">',
                    mockLabelText,
                    '</wex-field-label>'
                ].join(""))($scope);

                $rootScope.$digest();
            });
        });

        describe("creates an element that", function () {

            it("should have the expected CSS input-label class", function () {
                expect(directive.hasClass("input-label")).toBeTruthy();
            });

            it("should have the transcluded child content", function () {
                expect(directive.html()).toContain(mockLabelText);
            });

            describe("when the associated form has been submitted", function () {

                beforeEach(function () {
                    mockForm.$submitted = true;
                });

                describe("when the associated field has a valid error property", function () {

                    beforeEach(function () {
                        mockForm.mockField.$error = {};

                        $rootScope.$digest();
                    });

                    describe("when the error is empty", function () {

                        it("should NOT have the error-text class", function () {
                            expect(directive.hasClass("error-text")).toBeFalsy();
                        });
                    });

                    describe("when the error has at least one property", function () {

                        beforeEach(function () {
                            mockForm.mockField.$error.mockProperty = "mock value";

                            $rootScope.$digest();
                        });

                        it("should have the error-text class", function () {
                            expect(directive.hasClass("error-text")).toBeTruthy();
                        });
                    });
                });

                describe("when the associated field has no error property", function () {

                    beforeEach(function () {
                        delete mockForm.mockField.$error;

                        $rootScope.$digest();
                    });

                    it("should NOT have the error-text class", function () {
                        expect(directive.hasClass("error-text")).toBeFalsy();
                    });
                });

                describe("when the associated field has a null error property", function () {

                    beforeEach(function () {
                        mockForm.mockField.$error = null;

                        $rootScope.$digest();
                    });

                    it("should NOT have the error-text class", function () {
                        expect(directive.hasClass("error-text")).toBeFalsy();
                    });
                });
            });

            describe("when the associated form has NOT been submitted", function () {

                beforeEach(function () {
                    mockForm.$submitted = false;

                    $rootScope.$digest();
                });

                it("should NOT have the error-text class", function () {
                    expect(directive.hasClass("error-text")).toBeFalsy();
                });
            });
        });
    });
}());