import { SwdEvent } from "../types/types";
import { EventEmitter, EventHandler } from "../util/event-emitter";
import { hasCommonElement } from "../util/utils";
import { SwdMouse } from "./swd-mouse";

/**  
 * Emit event for element with `data-swd-targets` attribute.
*/
class DroppableZone {
  private e_hovering: EventEmitter<SwdEvent> = new EventEmitter<SwdEvent>();
  private swdTargets: String[] = [];

  constructor() {
    SwdMouse.addEventListener('mousemove', this._hoveringEventEmitter.bind(this));
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
  private _hoveringEventEmitter(event: SwdEvent) {
    const target = event.target;
    const swdZones = SwdMouse.extractSwdZones(event)?.split(' ') ?? [];
    const isZoneDroppable = target && hasCommonElement(this.swdTargets, swdZones);
    if(!isZoneDroppable) return;

    this.e_hovering.emit(event);
  }

  cleanListener() {
    this.swdTargets = [];
  }

  onHovering(handler: EventHandler<SwdEvent>) {
    this.e_hovering.addListener(handler);
  }
}

export {DroppableZone};