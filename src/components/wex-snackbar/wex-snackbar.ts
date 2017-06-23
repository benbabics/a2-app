import {
  Component,
  Input,
  trigger,
  transition,
  style,
  animate,
  Output,
  EventEmitter
} from "@angular/core";

type milliseconds = number;

export interface WexSnackbarAction {
  label: string;
  handler: () => boolean | void;
}

const ANIMATION_DELAY: milliseconds = 200;

export const WEX_SNACKBAR_ANIMATIONS = [
  trigger("fadeInOut", [
    transition(":enter", [
      style({ opacity: 0 }),
      animate(ANIMATION_DELAY, style({ opacity: 1.0 }))
    ]),
    transition(":leave", [
      style({ opacity: 1.0 }),
      animate(ANIMATION_DELAY, style({ opacity: 0 }))
    ]),
  ])
];

@Component({
  selector: "wex-snackbar",
  templateUrl: "wex-snackbar.html",
  animations: WEX_SNACKBAR_ANIMATIONS
})
export class WexSnackbar {

  @Input() text: string;
  @Input() action?: WexSnackbarAction;
  @Input() dismissAfter?: milliseconds;
  @Input() pushContent?: boolean = false;
  @Input() buttonTextColor?: string;

  @Output("dismissed") dismissedEmitter = new EventEmitter();

  public dismissed: boolean = false;

  ngAfterViewInit() {
    if (Number(this.dismissAfter) > 0) {
      setTimeout(() => {

      }, this.dismissAfter);
    }
  }

  private dismiss() {
    this.dismissed = true;
    // wait for the animation to finish before emitting
    setTimeout(() => this.dismissedEmitter.emit(), ANIMATION_DELAY * 2);
  }

  private performAction() {
    if (this.action.handler()) {
      this.dismiss();
    }
  }

  public get isVisible(): boolean {
    return !this.dismissed;
  }
}

export namespace WexSnackbar {
  export type Action = WexSnackbarAction;
}
