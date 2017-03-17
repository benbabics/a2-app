// (() => {
//     "use strict";
//
//     describe("A User Authorization service", () => {
//
//         beforeEach(function () {
//             this.AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", [
//                 "authenticate",
//                 "userLoggedIn"
//             ]);
//             this.Fingerprint = jasmine.createSpyObj("Fingerprint", ["verify"]);
//             this.FingerprintProfileUtil = jasmine.createSpyObj("FingerprintProfileUtil", ["getProfile"]);
//             this.Modal = jasmine.createSpyObj("Modal", ["createByType"]);
//             this.PlatformUtil = jasmine.createSpyObj("PlatformUtil", ["getPlatform"]);
//             this.FingerprintAcceptLogManager = jasmine.createSpyObj("FingerprintAcceptLogManager", ["log"]);
//
//             module(($provide) => {
//                 $provide.value("AuthenticationManager", this.AuthenticationManager);
//                 $provide.value("Fingerprint", this.Fingerprint);
//                 $provide.value("FingerprintProfileUtil", this.FingerprintProfileUtil);
//                 $provide.value("Modal", this.Modal);
//                 $provide.value("PlatformUtil", this.PlatformUtil);
//                 $provide.value("FingerprintAcceptLogManager", this.FingerprintAcceptLogManager);
//             });
//
//             inject(($q, $rootScope, globals, UserAuthorizationManager) => {
//                 this.$q = $q;
//                 this.$rootScope = $rootScope;
//                 this.globals = globals;
//                 this.UserAuthorizationManager = UserAuthorizationManager;
//             });
//
//             this.resolveHandler = jasmine.createSpy("resolveHandler");
//             this.rejectHandler = jasmine.createSpy("rejectHandler");
//         });
//
//         describe("has a verify function that", () => {
//
//             beforeEach(function () {
//                 this.credentials = {};
//                 this.credentials.clientId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
//                 this.credentials.clientSecret = TestUtils.getRandomStringThatIsAlphaNumeric(10);
//             });
//
//             beforeEach(function () {
//                 this.authenticationManagerAuthenticateDeferred = this.$q.defer();
//
//                 this.AuthenticationManager.authenticate.and.returnValue(this.authenticationManagerAuthenticateDeferred.promise);
//             });
//
//             describe("when the given verification method is by SECRET", () => {
//
//                 beforeEach(function () {
//                     this.credentials.method = this.globals.USER_AUTHORIZATION.TYPES.SECRET;
//                 });
//
//                 describe("when given a clientId and clientSecret", () => {
//
//                     beforeEach(function () {
//                         this.UserAuthorizationManager.verify(this.credentials)
//                             .then(this.resolveHandler)
//                             .catch(this.rejectHandler);
//
//                         this.$rootScope.$digest();
//                     });
//
//                     describe("should behave such that it", verifyWithSecretTests);
//                 });
//
//                 describe("when NOT given a clientId", () => {
//
//                     beforeEach(function () {
//                         delete this.credentials.clientId;
//                     });
//
//                     beforeEach(function () {
//                         this.UserAuthorizationManager.verify(this.credentials)
//                             .then(this.resolveHandler)
//                             .catch(this.rejectHandler);
//
//                         this.$rootScope.$digest();
//                     });
//
//                     it("should reject with the expected value", function () {
//                         let error = "clientId is required to verify user with secret.";
//
//                         expect(this.rejectHandler).toHaveBeenCalledWith(error);
//                     });
//                 });
//
//                 describe("when NOT given a clientSecret", () => {
//
//                     beforeEach(function () {
//                         delete this.credentials.clientSecret;
//                     });
//
//                     beforeEach(function () {
//                         this.UserAuthorizationManager.verify(this.credentials)
//                             .then(this.resolveHandler)
//                             .catch(this.rejectHandler);
//
//                         this.$rootScope.$digest();
//                     });
//
//                     it("should reject with the expected value", function () {
//                         let error = "clientSecret is required to verify user with secret.";
//
//                         expect(this.rejectHandler).toHaveBeenCalledWith(error);
//                     });
//                 });
//             });
//
//             describe("when the given verification method is by FINGERPRINT", () => {
//
//                 beforeEach(function () {
//                     this.credentials.method = this.globals.USER_AUTHORIZATION.TYPES.FINGERPRINT;
//                     this.fingerprintGetProfileDeferred = this.$q.defer();
//
//                     this.FingerprintProfileUtil.getProfile.and.returnValue(this.fingerprintGetProfileDeferred.promise);
//                 });
//
//                 beforeEach(function () {
//                     this.UserAuthorizationManager.verify(this.credentials)
//                         .then(this.resolveHandler)
//                         .catch(this.rejectHandler);
//
//                     this.$rootScope.$digest();
//                 });
//
//                 it("should call FingerprintProfileUtil.getProfile with the expected values", function () {
//                     expect(this.FingerprintProfileUtil.getProfile).toHaveBeenCalledWith(this.credentials.clientId);
//                 });
//
//                 describe("when a fingerprint profile already exists", () => {
//
//                     beforeEach(function () {
//                         this.fingerprintVerifyDeferred = this.$q.defer();
//
//                         this.Fingerprint.verify.and.returnValue(this.fingerprintVerifyDeferred.promise);
//                     });
//
//                     beforeEach(function () {
//                         this.fingerprintGetProfileDeferred.resolve();
//
//                         this.$rootScope.$digest();
//                     });
//
//                     describe("should behave such that it", verifyWithFingerprintTests);
//                 });
//
//                 describe("when a fingerprint profile does NOT already exist", () => {
//
//                     beforeEach(function () {
//                         this.modalCreateByTypeDeferred = this.$q.defer();
//
//                         this.Modal.createByType.and.returnValue(this.modalCreateByTypeDeferred.promise);
//                     });
//
//                     beforeEach(function () {
//                         this.fingerprintGetProfileDeferred.reject();
//
//                         this.$rootScope.$digest();
//                     });
//
//                     it("should call LoadingIndicator.begin", function () {
//                         expect(this.LoadingIndicator.begin).toHaveBeenCalledWith();
//                     });
//
//                     it("should call AuthenticationManager.authenticate with the expected values", function () {
//                         expect(this.AuthenticationManager.authenticate).toHaveBeenCalledWith(
//                             this.credentials.clientId,
//                             this.credentials.clientSecret
//                         );
//                     });
//
//                     describe("when AuthenticationManager.authenticate resolves", () => {
//
//                         beforeEach(function () {
//                             this.resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);
//
//                             this.authenticationManagerAuthenticateDeferred.resolve(this.resolveValue);
//
//                             this.$rootScope.$digest();
//                         });
//
//                         it("should call LoadingIndicator.complete", function () {
//                             expect(this.LoadingIndicator.complete).toHaveBeenCalledWith();
//                         });
//
//                         it("should call Modal.createByType with the expected values", function () {
//                             expect(this.Modal.createByType).toHaveBeenCalledWith(this.globals.MODAL_TYPES.FINGERPRINT_AUTH_TERMS, {
//                                 scopeVars: { getTerms: jasmine.any(Function) }
//                             });
//                         });
//
//                         describe("when Modal.createByType resolves", () => {
//
//                             beforeEach(function () {
//                                 this.modal = jasmine.createSpyObj("modal", [
//                                     "hide",
//                                     "show",
//                                     "remove",
//                                     "isShown"
//                                 ]);
//                                 this.modalShowDeferred = this.$q.defer();
//
//                                 this.modal.show.and.returnValue(this.modalShowDeferred.promise);
//                             });
//
//                             beforeEach(function () {
//                                 this.modalCreateByTypeDeferred.resolve(this.modal);
//
//                                 this.$rootScope.$digest();
//                             });
//
//                             it("should call modal.show", function () {
//                                 expect(this.modal.show).toHaveBeenCalledWith();
//                             });
//
//                             describe("when modal.show resolves", () => {
//
//                                 beforeEach(function () {
//                                     this.modalShowDeferred.resolve();
//
//                                     this.$rootScope.$digest();
//                                 });
//
//                                 describe("when the FingerprintAuthTerms.accepted event is emitted", () => {
//
//                                     beforeEach(function () {
//                                         this.fingerprintLogDeferred = this.$q.defer();
//
//                                         this.FingerprintAcceptLogManager.log.and.returnValue(this.fingerprintLogDeferred.promise);
//                                     });
//
//                                     beforeEach(function () {
//                                         this.$rootScope.$broadcast("FingerprintAuthTerms.accepted");
//
//                                         this.$rootScope.$digest();
//                                     });
//
//                                     it("should call LoadingIndicator.begin", function () {
//                                         expect(this.LoadingIndicator.begin).toHaveBeenCalledWith();
//                                     });
//
//                                     it("should call FingerprintAcceptLogManager.log", function () {
//                                         expect(this.FingerprintAcceptLogManager.log).toHaveBeenCalledWith();
//                                     });
//
//                                     describe("when FingerprintAcceptLogManager.log resolves", () => {
//
//                                         beforeEach(function () {
//                                             this.modalRemoveDeferred = this.$q.defer();
//
//                                             this.modal.remove.and.returnValue(this.modalRemoveDeferred.promise);
//                                         });
//
//                                         beforeEach(function () {
//                                             this.fingerprintLogDeferred.resolve();
//
//                                             this.$rootScope.$digest();
//                                         });
//
//                                         it("should call LoadingIndicator.complete", function () {
//                                             expect(this.LoadingIndicator.complete).toHaveBeenCalledWith();
//                                         });
//
//                                         it("should call modal.remove", function () {
//                                             expect(this.modal.remove).toHaveBeenCalledWith();
//                                         });
//
//                                         describe("when modal.remove resolves", () => {
//
//                                             beforeEach(function () {
//                                                 this.fingerprintVerifyDeferred = this.$q.defer();
//
//                                                 this.Fingerprint.verify.and.returnValue(this.fingerprintVerifyDeferred.promise);
//                                             });
//
//                                             beforeEach(function () {
//                                                 this.authenticationManagerAuthenticateDeferred = this.$q.defer();
//
//                                                 this.AuthenticationManager.authenticate.and.returnValue(this.authenticationManagerAuthenticateDeferred.promise);
//                                             });
//
//                                             beforeEach(function () {
//                                                 this.modalRemoveDeferred.resolve();
//
//                                                 this.$rootScope.$digest();
//                                             });
//
//                                             describe("should behave such that it", verifyWithFingerprintTests);
//
//                                         });
//
//                                         describe("when modal.remove rejects", () => {
//
//                                             beforeEach(function () {
//                                                 this.rejectValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);
//                                                 this.modalRemoveDeferred.reject(this.rejectValue);
//
//                                                 this.$rootScope.$digest();
//                                             });
//
//                                             it("should reject with the expected value", function () {
//                                                 expect(this.rejectHandler).toHaveBeenCalledWith({
//                                                     reason: this.globals.USER_AUTHORIZATION.ERRORS.UNKNOWN,
//                                                     data: this.rejectValue
//                                                 });
//                                             });
//                                         });
//                                     });
//
//                                     describe("when FingerprintAcceptLogManager.log rejects", () => {
//
//                                         beforeEach(function () {
//                                             this.rejectValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);
//                                             this.fingerprintLogDeferred.reject(this.rejectValue);
//
//                                             this.$rootScope.$digest();
//                                         });
//
//                                         it("should reject with the expected value", function () {
//                                             expect(this.rejectHandler).toHaveBeenCalledWith({
//                                                 reason: this.globals.USER_AUTHORIZATION.ERRORS.TERMS_LOG_FAILED,
//                                                 data: this.rejectValue
//                                             });
//                                         });
//                                     });
//                                 });
//
//                                 describe("when the FingerprintAuthTerms.rejected event is emitted", () => {
//
//                                     beforeEach(function () {
//                                         this.$rootScope.$broadcast("FingerprintAuthTerms.rejected");
//
//                                         this.$rootScope.$digest();
//                                     });
//
//                                     it("should reject with the expected value", function () {
//                                         expect(this.rejectHandler).toHaveBeenCalledWith({
//                                             reason: this.globals.USER_AUTHORIZATION.ERRORS.UNKNOWN,
//                                             data: jasmine.any(Object)
//                                         });
//                                     });
//                                 });
//                             });
//
//                             describe("when modal.show rejects", () => {
//
//                                 beforeEach(function () {
//                                     this.rejectValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);
//                                     this.modalShowDeferred.reject(this.rejectValue);
//
//                                     this.$rootScope.$digest();
//                                 });
//
//                                 it("should reject with the expected value", function () {
//                                     expect(this.rejectHandler).toHaveBeenCalledWith({
//                                         reason: this.globals.USER_AUTHORIZATION.ERRORS.UNKNOWN,
//                                         data: this.rejectValue
//                                     });
//                                 });
//                             });
//                         });
//
//                         describe("when Modal.createByType rejects", () => {
//
//                             beforeEach(function () {
//                                 this.rejectValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);
//                                 this.modalCreateByTypeDeferred.reject(this.rejectValue);
//
//                                 this.$rootScope.$digest();
//                             });
//
//                             it("should reject with the expected value", function () {
//                                 expect(this.rejectHandler).toHaveBeenCalledWith({
//                                     reason: this.globals.USER_AUTHORIZATION.ERRORS.UNKNOWN,
//                                     data: this.rejectValue
//                                 });
//                             });
//                         });
//                     });
//
//                     describe("when AuthenticationManager.authenticate rejects", () => {
//
//                         beforeEach(function () {
//                             this.rejectValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);
//
//                             this.authenticationManagerAuthenticateDeferred.reject(this.rejectValue);
//
//                             this.$rootScope.$digest();
//                         });
//
//                         it("should reject with the expected value", function () {
//                             expect(this.rejectHandler).toHaveBeenCalledWith({
//                                 reason: this.globals.USER_AUTHORIZATION.ERRORS.AUTHENTICATION_ERROR,
//                                 data: this.rejectValue
//                             });
//                         });
//
//                         it("should call LoadingIndicator.complete", function () {
//                             expect(this.LoadingIndicator.complete).toHaveBeenCalledWith();
//                         });
//                     });
//                 });
//
//                 //common tests for verifyWithFingerprint
//                 function verifyWithFingerprintTests() {
//
//                     it("should call Fingerprint.verify with the expected values", function () {
//                         expect(this.Fingerprint.verify).toHaveBeenCalledWith(jasmine.objectContaining({ clientId: this.credentials.clientId }));
//                     });
//
//                     describe("when Fingerprint.verify resolves", () => {
//
//                         beforeEach(function () {
//                             this.fingerprintVerifyDeferred.resolve({ clientSecret: this.credentials.clientSecret });
//
//                             this.$rootScope.$digest();
//                         });
//
//                         describe("should behave such that it", verifyWithSecretTests);
//                     });
//
//                     describe("when Fingerprint.verify rejects", () => {
//
//                         describe("when the error is userCanceled", () => {
//
//                             beforeEach(function () {
//                                 this.rejectValue = { userCanceled: true };
//                                 this.fingerprintVerifyDeferred.reject(this.rejectValue);
//
//                                 this.$rootScope.$digest();
//                             });
//
//                             it("should reject with the expected value", function () {
//                                 expect(this.rejectHandler).toHaveBeenCalledWith({
//                                     reason: this.globals.USER_AUTHORIZATION.ERRORS.USER_CANCELED,
//                                     data: this.rejectValue
//                                 });
//                             });
//                         });
//
//                         describe("when the error is exceededAttempts", () => {
//
//                             beforeEach(function () {
//                                 this.rejectValue = { exceededAttempts: true };
//                                 this.fingerprintVerifyDeferred.reject(this.rejectValue);
//
//                                 this.$rootScope.$digest();
//                             });
//
//                             it("should reject with the expected value", function () {
//                                 expect(this.rejectHandler).toHaveBeenCalledWith({
//                                     reason: this.globals.USER_AUTHORIZATION.ERRORS.EXCEEDED_ATTEMPTS,
//                                     data: this.rejectValue
//                                 });
//                             });
//                         });
//
//                         describe("when the error doesn't have a known reason", () => {
//
//                             beforeEach(function () {
//                                 this.rejectValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);
//                                 this.fingerprintVerifyDeferred.reject(this.rejectValue);
//
//                                 this.$rootScope.$digest();
//                             });
//
//                             it("should reject with the expected value", function () {
//                                 expect(this.rejectHandler).toHaveBeenCalledWith({
//                                     reason: this.globals.USER_AUTHORIZATION.ERRORS.UNKNOWN,
//                                     data: this.rejectValue
//                                 });
//                             });
//                         });
//                     });
//                 }
//             });
//
//             describe("when the given verification method is unrecognized", () => {
//
//                 beforeEach(function () {
//                     this.credentials.method = TestUtils.getRandomStringThatIsAlphaNumeric(1);
//                 });
//
//                 beforeEach(function () {
//                     this.UserAuthorizationManager.verify(this.credentials)
//                         .then(this.resolveHandler)
//                         .catch(this.rejectHandler);
//
//                     this.$rootScope.$digest();
//                 });
//
//                 it("should reject with the expected value", function () {
//                     let error = "Unrecognized user authorization type.";
//
//                     expect(this.rejectHandler).toHaveBeenCalledWith(error);
//                 });
//             });
//
//             //common tests for UserAuthorizationManager.verifyWithSecret
//             function verifyWithSecretTests() {
//
//                 it("should call LoadingIndicator.begin", function () {
//                     expect(this.LoadingIndicator.begin).toHaveBeenCalledWith();
//                 });
//
//                 it("should call AuthenticationManager.authenticate with the expected values", function () {
//                     expect(this.AuthenticationManager.authenticate).toHaveBeenCalledWith(
//                         this.credentials.clientId,
//                         this.credentials.clientSecret
//                     );
//                 });
//
//                 describe("when AuthenticationManager.authenticate resolves", () => {
//
//                     beforeEach(function () {
//                         this.resolveValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);
//
//                         this.authenticationManagerAuthenticateDeferred.resolve(this.resolveValue);
//
//                         this.$rootScope.$digest();
//                     });
//
//                     it("should resolve with the expected value", function () {
//                         expect(this.resolveHandler).toHaveBeenCalledWith(this.resolveValue);
//                     });
//
//                     it("should call LoadingIndicator.complete", function () {
//                         expect(this.LoadingIndicator.complete).toHaveBeenCalledWith();
//                     });
//                 });
//
//                 describe("when AuthenticationManager.authenticate rejects", () => {
//
//                     beforeEach(function () {
//                         this.rejectValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);
//
//                         this.authenticationManagerAuthenticateDeferred.reject(this.rejectValue);
//
//                         this.$rootScope.$digest();
//                     });
//
//                     it("should reject with the expected value", function () {
//                         expect(this.rejectHandler).toHaveBeenCalledWith({
//                             reason: this.globals.USER_AUTHORIZATION.ERRORS.AUTHENTICATION_ERROR,
//                             data: this.rejectValue
//                         });
//                     });
//
//                     it("should call LoadingIndicator.complete", function () {
//                         expect(this.LoadingIndicator.complete).toHaveBeenCalledWith();
//                     });
//                 });
//             }
//         });
//     });
// })();
