import { CardsDetailsPage } from "../details/cards-details";
import * as _ from "lodash";
import { Component, Injector } from "@angular/core";
import { NavParams, NavController, ActionSheetController, App } from "ionic-angular";
import {
  Address,
  Card,
  Company,
  ShippingMethod,
  ShippingCarrier,
  CardReissueReason,
} from "@angular-wex/models";
import { Session } from "../../../models";
import { SecurePage } from "../../secure-page";
import { Dialogs } from "@ionic-native/dialogs";
import { Value } from "../../../decorators/value";
import { CardProvider, CardUpdateType } from "@angular-wex/api-providers";

@Component({
  selector: "page-cards-reissue",
  templateUrl: "cards-reissue.html"
})
export class CardsReissuePage extends SecurePage {

  @Value("BUTTONS") private readonly BUTTONS: any;

  public readonly CARD_REISSUE_REASONS = [CardReissueReason.DAMAGED, CardReissueReason.LOST, CardReissueReason.STOLEN];

  public card: Card;
  public selectedShippingMethod: ShippingMethod = new ShippingMethod();
  public reissueReason: CardReissueReason;
  public isReissuing: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private dialogs: Dialogs,
    private cardProvider: CardProvider,
    private app: App,
    injector: Injector
  ) {
    super("Cards.Reissue", injector, [
      Session.Field.BillingCompany
    ]);

    this.card = this.navParams.get("card");
  }

  public get availableShippingMethods(): ShippingMethod[] {
    if (this.shippingAddress.isPoBox) {
      //if user is shipping to a PO Box, only allow them to use the regular shipping method
      return [this.company.regularCardShippingMethod];
    }
    else {
      return _.sortBy(this.company.cardShippingCarrier.shippingMethods, "details.cost");
    }
  }

  public get canReissue(): boolean {
    return !!this.reissueReason && !!_.get(this.selectedShippingMethod.details, "id");
  }

  public get company(): Company {
    return this.session.billingCompany;
  }

  public get defaultShippingMethod(): ShippingMethod {
    if (this.shippingAddress.isPoBox) {
      return this.company.regularCardShippingMethod;
    }

    let defaultShippingMethod = this.shippingCarrier.defaultShippingMethod;

    if (defaultShippingMethod) {
      return defaultShippingMethod;
    }
    else if (this.company.hasRegularShippingMethod) {
      return this.company.regularCardShippingMethod;
    }
    else if (this.availableShippingMethods.length > 0) {
      return this.availableShippingMethods[0];
    }
    else {
      return null;
    }
  }

  public get reissueReasonDisplayName(): string {
    return CardReissueReason.getDisplayName(this.reissueReason);
  }

  public get shippingAddress(): Address {
    return this.company.defaultCardShippingAddress;
  }

  public get shippingCarrier(): ShippingCarrier {
    return this.company.cardShippingCarrier;
  }

  private reissue() {
    this.isReissuing = true;

    this.cardProvider.update(
      this.company.details.accountId,
      this.card.details.cardId, {
        updateType: CardUpdateType.Reissue,
        reissueReason: this.reissueReason,
        shippingMethodId: this.selectedShippingMethod.details.id
      })
      .finally(() => this.isReissuing = false)
      .subscribe((updatedCard) => {
        let cardsNav = this.app.getActiveNav();

        // Force async update to the cards list
        this.sessionCache.update$(Session.Field.Cards).subscribe();

        //Show the new details page
        cardsNav.push(CardsDetailsPage, { card: updatedCard, reissued: true })
          .then(() => cardsNav.removeView(this.app.getActiveNav().getPrevious())); //Remove the old details view

        //Close the reissue flow
        this.navCtrl.popToRoot({ animate: false });
      }, (errorResponse) => {

        console.error("Failed to reissue card: " + errorResponse);
      });
  }

  ionViewCanEnter(): Promise<boolean> {
    return super.ionViewCanEnter()
      .then(() => {
        if (this.shippingAddress.isPoBox && !this.company.hasRegularShippingMethod) {
          //TODO - show user an error
          const error = "Cannot reissue card as the default shipping address is a PO box and user doesn't have regular shipping available";
          console.error(error);
          return Promise.reject(error);
        }
        else {
          return Promise.resolve(true);
        }
      });
  }

  ionViewDidLoad() {
    this.selectedShippingMethod = this.defaultShippingMethod;
  }

  public onConfirmReissue() {
    this.dialogs.confirm(
      this.CONSTANTS.reissueConfirmationMessage,
      this.CONSTANTS.reissueConfirmationTitle,
      [
        this.BUTTONS.YES,
        this.BUTTONS.NO
      ])
      .then((result: number) => {
        if (result === 1) {
          this.reissue();
        }
      });
  }

  public onSelectReissueReason() {
    this.actionSheetCtrl.create({
      title: this.CONSTANTS.selectReason,
      buttons: this.CARD_REISSUE_REASONS.map<any>((reason) => ({
        text: CardReissueReason.getDisplayName(reason),
        handler: () => this.reissueReason = reason
      })).concat({
        text: this.BUTTONS.CANCEL,
        role: "cancel"
      })
    }).present();
  }

  public onSelectShippingMethod() {
    this.actionSheetCtrl.create({
      title: this.CONSTANTS.selectShippingMethod,
      buttons: this.availableShippingMethods.map<any>((shippingMethod) => ({
        text: shippingMethod.getDisplayName(true),
        handler: () => this.selectedShippingMethod = shippingMethod
      })).concat({
        text: this.BUTTONS.CANCEL,
        role: "cancel"
      })
    }).present();
  }
}
