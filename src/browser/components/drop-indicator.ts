import { DropIndicatorMode, SwdEvent } from "../../types/types";
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

    const mode = this.getDropIndicatorMode(target.elementRef);
    switch(mode) {
      case "area": this._placeIndicator.showAreaIndicator(event); break;
      case "vertical": this._placeIndicator.showVertIndicator(event); break;
      case "horizontal": this._placeIndicator.showHorizIndicator(event); break;
    }
  }

  getDropIndicatorMode(dropZone: HTMLElement) : DropIndicatorMode {
    if( dropZone.hasAttribute("data-swd-mode") 
      && dropZone.dataset.swdMode == "area") return "area";
    if(dropZone.hasAttribute("data-swd-position") 
      && dropZone.dataset.swdPosition == "horizontal") return "horizontal";
    return "vertical";
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

