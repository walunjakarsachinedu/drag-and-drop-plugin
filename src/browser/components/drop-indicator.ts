import { DropEvent } from "../../types/types";
import { dropUtility } from "../utility/drop-indicator-utility";

class DropIndicator {
  private _dropIndicator: HTMLElement = document.createElement("div");

  constructor() {
    this.hideDropIndicator();
    this._dropIndicator.style.pointerEvents = 'none';
    this._dropIndicator.classList.add('drop-indicator');
    document.body.appendChild(this._dropIndicator);
  }
  
  showDropIndicator(event: DropEvent) {
    if(!event.target || !event.placement) {
      this.hideDropIndicator();
      return;
    }
    this._showElementAndEnableAnimation();
    dropUtility.placeIndicatorAtArea(event.target, event.placement, this._dropIndicator);
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

