(function () {
    "use strict";

    var $rootScope,
        $compile,
        wexAdvancedInput;

    fdescribe("A Wex Advanced Input Directive", function () {
        var button, field, tContent;

        beforeEach(function () {
            module("app.shared");
            module("app.html");

            inject(function (_$rootScope_, _$compile_) {
                $rootScope = _$rootScope_;
                $compile   = _$compile_;
            });
        });

        describe("has a clear value button that", function () {
            beforeEach(function () {
                var text = TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    myModel = { text: text };

                tContent = "<input ng-model='myModel.text' />";
                wexAdvancedInput = createWexAdvancedInput( { myModel: myModel }, tContent );

                field  = wexAdvancedInput.element.find( ":input" );
                button = wexAdvancedInput.element.find( ".ion-close-circled" );
            });

            it("should be invisible without field focus", function () {
                expect( wexAdvancedInput.scope.isEditable ).toBe( false );
            });

            it("should be visible with field focus", function () {
                field.triggerHandler( "focus" );
                expect( wexAdvancedInput.scope.isEditable ).toBe( true );
            });

            it("should clear the field's ng-model when clicked", function () {
                expect( wexAdvancedInput.scope.$parent.myModel.text ).not.toEqual( "" );
                button.triggerHandler( "click" );
                expect( wexAdvancedInput.scope.$parent.myModel.text ).toEqual( "" );
            });
        });

        describe("has a mask-text feature that", function () {
            var originalValue, fieldWrapper, maskWrapper;

            beforeEach(function () {
                var text = TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    myModel = { text: text };

                tContent = "<input ng-model='myModel.text' />";
                wexAdvancedInput = createWexAdvancedInput( { myModel: myModel, maskText: true }, tContent );

                field        = wexAdvancedInput.element.find( ":input" );
                fieldWrapper = wexAdvancedInput.element.find( ".field-wrapper" );
                maskWrapper  = wexAdvancedInput.element.find( ".mask-wrapper" );

                originalValue = wexAdvancedInput.scope.$parent.myModel.text;
            });

            describe("when clicked", function () {
                it("should show :input and hide the .mask-field", function () {
                    maskWrapper.triggerHandler( "click" );
                    expect( fieldWrapper.hasClass("ng-hide") ).toBe( false );
                    expect( maskWrapper.hasClass("ng-hide") ).toBe( true );
                });
            });

            describe("when a field is NOT in focus", function () {
                it("should show .mask-field and hide the :input", function () {
                    expect( maskWrapper.hasClass("ng-hide") ).toBe( false );
                    expect( fieldWrapper.hasClass("ng-hide") ).toBe( true );
                });
            });

            describe("when a field is in focus", function () {
                it("should show :input and hide the .mask-field", function () {
                    field.triggerHandler( "focus" );
                    expect( fieldWrapper.hasClass("ng-hide") ).toBe( false );
                    expect( maskWrapper.hasClass("ng-hide") ).toBe( true );
                });
            });
        });

    });

    function createWexAdvancedInput(options, tContent) {
        var scope  = $rootScope.$new(),
            markup = [],
            element;

        options = options || {};
        angular.extend( scope, options );

        markup.push( "<wex-advanced-input" );

        if ( scope.maskText ) {
            markup.push( " mask-text='true'" );
        }

        markup.push( ">" + ( tContent || "" ) + "</wex-advanced-input>" );

        element = $compile( markup.join("") )( scope );
        $rootScope.$digest();

        return {
            element: element,
            scope:   element.isolateScope()
        };
    }

})();
