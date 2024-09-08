import { AreaMap, Offset, Point, SwdEvent } from "../../types/types";
import { getSectionOfPoint, isPointInRectangle, parseOffsetString } from "../../util/utils";

class PlaceDropIndicator {
  constructor(private _dropIndicator: HTMLElement) { }

  showVertIndicator({target, mouseData}: SwdEvent) {
    const offsetMap = parseOffsetString(target.elementRef.dataset.swdOffset ?? "");
    const offset: Offset = {x: 10, y: 10};
    this._dropIndicator.style.height = `${target.height-offset.y}px`;
    this._dropIndicator.style.width = `0px`;

    const droppableWidth = this._dropIndicator.offsetWidth;
    const dropIndicatorX = (mouseData.dx < target.width/2) 
      ? (target.x - (offsetMap["left"] ?? offset.x)) // placing at left side
      : (target.x + target.width + (offsetMap["right"] ?? offset.x)); // placing at right side

    this._dropIndicator.style.top = `${target.y+offset.y/2}px`;
    this._dropIndicator.style.left = `${dropIndicatorX}px`;
  }


  showHorizIndicator({target, mouseData}: SwdEvent) {
    const offsetMap = parseOffsetString(target.elementRef.dataset.swdOffset ?? "");
    const offset: Offset = {x: 10, y: 10};
    this._dropIndicator.style.width = `${target.width-offset.x}px`;
    this._dropIndicator.style.height = `0px`;

    const droppableHeight = this._dropIndicator.offsetHeight;
    const dropIndicatorY = (mouseData.dy < target.height/2) 
      ? (target.y - (offsetMap["top"] ?? offset.y))  // placing at top side
      : (target.y + target.height + (offsetMap["bottom"] ?? offset.y));  // placing at bottom side

    this._dropIndicator.style.top = `${dropIndicatorY}px`;
    this._dropIndicator.style.left = `${target.x+offset.x/2}px`;
  }


  showAreaIndicator(event: SwdEvent) {
    const {target} = event;
    const areaNumber = this._getAreaNumber(event);
    const areaMap = this._prepareAreaMap(event);
 
    var startPoint: Point = target;
    var indicatorWidth: number = target.width; 
    var indicatorHeight: number = target.height;

    if(areaNumber==9 && areaMap.cover.length == 0) return;

    if(areaMap.top.includes(areaNumber)) {
      indicatorHeight = target.height/2;
    }
    else if(areaMap.right.includes(areaNumber)) {
      indicatorWidth = target.width/2; 
      startPoint.x += target.width/2;
    }
    else if(areaMap.bottom.includes(areaNumber)) {
      indicatorHeight = target.height/2;
      startPoint.y += target.height/2;
    }
    else if(areaMap.left.includes(areaNumber)) {
      indicatorWidth = target.width/2; 
    }

    this._dropIndicator.style.top = `${startPoint.y}px`;
    this._dropIndicator.style.left = `${startPoint.x}px`;

    this._dropIndicator.style.width = `${indicatorWidth-1}px`;
    this._dropIndicator.style.height = `${indicatorHeight-1}px`;
  }


  private _getAreaNumber({target, mouseData}: SwdEvent) : number {
    if(isPointInRectangle({
      topLeftPoint: {
        x: target.x + target.width/3, 
        y: target.y + target.height/3
      },
      bottomRightPoint: {
        x: target.x + target.width*2/3, 
        y: target.y + target.height*2/3
      },
      point: mouseData,
    })) return 9;

    return getSectionOfPoint({
      rectHeight: target.height,
      rectWidth: target.width,
      rectPosition: target,
      point: mouseData,
    });
  }

  private _prepareAreaMap({target}: SwdEvent) : AreaMap {
    const areas: String[] = (target.dataset.swdArea?.split(' ') ?? []).map(v => v.toLowerCase());
    const areaMap: AreaMap = {top: [6,7], right: [1,8], bottom: [2,3], left: [4,5], cover: [9]};
    
    if(!areas.includes('top')) {
      areaMap.left.push(6);
      areaMap.right.push(7);
    }
    if(!areas.includes('right')) {
      areaMap.top.push(8);
      areaMap.bottom.push(1);
    }
    if(!areas.includes('bottom')) {
      areaMap.right.push(2);
      areaMap.left.push(3);
    }
    if(!areas.includes('left')) {
      areaMap.bottom.push(4);
      areaMap.top.push(5);
    }

    if(!areas.includes('top')) areaMap.top = [];
    if(!areas.includes('right')) areaMap.right = [];
    if(!areas.includes('bottom')) areaMap.bottom = [];
    if(!areas.includes('left')) areaMap.left = [];
    if(!areas.includes('cover')) areaMap.cover = [];

    return areaMap;
  }
  
}

export {PlaceDropIndicator};