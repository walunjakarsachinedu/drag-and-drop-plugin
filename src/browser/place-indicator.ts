import { Offset, SwdEvent } from "../types/types";

class PlaceDropIndicator {
  constructor(private _dropIndicator: HTMLElement) { }

  showVertIndicator({target, mouseData}: SwdEvent) {
    const offset: Offset = {x: 10, y: 10};
    this._dropIndicator.style.height = `${target.height-offset.y}px`;
    this._dropIndicator.style.width = `0px`;

    const droppableWidth = this._dropIndicator.offsetWidth;
    const dropIndicatorX = (mouseData.dx < target.width/2) 
      ? (target.x - offset.x - droppableWidth/2) 
      : (target.x + offset.x + target.width - droppableWidth/2);

    this._dropIndicator.style.top = `${target.y+offset.y/2}px`;
    this._dropIndicator.style.left = `${dropIndicatorX}px`;
  }


  showHorizIndicator({target, mouseData}: SwdEvent) {
    // Todo: complete function
  }


  showAreaIndicator({target, mouseData}: SwdEvent) {
    // Todo: complete function
  }

}

export {PlaceDropIndicator};