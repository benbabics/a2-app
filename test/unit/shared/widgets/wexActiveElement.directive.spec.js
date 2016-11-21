(function () {
    "use strict";

    var $rootScope,
        $compile,
        mocks;

    describe("A Wex Active Element Directive", function () {
        beforeEach(inject(function (_$rootScope_, _$compile_) {
            $rootScope = _$rootScope_;
            $compile   = _$compile_;
        }));

        describe("has an isActive property that", function () {
            var inputs;

            beforeEach(function () {
                mocks  = createMockHTML();
                inputs = mocks.form.element.find( ":input" );
                spyOn( document.body, "addEventListener" ).and.callThrough();
            });

            afterEach(function() {
                mocks.container.element.remove();
            });

            it("should have defalut value of false", function () {
                expect( mocks.form.scope.isActive ).toBe( false );
            });

            // addEventListener doesn't seem to fire in the tests?

            xit("should have a value of true when a directive element is active", function() {
                mocks.form.element.triggerHandler( "click" );
                expect( mocks.form.scope.isActive ).toBe( true );

                inputs.filter( ":first" ).triggerHandler( "click" );
                expect( mocks.form.scope.isActive ).toBe( true );

                inputs.filter( ":last" ).triggerHandler( "click" );
                expect( mocks.form.scope.isActive ).toBe( true );

                expect( document.body.addEventListener ).toHaveBeenCalled();
            });

            xit("should revert the value to false when clicking an element outside the directive element", function () {
                inputs.filter( ":first" ).triggerHandler( "click" );
                expect( mocks.form.scope.isActive ).toBe( true );

                mocks.container.element.triggerHandler( "click" );
                expect( mocks.form.scope.isActive ).toBe( false );

                expect( document.body.addEventListener ).toHaveBeenCalled();
            });
        });
    });


    function createMockHTML(options, tContent) {
        var scope  = $rootScope.$new(),
            markup = [],
            mockContent = "",
            element;

        mockContent += "<input name='username'><input name='password' type='password'>";
        mockContent += "<input type='checkbox' value='foo' name='options'><input type='checkbox' value='bar' name='options'>";
        mockContent += "<button>Submit</button>";

        options = options || {};
        angular.extend( scope, options );

        markup.push( "<div class='container'><h1>Hello, World!</h1>" );
        markup.push( "<form wex-active-element>" );

        tContent = tContent || mockContent;

        markup.push( ( tContent || "" ) + "</form>" );
        markup.push( "</div>" );

        element = $compile( markup.join("") )( scope );
        $rootScope.$digest();

        var form = element.find( "form" );
        return {
            container: {
                element: element,
                scope:   element.scope()
            },
            form: {
                element: form,
                scope:   form.scope()
            }
        };
    }

})();
