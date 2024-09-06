import { Offset, SwdEvent } from "../../types/types";

class PlaceDropIndicator {
  constructor(private _dropIndicator: HTMLElement) { }

  showVertIndicator({target, mouseData}: SwdEvent) {
    const offset: Offset = {x: 10, y: 10};
    this._dropIndicator.style.height = `${target.height-offset.y}px`;
    this._dropIndicator.style.width = `0px`;

    const droppableWidth = this._dropIndicator.offsetWidth;
    const dropIndicatorX = (mouseData.dx < target.width/2) 
      ? (target.x - offset.x - droppableWidth/2) // placing at left side
      : (target.x + target.width + offset.x - droppableWidth/2); // placing at right side

    this._dropIndicator.style.top = `${target.y+offset.y/2}px`;
    this._dropIndicator.style.left = `${dropIndicatorX}px`;
  }


  showHorizIndicator({target, mouseData}: SwdEvent) {
    const offset: Offset = {x: 10, y: 10};
    this._dropIndicator.style.width = `${target.width-offset.x}px`;
    this._dropIndicator.style.height = `0px`;

    const droppableHeight = this._dropIndicator.offsetHeight;
    const dropIndicatorY = (mouseData.dy < target.height/2) 
      ? (target.y - offset.y - droppableHeight/2)  // placing at top side
      : (target.y + target.height + offset.y - droppableHeight/2);  // placing at bottom side

    this._dropIndicator.style.top = `${dropIndicatorY}px`;
    this._dropIndicator.style.left = `${target.x+offset.x/2}px`;
  }


  showAreaIndicator({target, mouseData}: SwdEvent) {
    // Todo: complete function
  }

}

export {PlaceDropIndicator};