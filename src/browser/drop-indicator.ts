import { IndicatorPositionData, MouseData, Offset, SwdZoneElmentData } from "../types/types";
import { PlaceDropIndicator } from "./place-indicator";

class DropIndicator {
  private _dropIndicator: HTMLElement = document.createElement("div");
  private _placeIndicator = new PlaceDropIndicator(this._dropIndicator);


  constructor() {
    this._dropIndicator.classList.add('drop-indicator');
    this._dropIndicator.style.display = "none";
    document.body.appendChild(this._dropIndicator);
  }
  

  showDropIndicator(event: MouseEvent) {
    const target = event.target as HTMLElement|null|undefined;
    if(!target) return;

    this._showElementAndEnableAnimation();

    const dropData = this._prepareIndicatorPositionData(event, target);
    this._placeIndicator.showVertIndicator(dropData);
  }


  private _prepareIndicatorPositionData(event: MouseEvent, target: HTMLElement) : IndicatorPositionData {
    const height = target.offsetHeight, width = target.offsetHeight;
    const x = target.offsetLeft, y = target.offsetTop;
    const mouseX = event.pageX, mouseY = event.pageY;
    const dx = mouseX-x, dy = mouseY-y;
    const xOffset = 10, yOffset = 20;

    const swdZoneElement: SwdZoneElmentData = { x, y, width, height};
    const mouseData: MouseData = { x: mouseX, y: mouseY, dx, dy, dataset: target.dataset};
    const offset: Offset = {x: xOffset, y: yOffset};

    return {element: swdZoneElement, mouseData: mouseData, offset: offset};
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

