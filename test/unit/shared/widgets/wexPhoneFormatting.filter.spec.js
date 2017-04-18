(function () {
    "use strict";

    fdescribe("A WEX Phone Formatting Filter", () => {

        var wexPhoneFormattingFilter;

        beforeEach(inject(function($injector) {
            wexPhoneFormattingFilter = $injector.get( "wexPhoneFormattingFilter" );
        }));

        describe("properly format a string of a phone number that", () => {
            it("should work with default settings", () => {
                expect( wexPhoneFormattingFilter( "1234567890" ) ).toBe( "123-456-7890" );
            });

            it("should work with a length of more than 10 characters", () => {
                expect( wexPhoneFormattingFilter( "12345678901234" ) ).toBe( "123-456-7890" );
            });

            it("should strip out additional special characters", () => {
                expect( wexPhoneFormattingFilter( "(123) 456-7890" ) ).toBe( "123-456-7890" );
            });

            it("should return null when not a string or not a length of 10 characters", () => {
                expect( wexPhoneFormattingFilter( "123" ) ).toBe( null );
                expect( wexPhoneFormattingFilter( null ) ).toBe( null );
                expect( wexPhoneFormattingFilter() ).toBe( null );
            });
        });

    });

})();
