import { Area, AreaMap, DropIndicatorMode, HorizontalInsertEdge, Offset, OffsetMap, Point, ReplaceRegion, SwdEventWithTarget, SwdZoneElmentData, VerticalInsertEdge } from "../../types/types";
import { getSectionOfPoint, isPointInRectangle, parseOffsetString } from "../../util/utils";
import { SwdMouse } from "./swd-mouse";


/**
Note: The drop logic in area mode heavily depends on the diagram located in the /docs folder, under:
- area-mode-drop-area-number
- area-mode-gesture
*/
class DropIndicatorUtility {
  constructor(private _dropIndicator: HTMLElement) { }

  getDropPosition(event: SwdEventWithTarget): Area|null {
    const mode = this._getDropMode(event.target.elementRef);
    const areas = this._getClosestAreas(event, mode);
    const dropArea = this._getFirstVisibleDropArea(event.target, areas);
    return dropArea;
  }

  placeIndicatorAtArea(target: SwdZoneElmentData, area: Area) {
    if(area == "hl" || area == "hr") {
      this._showHorizIndicator(target, area);
    }
    if(area == "vt" || area == "vb") {
      this._showVertIndicator(target, area);
    }
    if(area == 'al' || area == 'ar' || area == 'at' || area == 'ab' || area == 'ac') {
      this._showAreaIndicator(target, area);
    }
  }

  /** Show indicator vertically at left or right. */
  private _showHorizIndicator(target: SwdZoneElmentData, insertEdge: HorizontalInsertEdge) {
    const offsetMap: OffsetMap = parseOffsetString(target.elementRef.dataset.swdOffset ?? "");
    const offset: Offset = {x: 10, y: 10};
    this._dropIndicator.style.height = `${target.height-offset.y}px`;
    this._dropIndicator.style.width = `0px`;

    const dropIndicatorX = (insertEdge == 'hl') 
      ? (target.x - (offsetMap["left"] ?? offset.x)) // placing at left side
      : (target.x + target.width + (offsetMap["right"] ?? offset.x)); // placing at right side

    this._dropIndicator.style.top = `${target.y+offset.y/2}px`;
    this._dropIndicator.style.left = `${dropIndicatorX}px`;
  }


  /** Show indicator horizontally at top or bottom */
  private _showVertIndicator(target: SwdZoneElmentData, insertEdge: VerticalInsertEdge) {
    const offsetMap = parseOffsetString(target.elementRef.dataset.swdOffset ?? "");
    const offset: Offset = {x: 10, y: 10};
    this._dropIndicator.style.width = `${target.width-offset.x}px`;
    this._dropIndicator.style.height = `0px`;

    const dropIndicatorY = (insertEdge == 'vt') 
      ? (target.y - (offsetMap["top"] ?? offset.y))  // placing at top side
      : (target.y + target.height + (offsetMap["bottom"] ?? offset.y));  // placing at bottom side

    this._dropIndicator.style.top = `${dropIndicatorY}px`;
    this._dropIndicator.style.left = `${target.x+offset.x/2}px`;
  }


  private _showAreaIndicator(target: SwdZoneElmentData, region: ReplaceRegion) {
    let startPoint: Point = target;
    let indicatorWidth: number = target.width; 
    let indicatorHeight: number = target.height;

    if(region == "at") { // top
      indicatorHeight = target.height/2;
    }
    else if(region == "ar") { // right
      indicatorWidth = target.width/2; 
      startPoint.x += target.width/2;
    }
    else if(region == "ab") { // bottom
      indicatorHeight = target.height/2;
      startPoint.y += target.height/2;
    }
    else if(region == "al") { // left
      indicatorWidth = target.width/2; 
    }

    this._dropIndicator.style.top = `${startPoint.y}px`;
    this._dropIndicator.style.left = `${startPoint.x}px`;

    this._dropIndicator.style.width = `${indicatorWidth-1}px`;
    this._dropIndicator.style.height = `${indicatorHeight-1}px`;
  }

  private _getDropMode(dropZone: HTMLElement) : DropIndicatorMode {
    if( dropZone.hasAttribute("data-swd-mode") 
      && dropZone.dataset.swdMode == "area") return "area";
    if(dropZone.hasAttribute("data-swd-position") 
      && dropZone.dataset.swdPosition == "vertical") return "vertical";
    return "horizontal";
  }

  private _getFirstVisibleDropArea(target: SwdZoneElmentData, areas: Area[]) : Area|null {
    const parent = target.elementRef.parentElement;
    if(!parent) return null;

    // optimization to reduce call to elementFromPoint
    const cache: Record<number, Record<number, boolean>> = {};

    // TODO: for insert mode, add new function that check is given point present on element.
    const isParentOrInside = ({x, y}: Point, dropZoneElement: Element) => {
      if(cache[x]?.[y]) return cache[x][y];
      const isFeasible = this._isPointVisibleInSwdContainers(x, y, dropZoneElement);;
      cache[x] ??= {};
      cache[x][y] = isFeasible;
      return cache[x][y];
    }

    const dropArea = areas.find(area => {
      return this._getCornerPoints(target, area).every((point) => isParentOrInside(point, target.elementRef));
    }) ?? null;

    return dropArea;
  }


  /** Return co-ordinates in this order 
   * - for area: [top-left, top-right, bottom-right, bottom-left] 
   * - for horizontal edge: [left, right] 
   * - for vertical edge: [top, bottom] 
   */
  private _getCornerPoints(target: SwdZoneElmentData, area: Area): Point[] {
    const element = target.elementRef;
    const {x, y, width: w, height: h} = target;

    const offsetMap: OffsetMap = parseOffsetString(element.dataset.swdOffset ?? "");
    /** Default offset. */
    const offset: Required<OffsetMap> = {
      left: offsetMap.left ?? 10, 
      right: offsetMap.right ?? 10, 
      top: offsetMap.top ?? 10, 
      bottom: offsetMap.bottom ?? 10,
    };

    if(area == 'hl') return [{x: x-offset.left, y: y}, {x: x-offset.left, y: y+h}];
    if(area == 'hr') return [{x: x+w+offset.right, y: y}, {x: x+w+offset.right, y: y+h}];
    if(area == 'vt') return [{x: x, y: y-offset.top}, {x: x+w, y: y-offset.top}];
    if(area == 'vb') return [{x: x, y: y+h+offset.bottom}, {x: x+w, y: y+h+offset.bottom}];

    const xw3 = x + w / 3, yh3 = y + h / 3;
    const xw23 = x + (2 * w) / 3, yh23 = y + (2 * h) / 3;
    const xw = x+w, yh = y+h;

    if(area == 'al') {
      return [{x, y}, {x: xw3, y: yh3}, {x: xw3, y: yh23}, {x, y: yh}];
    }

    if(area == 'ar') {
      return [{x: xw23, y: yh3}, {x: xw, y}, {x: xw, y: yh}, {x: xw23, y: yh23}];
    }

    if(area == 'at') {
      return [{x, y}, {x, y: yh}, {x: xw23, y: yh3}, {x: xw3, y: yh3}];
    }

    if(area == 'ab') {
      return [{x: xw3, y: yh23}, {x: xw23, y: yh23}, {x: xw, y: yh}, {x, y: yh}];
    }
    
    if(area == 'ac') {
      return [{x, y}, {x: xw, y}, {x: xw, y: yh}, {x, y: yh}];
    }

    return [];
  }


  private _getClosestAreas(event: SwdEventWithTarget, mode: DropIndicatorMode) : Area[] {
    const {target, mouseData} = event;
    const {x: mx, y: my} = SwdMouse.getMouseOffset(target.elementRef, mouseData);
    const {width, height} = target;
    switch (mode) {
      case "horizontal": {
        return (mx < width/2) ? ['hl', 'hr'] : ['hr', 'hl'];
      }
      case "vertical": {
        return (my < height/2) ? ['vt', 'vb'] : ['vb', 'vt'];
      }
      case "area": {
        return this._getNearestRegions(event);
      }
    }
  }

  /** Returns regions sorted by closeness to the mouse. */
  private _getNearestRegions(event: SwdEventWithTarget): ReplaceRegion[] {
    const areaNumber = this._getAreaNumber(event);
    const areaMap = this._prepareAreaMap(event);
    const hoveredRegion = this._getHoveredRegion(areaMap, areaNumber);

    const { x, y, width: w, height: h } = event.target;
    const { x: mx, y: my } = event.mouseData;

    const cx = x + w / 2, cy = y + h / 2;
    const xw6 = x + w / 6, yh6 = y + h / 6;
    const xw56 = x + (5 * w) / 6, yh56 = y + (5 * h) / 6;

    const d2 = (x: number, y: number) => {
      const dx = mx - x, dy = my - y;
      return dx * dx + dy * dy;
    };

    let entries: [ReplaceRegion, number][] = [
      ['al', d2(xw6,  cy)], // Left
      ['ar', d2(xw56, cy)], // Right
      ['at', d2(cx,  yh6)], // Top
      ['ab', d2(cx,  yh56)], // Bottom
      ['ac', d2(cx,  cy)], // Center
    ];

    // filtering un-feasible regions
    const areas = (Object.keys(areaMap) as (keyof AreaMap)[]).filter(area => areaMap[area].length > 0);
    entries = entries.filter(([area]) => areas.includes(area));

    // Sort by ascending distance
    entries.sort((a, b) => a[1] - b[1]);

    // If hoveredRegion is provided, move it to the front (if present)
    if (hoveredRegion) {
      const idx = entries.findIndex(([r]) => r === hoveredRegion);
      if (idx > 0) {
        const [item] = entries.splice(idx, 1);
        entries.unshift(item);
      }
    }

    return entries.map(([r]) => r);
  }

  /** Return area name from area number. */
  private _getHoveredRegion(areaMap: AreaMap, areaNumber: number): ReplaceRegion|null {
    if(areaMap.al.includes(areaNumber)) return "al";
    else if(areaMap.ar.includes(areaNumber)) return "ar";
    else if(areaMap.at.includes(areaNumber)) return "at";
    else if(areaMap.ab.includes(areaNumber)) return "ab";
    else if(areaMap.ac.includes(areaNumber)) return "ac";
    return null;
  }


  /** Return area number of area in which mouse is present. */
  private _getAreaNumber({target, mouseData}: SwdEventWithTarget) : number {
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

  /** Preparing map for drop area within drop element. Affects gestures. */
  private _prepareAreaMap({target}: SwdEventWithTarget) : AreaMap {
    const areas: string[] = (target.dataset.swdArea?.split(' ') ?? []).map(v => v.toLowerCase());
    const areaMap: AreaMap = {at: [6,7], ar: [1,8], ab: [2,3], al: [4,5], ac: [9]};
    
    if(!areas.includes('top')) {
      areaMap.al.push(6);
      areaMap.ar.push(7);
    }
    if(!areas.includes('right')) {
      areaMap.at.push(8);
      areaMap.ab.push(1);
    }
    if(!areas.includes('bottom')) {
      areaMap.ar.push(2);
      areaMap.al.push(3);
    }
    if(!areas.includes('left')) {
      areaMap.ab.push(4);
      areaMap.at.push(5);
    }

    if(!areas.includes('top')) areaMap.at = [];
    if(!areas.includes('right')) areaMap.ar = [];
    if(!areas.includes('bottom')) areaMap.ab = [];
    if(!areas.includes('left')) areaMap.al = [];
    if(!areas.includes('cover')) areaMap.ac = [];

    if(areas.length == 0) areaMap.ac = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return areaMap;
  }


  /** Check if a point is visible within data-swd-space containers only  */
  private _isPointVisibleInSwdContainers(x: number, y: number, targetElement: Element) {
    const swdContainer = this._firstSwdScrollContainers(targetElement);
    
    // If no data-swd-space containers found, point is visible (viewport only)
    if (swdContainer == null) {
      return x >= 0 && x <= window.innerWidth && y >= 0 && y <= window.innerHeight;
    }
    
    // Check visibility within each data-swd-space container
    const containerRect = swdContainer.getBoundingClientRect();
    
    if (x < containerRect.left || 
        x > containerRect.right || 
        y < containerRect.top || 
        y > containerRect.bottom) {
      return false;
    }
  
  return true;
}

 
  /** Find all scroll containers with data-swd-space attribute  */
  private _firstSwdScrollContainers(element: Element): HTMLElement|null {
    let parent = element.parentElement;
    
    while (parent && parent !== document.documentElement) {
      if (parent.hasAttribute('data-swd-space')) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }
}

export { DropIndicatorUtility };
