import { SwdEvent } from "../../types/types";
import { PlaceDropIndicator } from "../utility/place-indicator";

class DropIndicator {
  private _dropIndicator: HTMLElement = document.createElement("div");
  private _placeIndicator = new PlaceDropIndicator(this._dropIndicator);


  constructor() {
    this.hideDropIndicator();
    this._dropIndicator.classList.add('drop-indicator');
    document.body.appendChild(this._dropIndicator);
  }
  

  showDropIndicator(event: SwdEvent) {
    const target = event.target;
    if(!target) return;

    this._showElementAndEnableAnimation();
    // this._placeIndicator.showVertIndicator(event);
    this._placeIndicator.showHorizIndicator(event);
  }


  private _showElementAndEnableAnimation() {
    const styles = window.getComputedStyle(this._dropIndicator);
    if(styles.display != 'none') return;

    // show element
    this._dropIndicator.style.display = "block";

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

