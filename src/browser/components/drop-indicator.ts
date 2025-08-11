import { DropIndicatorMode, SwdEventWithTarget } from "../../types/types";
import { DropIndicatorUtility } from "../utility/drop-indicator-utility";

class DropIndicator {
  private _dropIndicator: HTMLElement = document.createElement("div");
  private _dropUtility = new DropIndicatorUtility(this._dropIndicator);


  constructor() {
    this.hideDropIndicator();
    this._dropIndicator.style.pointerEvents = 'none';
    this._dropIndicator.classList.add('drop-indicator');
    document.body.appendChild(this._dropIndicator);
  }
  

  showDropIndicator(event: SwdEventWithTarget) {
    const target = event.target;
    if(!target) return;

    this._showElementAndEnableAnimation();
    const pos = this._dropUtility.getDropPosition(event);
    if(pos) {
      this._dropUtility.placeIndicatorAtArea(target, pos);
    }
  }

  private _showElementAndEnableAnimation() {
    const styles = window.getComputedStyle(this._dropIndicator);
    if(styles.display != 'none') return;

    // show element
    this._dropIndicator.style.display = "block";
    this._dropIndicator.style.pointerEvents = 'none';

    // enable animation
    const transition = styles.transition;
    this._dropIndicator.style.transition = 'none';
    setTimeout(() => {
      this._dropIndicator.style.transition = transition;
    });
  }

  
  hideDropIndicator() {
    this._dropIndicator.style.display = "none";
  }
}


export {DropIndicator};

