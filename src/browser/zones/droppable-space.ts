import { DropTarget, MouseData, DropEvent, SwdEventWithTarget } from "../../types/types";
import { EventEmitter, EventHandler } from "../../util/event-emitter";
import { dropUtility } from "../utility/drop-indicator-utility";
import { SwdMouse, SwdSubscription } from "../utility/swd-mouse";


/**  
 * Emit events for element with attribute `data-swd-space`, 
 * Emits when hovered & return direct children drop zone nearest to mouse.
 * 
*/
class DroppableSpace {
  private e_hovering: EventEmitter<DropEvent> = new EventEmitter<DropEvent>();
  private swdTargets: String[] = [];
  private swdMouseSubscription: SwdSubscription|null = null;

  
  /** 
   * extract swd-targets from `event` & setup hovering listener based on value of swd-targets.
  */
  listenToDropZones(dropZone: string|undefined) {
    if(!dropZone) return;
    this.swdMouseSubscription = SwdMouse.addEventListenerWithTarget('mousemove', this._hoveringEventEmitter.bind(this));
    this.swdTargets = dropZone.split(' ');
  }

  /**  
   * Emits hovering event for nearest drop zone under, drop space.
  */
  private _hoveringEventEmitter(event: SwdEventWithTarget) {
    const dropSpace = this.getNonZoneDropSpace(event.target.elementRef);
    if(!dropSpace) return ;

    event = SwdMouse.updateTargetOfSwdEvent(event, dropSpace);
    const dropTarget = this.getNearestDropTargetToMouse(event);

    this.e_hovering.emit(dropUtility.toDropEvent(event, dropTarget));
  }


  /** Return closest drop space if no drop zone exists in target's ancestors chain. */ 
  private getNonZoneDropSpace(target: HTMLElement): HTMLElement | null {
    const space = target.closest("[data-swd-space]");
    const zone = target.closest("[data-swd-zones]");

    if(zone || !space || !(space instanceof HTMLElement)) return null;
    return space;
  }

  /** Return first feasible drop zone with visible drop area|position. */
  private getNearestDropTargetToMouse(event: SwdEventWithTarget) : DropTarget | null {
    const zones = dropUtility.getClosestDropZones(event, this.swdTargets);
    const dropTarget = dropUtility.getClosestVisibleDropZone(zones, event.mouseData);

    return dropTarget;
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
    if(this.swdMouseSubscription) {
      SwdMouse.clearEventListener("mousemove", this.swdMouseSubscription);
      this.swdMouseSubscription = null;
    }
    this.swdTargets = [];
  }

  onHovering(handler: EventHandler<DropEvent>) {
    this.e_hovering.addListener(handler);
  }
}

export {DroppableSpace};