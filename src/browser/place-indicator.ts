import { IndicatorPositionData } from "../types/types";

class PlaceDropIndicator {
  constructor(private _dropIndicator: HTMLElement) { }

  showVertIndicator({element, mouseData, offset}: IndicatorPositionData) {
    this._dropIndicator.style.height = `${element.height-offset.y}px`;
    this._dropIndicator.style.width = `0px`;

    const droppableWidth = this._dropIndicator.offsetWidth;
    const dropIndicatorX = (mouseData.dx < element.width/2) 
      ? (element.x - offset.x - droppableWidth/2) 
      : (element.x + offset.x + element.width - droppableWidth/2);

    this._dropIndicator.style.top = `${element.y+offset.y/2}px`;
    this._dropIndicator.style.left = `${dropIndicatorX}px`;
  }


  showHorizIndicator({element, mouseData, offset}: IndicatorPositionData) {
    // Todo: complete function
  }


  showAreaIndicator({element, mouseData, offset}: IndicatorPositionData) {
    // Todo: complete function
  }

}

export {PlaceDropIndicator};