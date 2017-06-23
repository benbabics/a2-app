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

interface WexSnackbarAction {
  label: string;
  handler: () => boolean | void;
}

const ANIMATION_DELAY: milliseconds = 200;

@Component({
  selector: "wex-snackbar",
  templateUrl: "wex-snackbar.html",
  animations: [
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
  ]
})
export class WexSnackbar {

  @Input() text: string;
  @Input() action?: WexSnackbarAction;
  @Input() dismissAfter?: milliseconds;
  @Input() pushContent?: boolean = false;

  @Output("dismissed") dismissedEmitter = new EventEmitter();

  public dismissed: boolean = false;

  ngAfterViewInit() {
    if (this.dismissAfter) {
      if (Number(this.dismissAfter) > 0) {
        setTimeout(() => {
          this.dismissed = true;
          // wait for the animation to finish before emitting
          setTimeout(() => this.dismissedEmitter.emit(), ANIMATION_DELAY*2);
        }, this.dismissAfter);
      }
    }
  }

  private performAction() {
    if (this.action.handler()) {
      this.dismissed = true;
      setTimeout(() => this.dismissedEmitter.emit(), ANIMATION_DELAY*2);
    }
  }

  public get isVisible(): boolean {
    return !this.dismissed;
  }
}

export namespace WexSnackbar {
  export type Action = WexSnackbarAction;
}
