import { EventEmitter, EventHandler } from "../util/event-emitter";
import { extractTargetElement, hasCommonElement } from "../util/utils";

/**  
 * Emit event for element with `data-swd-targets` attribute.
*/
class DroppableZone {
  private e_hovering: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  private swdTargets: String[] = [];
  private previousHandler: any;
  
  /** 
   * extract swd-targets from `event` & setup hovering listener based on value of swd-targets.
  */
  listenToDroppableZone(dropZone: string|undefined) {
    if(!dropZone) return;

    this.swdTargets = dropZone.split(' ');
    this.cleanListener();
    this.previousHandler = this._hoveringEventEmitter.bind(this);
    document.addEventListener('mousemove', this.previousHandler);
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
    if(!this.previousHandler) return;
    document.removeEventListener('mousemove', this.previousHandler);
    this.previousHandler = null;
  }

  onHovering(handler: EventHandler<MouseEvent>) {
    this.e_hovering.addListener(handler);
  }
}

export {DroppableZone};