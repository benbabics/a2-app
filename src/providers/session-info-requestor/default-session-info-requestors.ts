import {
  TransactionProvider,
  DriverProvider,
  PaymentProvider,
  CardProvider,
  AccountProvider,
  UserProvider,
  InvoiceProvider
} from "@angular-wex/api-providers";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { SessionCache } from "../session-cache";
import {
  Transaction,
  ListResponse
} from "@angular-wex/models";
import {
  TransactionList,
  Session
} from "../../models";
import { SessionInfoRequestors, SessionInfoRequestorDetails } from "./session-info-requestor";
import { DynamicSessionListInfoRequestor } from "./dynamic-session-list-info-requestor";

@Injectable()
export class DefaultSessionInfoRequestors extends SessionInfoRequestors {

  private readonly tokenRequestor: SessionInfoRequestorDetails = {
    requestor: () => Observable.of(SessionCache.cachedValues.token) //Fetched independently
  };

  private readonly userRequestor: SessionInfoRequestorDetails = {
    requestor: () => this.userProvider.current()
  };

  private readonly billingCompanyRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session) => Observable.if(() => !!session.user.billingCompany,
      this.accountProvider.get(session.user.billingCompany.details.accountId),
      Observable.empty()
    )
  };

  private readonly userCompanyRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session) => this.accountProvider.get(session.user.company.details.accountId)
  };

  private readonly cardsRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session) => this.cardProvider.search(session.user.billingCompany.details.accountId)
  };

  private readonly paymentsRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session) => this.paymentProvider.search(session.user.billingCompany.details.accountId, { pageSize: 999, pageNumber: 0 })
  };

  private readonly driversRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session) => this.driverProvider.search(session.user.company.details.accountId)
  };

  private readonly postedTransactionsInfoRequestor: SessionInfoRequestorDetails = new PostedTransactionRequestor(this.transactionProvider);

  private readonly postedTransactionsRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.PostedTransactionsInfo],
    dependentRequestor: true,
    requestor: (session: Session) => Observable.of(session.postedTransactionsInfo.items)
  };

  private readonly makePaymentAvailabilityRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session) => this.paymentProvider.getMakePaymentAvailability(session.user.company.details.accountId)
  };

  private readonly invoiceSummaryRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session) => this.invoiceProvider.current(session.user.billingCompany.details.accountId)
  };

  private readonly bankAccountsRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: Session) => this.paymentProvider.getActiveBanks(session.user.billingCompany.details.accountId)
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
    this._requestors[Session.Field.User] = this.userRequestor;
    this._requestors[Session.Field.BillingCompany] = this.billingCompanyRequestor;
    this._requestors[Session.Field.UserCompany] = this.userCompanyRequestor;
    this._requestors[Session.Field.Cards] = this.cardsRequestor;
    this._requestors[Session.Field.Payments] = this.paymentsRequestor;
    this._requestors[Session.Field.Drivers] = this.driversRequestor;
    //this._requestors[Session.Field.PendingTransactionsInfo] = this.pendingTransactionsRequestor;
    this._requestors[Session.Field.PostedTransactionsInfo] = this.postedTransactionsInfoRequestor;
    this._requestors[Session.Field.PostedTransactions] = this.postedTransactionsRequestor;
    this._requestors[Session.Field.MakePaymentAvailability] = this.makePaymentAvailabilityRequestor;
    this._requestors[Session.Field.InvoiceSummary] = this.invoiceSummaryRequestor;
    this._requestors[Session.Field.BankAccounts] = this.bankAccountsRequestor;
  }
}

//# Dynamic List Info Requestors

class PostedTransactionRequestor extends DynamicSessionListInfoRequestor<Transaction, Transaction.Details> {

  protected readonly listMergeId: keyof Transaction.Details = "transactionId";

  constructor(private transactionProvider: TransactionProvider) {
    super(Transaction, [Session.Field.User]);
  }

  protected get dynamicList(): TransactionList {
    return SessionCache.cachedValues.postedTransactionsInfo;
  }

  protected set dynamicList(dynamicList: TransactionList) {
    SessionCache.cachedValues.postedTransactionsInfo = dynamicList;
  }

  protected search(session: Session, params: any): Observable<ListResponse<Transaction>> {
     return this.transactionProvider.searchPosted(session.user.billingCompany.details.accountId, params);
  }
}
