import {
  TransactionProvider,
  DriverProvider,
  PaymentProvider,
  CardProvider,
  AccountProvider,
  UserProvider,
  InvoiceProvider,
  PendingTransactionSearchOptions
} from "@angular-wex/api-providers";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { SessionCache } from "../session-cache";
import {
  PostedTransaction,
  ListResponse,
  PendingTransaction,
  User,
  Company,
  Card,
  Payment,
  Driver,
  MakePaymentAvailability,
  InvoiceSummary,
  BankAccount
} from "@angular-wex/models";
import { Session } from "../../models";
import { SessionInfoRequestors, SessionInfoRequestorDetails, SessionInfoOptions } from "./session-info-requestor";
import { DynamicSessionListInfoRequestor } from "./dynamic-session-list-info-requestor";
import { Value } from "../../decorators/value";

@Injectable()
export class DefaultSessionInfoRequestors extends SessionInfoRequestors {
  @Value("INT_MAX_32") private INT_MAX_32: number;

  private readonly tokenRequestor: SessionInfoRequestorDetails = {
    requestor: (): Observable<string> => SessionCache.sessionState$.asObservable()
      .take(1)
      .map(session => Session.Field.Token in session ? session[Session.Field.Token] : null) //Fetched independently
  };

  private readonly clientSecretRequestor: SessionInfoRequestorDetails = {
    requestor: (): Observable<string> => SessionCache.sessionState$.asObservable()
      .take(1)
      .map(session => Session.Field.ClientSecret in session ? session[Session.Field.ClientSecret] : null) //Fetched independently
  };

  private readonly userRequestor: SessionInfoRequestorDetails = {
    requestor: (): Observable<User> => this.userProvider.current()
  };

  private readonly billingCompanyRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session): Observable<Company | {}> => Observable.if(() => !!session.user.billingCompany,
      this.accountProvider.get(session.user.billingCompany.details.accountId),
      Observable.empty()
    )
  };

  private readonly userCompanyRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session): Observable<Company> => this.accountProvider.get(session.user.company.details.accountId)
  };

  private readonly cardsRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session): Observable<Card[]> => this.cardProvider.search(session.user.billingCompany.details.accountId, { pageSize: this.INT_MAX_32 })
  };

  private readonly paymentsRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session): Observable<Payment[]> => this.paymentProvider.search(session.user.billingCompany.details.accountId, { pageSize: 999, pageNumber: 0 })
  };

  private readonly driversRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session): Observable<Driver[]> => this.driverProvider.search(session.user.company.details.accountId, { pageSize: this.INT_MAX_32 })
  };

  private readonly pendingTransactionsRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session, params: SessionInfoOptions<PendingTransactionSearchOptions>): Observable<PendingTransaction[]> => {
      if (session.user.isClassic) {
        // Pending transactions aren't available in Classic.
        return Observable.of([]);
      }
      else {
        return this.transactionProvider.searchPending(session.user.billingCompany.details.accountId, params.requestParams).map(response => response.values);
      }
    }
  };

  private readonly postedTransactionsInfoRequestor: PostedTransactionRequestor = new PostedTransactionRequestor(this.transactionProvider);

  private readonly postedTransactionsRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.PostedTransactionsInfo],
    dependentRequestor: true,
    requestor: (session: Session): Observable<PostedTransaction[]> => Observable.of(session.postedTransactionsInfo.items)
  };

  private readonly filteredPostedTransactionsInfoRequestor: PostedTransactionRequestor = new PostedTransactionRequestor(this.transactionProvider);

  private readonly filteredPostedTransactionsRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.FilteredPostedTransactionsInfo],
    dependentRequestor: true,
    requestor: (session: Session): Observable<PostedTransaction[]> => Observable.of(session.filteredPostedTransactionsInfo.items)
  };

  private readonly makePaymentAvailabilityRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session): Observable<MakePaymentAvailability> => this.paymentProvider.getMakePaymentAvailability(session.user.company.details.accountId)
  };

  private readonly invoiceSummaryRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session): Observable<InvoiceSummary> => this.invoiceProvider.current(session.user.billingCompany.details.accountId)
  };

  private readonly bankAccountsRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session): Observable<BankAccount[]> => this.paymentProvider.getActiveBanks(session.user.billingCompany.details.accountId)
  };

  constructor(
    private userProvider: UserProvider,
    private accountProvider: AccountProvider,
    private cardProvider: CardProvider,
    private paymentProvider: PaymentProvider,
    private driverProvider: DriverProvider,
    private transactionProvider: TransactionProvider,
    private invoiceProvider: InvoiceProvider
  ) {
    super();

    this.buildDictionary();
  }

  private buildDictionary() {
    this._requestors[Session.Field.Token] = this.tokenRequestor;
    this._requestors[Session.Field.ClientSecret] = this.clientSecretRequestor;
    this._requestors[Session.Field.User] = this.userRequestor;
    this._requestors[Session.Field.BillingCompany] = this.billingCompanyRequestor;
    this._requestors[Session.Field.UserCompany] = this.userCompanyRequestor;
    this._requestors[Session.Field.Cards] = this.cardsRequestor;
    this._requestors[Session.Field.Payments] = this.paymentsRequestor;
    this._requestors[Session.Field.Drivers] = this.driversRequestor;
    this._requestors[Session.Field.PendingTransactions] = this.pendingTransactionsRequestor;
    this._requestors[Session.Field.PostedTransactionsInfo] = this.postedTransactionsInfoRequestor;
    this._requestors[Session.Field.PostedTransactions] = this.postedTransactionsRequestor;
    this._requestors[Session.Field.MakePaymentAvailability] = this.makePaymentAvailabilityRequestor;
    this._requestors[Session.Field.InvoiceSummary] = this.invoiceSummaryRequestor;
    this._requestors[Session.Field.BankAccounts] = this.bankAccountsRequestor;

    this._requestors[Session.Field.FilteredPendingTransactions] = this.pendingTransactionsRequestor;
    this._requestors[Session.Field.FilteredPostedTransactionsInfo] = this.filteredPostedTransactionsInfoRequestor;
    this._requestors[Session.Field.FilteredPostedTransactions] = this.filteredPostedTransactionsRequestor;
  }
}

//# Dynamic List Info Requestors

export class PostedTransactionRequestor extends DynamicSessionListInfoRequestor<PostedTransaction, PostedTransaction.Details> {

  constructor(private transactionProvider: TransactionProvider) {
    super(PostedTransaction, "transactionId", [Session.Field.User]);
  }

  protected search$(session: Session, params: any): Observable<ListResponse<PostedTransaction>> {
     return this.transactionProvider.searchPosted(session.user.billingCompany.details.accountId, params);
  }
}