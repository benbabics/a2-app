import { Component, Input } from "@angular/core";
import { Card } from "@angular-wex/models";

@Component({
  selector: "card-list-item",
  templateUrl: "./card-list-item.html"
}) export class CardListItem {
  @Input() card: Card;
}