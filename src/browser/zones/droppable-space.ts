import { MouseData, SwdEvent, SwdZoneElmentData } from "../../types/types";
import { EventEmitter, EventHandler } from "../../util/event-emitter";
import { hasCommonElement } from "../../util/utils";
import { SwdMouse } from "../utility/swd-mouse";


/**  
 * Emit events for element with attribute `data-swd-space`, 
 * Emits when hovered & return direct children drop zone nearest to mouse.
 * 
*/
class DroppableSpace {
  private e_hovering: EventEmitter<SwdEvent> = new EventEmitter<SwdEvent>();
  private swdTargets: String[] = [];

  constructor() {
    SwdMouse.addEventListener('mousemove', this._hoveringEventEmitter.bind(this));
  }
  
  /** 
   * extract swd-targets from `event` & setup hovering listener based on value of swd-targets.
  */
  listenToDropZones(dropZone: string|undefined) {
    if(!dropZone) return;
    this.swdTargets = dropZone.split(' ');
  }

  /**  
   * Emits hovering event for nearest drop zone under, drop space.
  */
  private _hoveringEventEmitter(event?: SwdEvent) {
    if(!event) return;
    const target = event.target.elementRef;
    const space = target.closest("[data-swd-space]");
    const zone = target.closest("[data-swd-zones]");

    if(zone || !space) return ;
    event = {...event, target: SwdMouse.getElementData(space as HTMLElement)};

    const dropZoneElement = this.getNearestDropZoneToMouse(event);
    if(!dropZoneElement) return;

    const elementData : SwdZoneElmentData = SwdMouse.getElementData(dropZoneElement);
    event.mouseData.dx = event.mouseData.x - elementData.x;
    event.mouseData.dy = event.mouseData.y - elementData.y;
    this.e_hovering.emit({...event, target: elementData});
  }
  

  private getNearestDropZoneToMouse(event: SwdEvent) : HTMLElement | null {
    const target = event.target.elementRef;
    const children = Array.from(target.querySelectorAll('[data-swd-zones]')).filter((child: Element) => {
      const swdZones = (child as HTMLElement).dataset.swdZones?.split(' ') ?? [];
      return hasCommonElement(this.swdTargets, swdZones);
    }) as HTMLElement[];
    
    if (children.length === 0) return null;

    let nearestChild: HTMLElement | null = null;
    let minDistance = Infinity;
    
    children.forEach(child => {
      const distance = this.distanceFromMouse(child, event.mouseData);
      if(distance < minDistance) {
        minDistance = distance;
        nearestChild = child;
      }
    });
    
    return nearestChild;
  }

  /** Calculates distance of mouse from center of element.  */
  distanceFromMouse(element: HTMLElement, mouseData: MouseData): number {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(Math.pow(centerX - mouseData.x, 2) + Math.pow(centerY - mouseData.y, 2));

      return distance;
  };


  cleanListener() {
    this.swdTargets = [];
  }

  onHovering(handler: EventHandler<SwdEvent>) {
    this.e_hovering.addListener(handler);
  }
}

export {DroppableSpace};