import { CardsDetailsPage } from "../details/cards-details";
import { Observable } from "rxjs";
import * as _ from "lodash";
import { Component } from "@angular/core";
import { NavParams, NavController, ActionSheetController, App } from "ionic-angular";
import { 
  Address, 
  Card, 
  Company, 
  ShippingMethod, 
  ShippingCarrier, 
  CardReissueReason 
} from "../../../models";
import { SecurePage } from "../../secure-page";
import { AccountProvider, CardProvider, CardUpdateType } from "../../../providers";
import { Dialogs } from "@ionic-native/dialogs";
import { WexAppBannerController } from "../../../components";
import { Value } from "../../../decorators/value";

@Component({
  selector: "page-cards-reissue",
  templateUrl: "cards-reissue.html"
})
export class CardsReissuePage extends SecurePage {

  @Value("BUTTONS") private readonly BUTTONS: any;

  public readonly CARD_REISSUE_REASONS = [CardReissueReason.DAMAGED, CardReissueReason.LOST, CardReissueReason.STOLEN];

  public card: Card;
  public company: Company;
  public selectedShippingMethod: ShippingMethod = new ShippingMethod();
  public reissueReason: CardReissueReason;
  public isReissuing: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private accountProvider: AccountProvider,
    private actionSheetCtrl: ActionSheetController,
    private dialogs: Dialogs,
    private cardProvider: CardProvider,
    private app: App,
    private appBannerController: WexAppBannerController
  ) {
    super("Cards.Reissue");

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

        //Show the new details page
        //TODO - Cache?
        cardsNav.push(CardsDetailsPage, { card: updatedCard, reissued: true })
          .then(() => cardsNav.removeView(this.app.getActiveNav().getPrevious())); //Remove the old details view

        //Close the reissue flow
        this.navCtrl.popToRoot({ animate: false });
      }, (errorResponse) => {
        //this.appBannerController.error(this.CONSTANTS.reissueError);

        console.error("Failed to reissue card: " + errorResponse);
      });
  }

  ionViewCanEnter(): Promise<any> | boolean {
    if (!super.ionViewCanEnter()) {
      return false;
    }

    //get the company info
    //TODO - Cache the response
    return this.accountProvider.get(this.session.details.user.billingCompany.details.accountId)
      .map((company: Company) => this.company = company)
      .flatMap(() => {
        if (this.shippingAddress.isPoBox && !this.company.hasRegularShippingMethod) {
          //TODO - show user an error
          const error = "Cannot reissue card as the default shipping address is a PO box and user doesn't have regular shipping available";
          console.error(error);
          return Observable.throw(error);
        }
        else {
          return Observable.empty();
        }
      })
      .toPromise();
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
