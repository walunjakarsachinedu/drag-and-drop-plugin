import { Area, AreaMap, DropEvent, DropIndicatorMode, DropTarget, HorizontalInsertEdge, MouseData, Offset, OffsetMap, Point, ReplaceRegion, SwdEventWithTarget, SwdZoneElmentData, TargetAndMouseData, VerticalInsertEdge } from "../../types/types";
import { getSectionOfPoint, hasCommonElement, isPointInRectangle, parseOffsetString } from "../../util/utils";
import { SwdMouse } from "./swd-mouse";


/**
Note: The drop logic in area mode heavily depends on the diagram located in the /docs folder, under:
- area-mode-drop-area-number
- area-mode-gesture
*/
class DropIndicatorUtility {
  getDropPosition(event: TargetAndMouseData): Area|null {
    const mode = this._getDropMode(event.target.elementRef);
    const areas = this._getClosestAreas(event, mode);
    const dropArea = this._getFirstVisibleDropArea(event.target, areas);
    return dropArea;
  }

  placeIndicatorAtArea(target: SwdZoneElmentData, area: Area, _dropIndicator: HTMLElement) {
    if(area == "hl" || area == "hr") {
      this._showHorizIndicator(target, area, _dropIndicator);
    }
    if(area == "vt" || area == "vb") {
      this._showVertIndicator(target, area, _dropIndicator);
    }
    if(area == 'al' || area == 'ar' || area == 'at' || area == 'ab' || area == 'ac') {
      this._showAreaIndicator(target, area, _dropIndicator);
    }
  }

  /** Return closes ancestor drop space. */
  getDropSpace(target: HTMLElement) : HTMLElement | null {
    const dropSpace = target.closest("[data-swd-space]");
    return (dropSpace instanceof HTMLElement) ? dropSpace : null;
  }

  /** Return closest drop zone with visible drop targets */
  getClosestVisibleDropZone(dropZones: HTMLElement[], mouseData: MouseData): DropTarget | null {
    let area: Area|null = null;
    const target = dropZones.find(dropZone => {
      area = this.getDropPosition({ target: SwdMouse.getElementData(dropZone), mouseData });
      return area;
    });

    if(!target || !area) return null;

    return { target: SwdMouse.getElementData(target), area };
  }
 
  /** Returns drop zones in ascending order of their closeness to the mouse. */
  getClosestDropZones(event: SwdEventWithTarget, swdTargets: String[]): HTMLElement[] {
    const target = event.target.elementRef;
    const children = Array.from(target.querySelectorAll('[data-swd-zones]')).filter((child: Element) => {
      const swdZones = (child as HTMLElement).dataset.swdZones?.split(' ') ?? [];
      return hasCommonElement(swdTargets, swdZones);
    }) as HTMLElement[];

    return children.sort((a, b) => {
      return this._distanceFromMouse(a, event.mouseData)-this._distanceFromMouse(b, event.mouseData);
    })
  }


  toDropEvent(event: SwdEventWithTarget, dropTarget: DropTarget|null) : DropEvent {
    return { ...event, target: dropTarget?.target, placement: dropTarget?.area };
  }

  /** Show indicator vertically at left or right. */
  private _showHorizIndicator(target: SwdZoneElmentData, insertEdge: HorizontalInsertEdge, _dropIndicator: HTMLElement) {
    const offsetMap: Required<OffsetMap> = this._getSwdOffset(target.elementRef);

    _dropIndicator.style.height = `${target.height-(offsetMap.top+offsetMap.bottom)}px`;
    _dropIndicator.style.width = `0px`;

    const dropIndicatorX = (insertEdge == 'hl') 
      ? (target.x - offsetMap.left) // placing at left side
      : (target.x + target.width + offsetMap.right); // placing at right side

    _dropIndicator.style.top = `${target.y+offsetMap.top}px`;
    _dropIndicator.style.left = `${dropIndicatorX}px`;
  }


  /** Show indicator horizontally at top or bottom */
  private _showVertIndicator(target: SwdZoneElmentData, insertEdge: VerticalInsertEdge, _dropIndicator: HTMLElement) {
    const offsetMap: Required<OffsetMap> = this._getSwdOffset(target.elementRef);
    _dropIndicator.style.width = `${target.width-(offsetMap.left+offsetMap.right)}px`;
    _dropIndicator.style.height = `0px`;

    const dropIndicatorY = (insertEdge == 'vt') 
      ? (target.y - offsetMap.top)  // placing at top side
      : (target.y + target.height + offsetMap.bottom);  // placing at bottom side

    _dropIndicator.style.top = `${dropIndicatorY}px`;
    _dropIndicator.style.left = `${target.x+offsetMap.left}px`;
  }


  private _showAreaIndicator(target: SwdZoneElmentData, region: ReplaceRegion, _dropIndicator: HTMLElement) {
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

    _dropIndicator.style.top = `${startPoint.y}px`;
    _dropIndicator.style.left = `${startPoint.x}px`;

    _dropIndicator.style.width = `${indicatorWidth-1}px`;
    _dropIndicator.style.height = `${indicatorHeight-1}px`;
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

    const isPointVisible = ({x, y}: Point, dropZoneElement: Element) => {
      if(cache[x]?.[y]) return cache[x][y];
      const isFeasible = this._isPointVisibleInSwdContainers(x, y, dropZoneElement);;
      cache[x] ??= {};
      cache[x][y] = isFeasible;
      return cache[x][y];
    }

    const dropArea = areas.find(area => {
      return this._getCornerPoints(target, area).every((point) => isPointVisible(point, target.elementRef));
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

    const xw = x+w, yh = y+h;
    const xw2 = x+w/2, yh2 = y+h/2;

    if(area == 'al') {
      return [{x, y}, {x: xw2, y: y}, {x: xw2, y: yh}, {x, y: yh}];
    }

    if(area == 'ar') {
      return [{x: xw2, y}, {x: xw, y: y}, {x: xw, y: yh}, {x, y: yh2}];
    }

    if(area == 'at') {
      return [{x, y}, {x: xw, y}, {x: xw, y: yh2}, {x: x, y: yh2}];
    }

    if(area == 'ab') {
      return [{x, y: yh2}, {x: xw, y: yh2}, {x: xw, y: yh}, {x, y: yh}];
    }
    
    if(area == 'ac') {
      return [{x, y}, {x: xw, y}, {x: xw, y: yh}, {x, y: yh}];
    }

    return [];
  }


  private _getClosestAreas(event: TargetAndMouseData, mode: DropIndicatorMode) : Area[] {
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
  private _getNearestRegions(event: TargetAndMouseData): ReplaceRegion[] {
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
  private _getAreaNumber({target, mouseData}: TargetAndMouseData) : number {
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
  private _prepareAreaMap({target}: TargetAndMouseData) : AreaMap {
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
  private _isPointVisibleInSwdContainers(x: number, y: number, targetElement: Element): boolean {
    const viewport = window.visualViewport;
    if(!viewport) return false;

    const visibleWidth = (viewport.offsetLeft+viewport.width-10);
    const visibleHeight = (viewport.offsetTop+viewport.height-10);

    const isOutOfBound = x < viewport.offsetLeft || x > visibleWidth || y < viewport.offsetTop || y > visibleHeight;
    if(isOutOfBound) return false;

    // If no data-swd-space containers found, check point is in bound
    const swdContainer = this._firstSwdScrollContainers(targetElement);
    if (swdContainer == null) return false;
    
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

  /** Parses the element's data-swd-offset attribute and returns a complete offset map, 
      using default values for any sides not specified.  */
  private _getSwdOffset(
    element: HTMLElement, 
    defaultOffset: Required<OffsetMap> = {
      left: 10, 
      right: 10, 
      top: 10, 
      bottom: 10 
    }
  ): Required<OffsetMap> {
    const offsetMap: OffsetMap = parseOffsetString(element.dataset.swdOffset ?? "");
    const offset: Required<OffsetMap> = {
      left: offsetMap.left ?? defaultOffset.left, 
      right: offsetMap.right ?? defaultOffset.right, 
      top: offsetMap.top ?? defaultOffset.top, 
      bottom: offsetMap.bottom ?? defaultOffset.bottom,
    };
    return offset;
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

  /** Calculates distance of mouse from center of element.  */
  private _distanceFromMouse(element: HTMLElement, mouseData: MouseData): number {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.sqrt(Math.pow(centerX - mouseData.x, 2) + Math.pow(centerY - mouseData.y, 2));

    return distance;
  };

}


const dropUtility = new DropIndicatorUtility();

export { dropUtility };
