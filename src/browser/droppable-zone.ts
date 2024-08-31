import { EventEmitter, EventHandler } from "../util/event-emitter";
import { extractTargetElement, hasCommonElement } from "../util/utils";

/**  
 * Emit event for element with `data-swd-targets` attribute.
*/
class DroppableZone {
  private e_hovering: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  private swdTargets: String[] = [];

  constructor() {
    document.addEventListener('mousemove', this._hoveringEventEmitter.bind(this));
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
  private _hoveringEventEmitter(event: MouseEvent) {
    const target = extractTargetElement(event);
    const swdZones = target?.dataset.swdZones?.split(' ') ?? [];
    const isZoneDroppable = target && hasCommonElement(this.swdTargets, swdZones);
    if(!isZoneDroppable) return;

    this.e_hovering.emit(event);
  }

  cleanListener() {
    this.swdTargets = [];
  }

  onHovering(handler: EventHandler<MouseEvent>) {
    this.e_hovering.addListener(handler);
  }
}

export {DroppableZone};