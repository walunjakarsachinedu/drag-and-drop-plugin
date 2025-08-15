import { DropEvent, SwdEventWithTarget } from "../../types/types";
import { EventEmitter, EventHandler } from "../../util/event-emitter";
import { hasCommonElement } from "../../util/utils";
import { dropUtility } from "../utility/drop-indicator-utility";
import { SwdMouse } from "../utility/swd-mouse";

/**  
 * Emit event for element with `data-swd-targets` attribute.
*/
class DroppableZone {
  private e_hovering: EventEmitter<DropEvent> = new EventEmitter<DropEvent>();
  private swdTargets: String[]|null = null;

  constructor() {
    SwdMouse.addEventListenerWithTarget('mousemove', this._hoveringEventEmitter.bind(this));
  }
  
  /** 
   * extract swd-targets from `event` & setup hovering listener based on value of swd-targets.
  */
  listenToDroppableZone(dropZone: string|undefined) {
    if(!dropZone) return;
    this.swdTargets = dropZone.split(' ');
  }

  /**  
   * emits event when hovering droppable zone.
  */
  private _hoveringEventEmitter(event: SwdEventWithTarget) {
    if(!this.swdTargets) return;
    const target = event.target.elementRef.closest('[data-swd-zones]') as HTMLElement|null;
    if(!target) return;
    event = SwdMouse.updateTargetOfSwdEvent(event, target);
    const swdZones = SwdMouse.extractSwdZones(event)?.split(' ') ?? [];
    const isZoneDroppable = target && hasCommonElement(this.swdTargets, swdZones);
    if(!isZoneDroppable) {
      this.behaveLikeDropSpace(event, this.swdTargets);
      return;
    }

    const area = dropUtility.getDropPosition(event);
    if(area) {
      this.e_hovering.emit({...event, placement: area});
    }
    else {
      this.behaveLikeDropSpace(event, this.swdTargets);
    }
  }

  behaveLikeDropSpace(event: SwdEventWithTarget, swdTargets: String[]) {
    const dropSpace = dropUtility.getDropSpace(event.target.elementRef);
    if(!dropSpace) return;
    event = SwdMouse.updateTargetOfSwdEvent(event, dropSpace);
    const zones = dropUtility.getClosestDropZones(event, swdTargets)
    const dropTarget = dropUtility.getClosestVisibleDropZone(zones, event.mouseData);
    this.e_hovering.emit(dropUtility.toDropEvent(event, dropTarget));
  }

  cleanListener() {
    this.swdTargets = null;
  }

  onHovering(handler: EventHandler<DropEvent>) {
    this.e_hovering.addListener(handler);
  }
}

export {DroppableZone};